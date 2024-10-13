import { PrismaUserOfficesRepository } from "@/users_offices/infrastructure/prisma";
import {
  UploadFileProvider,
  encryptProvider,
  jobsProvider,
  jwtProvider,
  redisProvider,
} from "@/shared/infrastructure/containers";
import { UsersController } from "@/shared/infrastructure/http/controllers";
import { prismaService } from "../../shared/infrastructure/db";
import {
  CreateUserService,
  ForgotPasswordUserService,
  GetAllUserService,
  GetUserDetailService,
  LoginUserService,
  MeService,
  RefreshTokenService,
  RemoveOneUserService,
  ResetPasswordUserService,
  UpdateAvatarUserService,
  UpdateUserService,
} from "../application/v1";
import { PrismaUserRepository } from "./prisma/PrismaUserRepository";
import { PrismaOfficeGroupsRepository } from "@/office_groups/infrastructure/prisma";
export const prismaUserOfficesRepository = new PrismaUserOfficesRepository(
  prismaService
);

export const prismaUserRepository = new PrismaUserRepository(prismaService);
const prismaOfficeGroupsRepository = new PrismaOfficeGroupsRepository(
  prismaService
);

const uploadFileProvider = new UploadFileProvider();

const createUserService = new CreateUserService(
  prismaUserRepository,
  encryptProvider.bcrypt,
  uploadFileProvider,
  prismaUserOfficesRepository
);
const updateUserService = new UpdateUserService(
  prismaUserRepository,
  encryptProvider.bcrypt,
  uploadFileProvider,
  prismaUserOfficesRepository
);
const getAllUserService = new GetAllUserService(
  prismaUserRepository,
  prismaOfficeGroupsRepository
);
const loginUserService = new LoginUserService(
  prismaUserRepository,
  encryptProvider.bcrypt,
  jwtProvider
);
const getUserDetailService = new GetUserDetailService(prismaUserRepository);
const removeOneUserService = new RemoveOneUserService(prismaUserRepository);
const refreshTokenService = new RefreshTokenService(
  prismaUserRepository,
  jwtProvider
);

const updateAvatarUserService = new UpdateAvatarUserService(
  prismaUserRepository,
  uploadFileProvider
);

const forgotPasswordUserService = new ForgotPasswordUserService(
  prismaUserRepository,
  jobsProvider,
  redisProvider
);
const resetPasswordUserService = new ResetPasswordUserService(
  prismaUserRepository,
  encryptProvider.bcrypt,
  redisProvider
);

const meService = new MeService(prismaUserRepository);

export const usersController = new UsersController(
  createUserService,
  getAllUserService,
  loginUserService,
  updateUserService,
  getUserDetailService,
  removeOneUserService,
  refreshTokenService,
  updateAvatarUserService,
  forgotPasswordUserService,
  resetPasswordUserService,
  meService
);
