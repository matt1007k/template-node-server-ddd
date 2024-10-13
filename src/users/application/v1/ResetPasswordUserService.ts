import { FORGET_PASSWORD_PREFIX } from "@/users/utils";
import { AppError } from "@/shared/domain/models";
import {
  IEncryptProvider,
  IRedisProvider,
} from "@/shared/infrastructure/containers";
import httpStatus from "http-status";
import { UserModel } from "../../domain/models";
import { IUserRepository } from "../../domain/repositories";

interface IRequest {
  token: string;
  password: string;
}

export class ResetPasswordUserService {
  constructor(
    private userRepository: IUserRepository,
    private encryptProvider: IEncryptProvider,
    private redisProvider: IRedisProvider
  ) {}

  async execute({
    token,
    password,
  }: IRequest): Promise<Omit<UserModel, "password">> {
    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await this.redisProvider.getData(key);
    console.log("userId redis:::", userId);

    if (!userId) {
      throw new AppError({
        message: "El token ha expirado",
      });
    }

    const userExist = await this.userRepository.findById(userId);

    if (!userExist) {
      throw new AppError({
        message: "El usuario no existe",
        statusCode: httpStatus.NOT_FOUND,
      });
    }

    const response = await this.userRepository.update(userId, {
      ...(password && { password: await this.encryptProvider.hash(password) }),
    });

    await this.redisProvider.delete(key);

    return response;
  }
}
