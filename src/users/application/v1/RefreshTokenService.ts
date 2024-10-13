import { UserModel } from "@/users/domain/models";
import { AppError } from "@/shared/domain/models";
import { IJwtProvider } from "@/shared/infrastructure/containers";
import { IUserRepository } from "../../domain/repositories";
import httpStatus from "http-status";

interface IRequest {
  refresh_token: string;
}

type TokenResponse = {
  refresh_token: string;
  token: string;
};
type DataResponse = {
  data: TokenResponse;
};

export class RefreshTokenService {
  constructor(
    private userRepository: IUserRepository,
    private jwtProvider: IJwtProvider
  ) {}

  async execute({ refresh_token }: IRequest): Promise<DataResponse | AppError> {
    const response = await this.jwtProvider.verify<UserModel>(refresh_token);

    if (typeof response === "undefined") {
      throw new AppError({
        message: "token_refresh.expired",
        statusCode: httpStatus.UNAUTHORIZED,
      });
    }
    const user = await this.userRepository.findById(response.id);

    if (!user) {
      throw new AppError({
        message: "User logueado no existe",
        statusCode: httpStatus.UNAUTHORIZED,
      });
    }

    const token = await this.jwtProvider.sign(user, "6h");
    const new_refresh_token = await this.jwtProvider.sign(user, "8h");

    return {
      data: {
        token,
        refresh_token: new_refresh_token,
      },
    } as DataResponse;
  }
}
