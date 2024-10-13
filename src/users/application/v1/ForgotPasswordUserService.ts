import { AppError } from "@/shared/domain/models";
import {
  IJobsProvider,
  IRedisProvider,
} from "@/shared/infrastructure/containers";
import httpStatus from "http-status";
import { IUserRepository } from "../../domain/repositories";
import { UserModel } from "@/users/domain/models";
import { v4 } from "uuid";
import { FORGET_PASSWORD_PREFIX } from "@/users/utils";

interface IRequest {
  username: string;
}

export class ForgotPasswordUserService {
  constructor(
    private userRepository: IUserRepository,
    private jobsProvider: IJobsProvider,
    private redisProvider: IRedisProvider
  ) {}

  async execute({ username }: IRequest): Promise<any> {
    const userExist = await this.userRepository.findByUsername(username);

    if (!userExist) {
      throw new AppError({
        message: "El usuario no existe",
        statusCode: httpStatus.NOT_FOUND,
      });
    }
    const token = v4();
    const key = FORGET_PASSWORD_PREFIX + token;
    await this.redisProvider.setData({
      key,
      value: userExist.id,
      seconds: 1000 * 60 * 60 * 24 * 3, // 3 days
    });

    this.jobsProvider.add<{ user: UserModel; token: string }>({
      type: "forgot_password",
      data: {
        user: userExist,
        token,
      },
    });

    return {
      email: true,
      message:
        "Te hemos enviar un mensaje a tu correo, sigue las instrucciones para cambiar tu contraseña",
    };
  }
}
