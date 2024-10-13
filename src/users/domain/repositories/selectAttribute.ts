import { selectUserOffice } from "@/users_offices/domain/models";
import { Prisma } from "@prisma/client";

export const selectAttributeUser: Prisma.UserSelect = {
  id: true,
  email: true,
  username: true,
  firstName: true,
  first_lastName: true,
  second_lastName: true,
  avatarUrl: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};
