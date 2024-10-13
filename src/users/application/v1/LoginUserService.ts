import { StatusUserEnum } from "@/users/domain/enum";
import { UserModel } from "@/users/domain/models";
import { AppError } from "@/shared/domain/models";
import {
  IEncryptProvider,
  IJwtProvider,
} from "@/shared/infrastructure/containers";
import { IServiceResponse } from "@/shared/infrastructure/http/models";
import { IUserRepository } from "@/users/domain/repositories";

const messageInvalidCredentials = "Credenciales inválidas";

interface IRequest {
  username: string;
  password: string;
}

type TokenResponse = {
  token: string;
  refresh_token: string;
};
type DataResponse = {
  tokens: TokenResponse;
  data: Omit<UserModel, "password">;
};

export class LoginUserService {
  constructor(
    private userRepository: IUserRepository,
    private encryptService: IEncryptProvider,
    private jwtProvider: IJwtProvider
  ) {}

  async execute({
    username,
    password: passwordInput,
  }: IRequest): Promise<IServiceResponse<DataResponse>> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new AppError({
        message: messageInvalidCredentials,
      });
    }

    if (user.status === StatusUserEnum.INACTIVE) {
      throw new AppError({
        message:
          "El usuario esta inhabilitado, por favor contacte al administrador",
      });
    }

    const passwordValid = await this.encryptService.verify(
      passwordInput,
      user.password
    );

    if (!passwordValid) {
      throw new AppError({
        message: messageInvalidCredentials,
      });
    }

    const { password, ...userWithoutPassword } = user;

    const dataUser = userWithoutPassword;

    const token = await this.jwtProvider.sign(dataUser, "4h");
    const refresh_token = await this.jwtProvider.sign(dataUser, "6h");

    return {
      message: "Successful",
      code: "000000",
      data: {
        tokens: {
          token,
          refresh_token,
        },
        data: dataUser,
      },
    } as IServiceResponse<DataResponse>;
  }
}
