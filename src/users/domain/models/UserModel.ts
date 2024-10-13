import { GroupPermissionModel } from "@/group_permissions/domain/models";
import { User } from "@prisma/client";

export interface UserModel extends User {
  groups?: GroupPermissionModel[];
}
