import { IDataWithPagination } from "@/shared/infrastructure/db";
import { ICreateUserDto, IUpdateUserDto } from "../dtos";
import { StatusUserEnum } from "../enum";
import { UserModel } from "../models";

export interface IFindAllUsers {
  page?: number;
  perPage?: number;
  term?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: StatusUserEnum;
}

export interface IUserRepository {
  create(data: ICreateUserDto): Promise<Omit<UserModel, "password">>;
  update(
    id: string,
    data: IUpdateUserDto
  ): Promise<Omit<UserModel, "password">>;
  findAll(
    params: IFindAllUsers
  ): Promise<IDataWithPagination<Omit<UserModel, "password">[]>>;
  findByEmail(email: string): Promise<UserModel | null>;
  findByUsername(username: string): Promise<UserModel | null>;
  findById(id: string): Promise<Omit<UserModel, "password"> | null>;
  deleteById(id: string): Promise<Omit<UserModel, "password">>;
}
