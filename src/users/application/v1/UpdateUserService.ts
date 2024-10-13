import { AppError } from "@/shared/domain/models";
import {
  IEncryptProvider,
  IUploadFileProvider,
} from "@/shared/infrastructure/containers";
import { isEmpty } from "@/shared/utils";
import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { UserModel } from "../../domain/models";
import { IUserRepository } from "../../domain/repositories";

interface IRequest extends Prisma.UserUpdateInput {
  id: string;
  password?: string;
}

export class UpdateUserService {
  constructor(
    private userRepository: IUserRepository,
    private encryptProvider: IEncryptProvider,
    private uploadLocalProvider: IUploadFileProvider
  ) {}

  async execute({
    id,
    password,
    avatarUrl,
    ...data
  }: IRequest): Promise<{ data: Omit<UserModel, "password"> }> {
    try {
      const userExist = await this.userRepository.findById(id);

      if (!userExist) {
        throw new AppError({
          message: "El usuario no existe",
          statusCode: httpStatus.NOT_FOUND,
        });
      }

      let newAvatarUrl = userExist.avatarUrl;
      if (avatarUrl && avatarUrl !== userExist.avatarUrl) {
        const destinationDir = "uploads/avatar";
        newAvatarUrl =
          avatarUrl &&
          (await this.uploadLocalProvider
            .moveFileToPath(avatarUrl as string, destinationDir)
            .catch((error) => {
              console.log("ERROR", error);

              throw new AppError({ message: error.toString() });
            }));
        !isEmpty(userExist.avatarUrl) &&
          (await this.uploadLocalProvider.removeFileByPath(
            userExist?.avatarUrl!
          ));
      }

      const response = await this.userRepository.update(id, {
        ...data,
        ...(password && {
          password: await this.encryptProvider.hash(password),
        }),
        avatarUrl: newAvatarUrl,
      });

      return { data: response };
    } catch (error: any) {
      console.log("error", error);
      throw new AppError({
        message: error.message,
      });
    }
  }
}
