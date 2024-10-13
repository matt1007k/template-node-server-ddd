import { AppError } from "@/shared/domain/models";
import { IUploadFileProvider } from "@/shared/infrastructure/containers";
import { isEmpty } from "@/shared/utils";
import httpStatus from "http-status";
import { UserModel } from "../../domain/models";
import { IUserRepository } from "../../domain/repositories";

interface IRequest {
  id: string;
  avatarUrl: string;
}

export class UpdateAvatarUserService {
  constructor(
    private userRepository: IUserRepository,
    private uploadLocalProvider: IUploadFileProvider
  ) {}

  async execute({
    id,
    avatarUrl,
  }: IRequest): Promise<{ data: Omit<UserModel, "password"> }> {
    const userExist = await this.userRepository.findById(id);

    if (!userExist) {
      throw new AppError({
        message: "El usuario no existe",
        statusCode: httpStatus.NOT_FOUND,
      });
    }
    let newAvatarUrl = userExist.avatarUrl;
    if (avatarUrl && avatarUrl !== userExist.avatarUrl) {
      newAvatarUrl = avatarUrl;
      !isEmpty(userExist.avatarUrl) &&
        (await this.uploadLocalProvider.removeFileByPath(
          userExist?.avatarUrl!
        ));
    }

    const response = await this.userRepository.update(id, {
      avatarUrl: newAvatarUrl,
    });

    return { data: response };
  }
}
