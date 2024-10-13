import { IServiceResponse } from "@/shared/infrastructure/http/models";
import { UserModel } from "../../domain/models";
import { AppError } from "@/shared/domain/models";
import httpStatus from "http-status";
import { IUserRepository } from "../../../users/domain/repositories";
interface IRequest {
  id: string;
}

export class GetUserDetailService {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    id,
  }: IRequest): Promise<IServiceResponse<Omit<UserModel, "password"> | null>> {
    const response = await this.userRepository.findById(id);

    let newResponse = new Map();
    if (!response) {
      throw new AppError({
        message: "El usuario no existe",
        statusCode: httpStatus.NOT_FOUND,
      });
    }
    if (response) {
      newResponse = new Map(Object.entries(response));
      newResponse.delete("password");
    }

    return {
      message: "Successful",
      code: "000000",
      data: Object.fromEntries(newResponse),
    } as IServiceResponse<Omit<UserModel, "password"> | null>;
  }
}
