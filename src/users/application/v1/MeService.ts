import { UserModel } from "@/users/domain/models";
import { AppError } from "@/shared/domain/models";
import { IServiceResponse } from "@/shared/infrastructure/http/models";
import { IUserRepository } from "../../domain/repositories";

interface IRequest {
  userId: string;
}

export class MeService {
  constructor(private userRepository: IUserRepository) {}

  async execute({ userId }: IRequest): Promise<any> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError({
        message: "El user logueado no existe",
      });
    }
    // const userWithPermissions = user as UserModel & {
    //   groupOffices?: OfficeGroupModel[] | null;
    // };
    // const { groupOffices, ...userWithoutGroupOffices } = userWithPermissions;

    return {
      message: "Successful",
      code: "000000",
      data: {
        ...user,
        // ...userWithoutGroupOffices,
        // groups: groupOffices?.map(({ group, ...other }) => ({
        //   ...other,
        //   group: {
        //     id: group?.id,
        //     description: group?.description,
        //     permissions: group?.permissions?.flatMap(
        //       (permission) => permission.permission
        //     ),
        //   },
        // })),
      },
    } as IServiceResponse<UserModel>;
  }
}
