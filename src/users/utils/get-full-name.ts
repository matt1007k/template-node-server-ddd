import { UserModel } from "../domain/models";

export const getFullName = (user: UserModel) => {
  return `${user.firstName} ${user.first_lastName} ${user.second_lastName}`;
};
