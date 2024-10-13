import { StatusUserEnum } from "@/users/domain/enum";
import { z } from "zod";
export const userRefreshTokenBodySchema = z.object({
  refresh_token: z.string().min(6),
});
export const userLoginBodySchema = z.object({
  username: z.string().min(4),
  password: z.string().min(6),
});
export const userCreateBodySchema = z.object({
  firstName: z.string().min(4),
  username: z.string().min(4),
  first_lastName: z.string().min(4),
  second_lastName: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(6),
  avatarUrl: z.string().optional(),
  status: z.nativeEnum(StatusUserEnum).optional(),
});

export const userUpdateBodySchema = z.object({
  name: z.string().min(4).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  avatarUrl: z.string().optional(),
  firstName: z.string().min(4).optional(),
  username: z.string().min(4).optional(),
  first_lastName: z.string().min(4).optional(),
  second_lastName: z.string().min(4).optional(),
  status: z.nativeEnum(StatusUserEnum).optional(),
});

export const userGetAllQuerySchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
  term: z.string().optional(),
  dateTo: z.string().optional(),
  dateFrom: z.string().optional(),
  status: z.nativeEnum(StatusUserEnum).optional(),
});

export const forgotPasswordBodySchema = z.object({
  username: z.string().min(4),
});

export const resetPasswordBodySchema = z.object({
  token: z.string().uuid(),
  password: z.string().min(6),
});
