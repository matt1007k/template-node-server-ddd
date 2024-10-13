import { AppError } from "@/shared/domain/models";
import {
  IEncryptProvider,
  IUploadFileProvider,
} from "@/shared/infrastructure/containers";
import { Prisma } from "@prisma/client";
import { UserModel } from "../../domain/models";
import { IUserRepository } from "../../domain/repositories";

interface IRequest extends Prisma.UserCreateInput {}

export class CreateUserService {
  constructor(
    private userRepository: IUserRepository,
    private encryptProvider: IEncryptProvider,
    private uploadFileProvider: IUploadFileProvider
  ) {}

  async execute({
    password,
    avatarUrl,
    ...data
  }: IRequest): Promise<Omit<UserModel, "password">> {
    const destinationDir = "uploads/avatar";
    let newAvatarUrl = avatarUrl
      ? await this.uploadFileProvider
          .moveFileToPath(avatarUrl!, destinationDir)
          .catch((error) => {
            console.log("ERROR", error);

            throw new AppError({ message: error.toString() });
          })
      : "";

    if (typeof avatarUrl !== "undefined" && avatarUrl && !newAvatarUrl) {
      throw new AppError({ message: "Error to moved file" });
    }

    const passwordHashed = await this.encryptProvider.hash(password as string);

    const response = await this.userRepository.create({
      ...data,
      password: passwordHashed,
      avatarUrl: newAvatarUrl,
    });

    return response;
  }
}
