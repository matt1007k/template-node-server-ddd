import { selectGroup } from "@/groups/domain/models";
import { AppError } from "@/shared/domain/models";
import {
  IDataWithPagination,
  MessageMapTypePrisma,
  TPrismaService,
  messageMapPrisma,
  paginate,
} from "@/shared/infrastructure/db";
import { Prisma } from "@prisma/client";
import { ICreateUserDto, IUpdateUserDto } from "../../domain/dtos";
import { UserModel } from "../../domain/models";
import {
  IFindAllUsers,
  IUserRepository,
  selectAttributeUser,
} from "../../domain/repositories";

const fieldsSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  username: true,
  firstName: true,
  first_lastName: true,
  second_lastName: true,
  avatarUrl: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

export class PrismaUserRepository implements IUserRepository {
  constructor(private db: TPrismaService) {}
  async findByEmail(email: string): Promise<UserModel | null> {
    try {
      return await this.db.user.findUnique({
        where: { email },
        select: fieldsSelect,
      });
    } catch (error: any) {
      throw new AppError({
        message: error.message,
        errorCode: "Error",
        statusCode: 500,
      });
    }
  }

  async findByUsername(username: string): Promise<UserModel | null> {
    try {
      return await this.db.user.findUnique({
        where: { username },
        select: { ...fieldsSelect, password: true },
      });
    } catch (error: any) {
      throw new AppError({
        message: error.message,
        errorCode: "Error",
        statusCode: 500,
      });
    }
  }

  async findAll({
    page,
    perPage,
    term,
    dateFrom,
    dateTo,
    status,
  }: IFindAllUsers): Promise<
    IDataWithPagination<Omit<UserModel, "password">[]>
  > {
    const { data, meta } = await paginate(
      this.db.user,
      {
        orderBy: {
          createdAt: "desc",
        },
        where: {
          ...(term && {
            OR: [
              {
                username: { contains: term, mode: "insensitive" },
              },
              {
                firstName: { contains: term, mode: "insensitive" },
              },
              {
                first_lastName: { contains: term, mode: "insensitive" },
              },
              {
                second_lastName: { contains: term, mode: "insensitive" },
              },
              {
                email: { contains: term, mode: "insensitive" },
              },
            ],
          }),
          ...(status && {
            AND: [{ status }],
          }),
          // array values some
          // ...(role && {
          //   role: { hasSome: role.split(",") },
          // }),
          ...(dateFrom &&
            dateTo && {
              OR: [
                {
                  createdAt: {
                    gte: new Date(dateFrom).toISOString(),
                    lte: new Date(dateTo).toISOString(),
                  },
                },
              ],
            }),
        },
        select: fieldsSelect,
      },
      {
        page: page,
        perPage: perPage,
      }
    );

    return { data: data as UserModel[], metadata: meta };
  }

  async create({
    ...data
  }: ICreateUserDto): Promise<Omit<UserModel, "password">> {
    try {
      const { password, ...res } = await this.db.user.create({
        data,
      });
      return res;
    } catch (error: any) {
      console.log(error);

      const message =
        messageMapPrisma[error.code as MessageMapTypePrisma]("El user");
      throw new AppError({
        message: message,
        errorCode: "Error",
      });
    }
  }

  async update(
    id: string,
    data: IUpdateUserDto
  ): Promise<Omit<UserModel, "password">> {
    try {
      const { password, ...res } = await this.db.user.update({
        where: { id },
        data,
      });
      return res;
    } catch (error: any) {
      const message =
        messageMapPrisma[error.code as MessageMapTypePrisma]("El user");
      throw new AppError({
        message: message,
        errorCode: "Error",
      });
    }
  }

  async findById(id: string): Promise<Omit<UserModel, "password"> | null> {
    try {
      return await this.db.user.findFirst({
        where: { id },
        select: {
          ...selectAttributeUser,
          groups: {
            select: {
              id: true,
              group: {
                select: {
                  ...selectGroup,
                  permissions: {
                    select: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } catch (error: any) {
      console.log(error);
      const message =
        messageMapPrisma[error.code as MessageMapTypePrisma]("El user");
      throw new AppError({
        message: message,
        errorCode: "Error",
      });
    }
  }
  async deleteById(id: string): Promise<Omit<UserModel, "password">> {
    try {
      return await this.db.user.delete({ where: { id } });
    } catch (error: any) {
      const message =
        messageMapPrisma[error.code as MessageMapTypePrisma]("El user");
      throw new AppError({
        message: message,
        errorCode: "Error",
      });
    }
  }
}
