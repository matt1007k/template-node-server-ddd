import { Prisma } from "@prisma/client";

export interface ICreateUserDto extends Prisma.UserCreateInput {}
