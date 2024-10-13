import { UserModel } from "../../domain/models";
import { IUserRepository } from "../../domain/repositories";

interface IRequest {
  id: string;
}

export class RemoveOneUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    id,
  }: IRequest): Promise<{ data: Omit<UserModel, "password"> | null }> {
    const response = await this.userRepository.deleteById(id);

    return { data: response };
  }
}
