import { usersController } from "@/users/infrastructure/dependencies";
import { Request, Response, Router } from "express";
import { isAuthenticate, validateSchema } from "../../middleware";
import {
  forgotPasswordBodySchema,
  paramsIdSchema,
  resetPasswordBodySchema,
  userCreateBodySchema,
  userGetAllQuerySchema,
  userLoginBodySchema,
  userRefreshTokenBodySchema,
  userUpdateBodySchema,
} from "../../schemas";

export class UsersRoute {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  register() {
    this.router.get(
      "/",
      validateSchema({
        query: userGetAllQuerySchema,
      }),
      (req, res) => usersController.findAll(req, res)
    );
    this.router.post(
      "/",
      validateSchema({
        body: userCreateBodySchema,
      }),
      (req, res) => usersController.create(req, res)
    );

    this.router.get("/me", [isAuthenticate], (req: Request, res: Response) =>
      usersController.me(req, res)
    );

    this.router.put(
      "/:id",
      validateSchema({
        params: paramsIdSchema,
        body: userUpdateBodySchema,
      }),
      (req, res) => usersController.update(req, res)
    );

    this.router.post(
      "/refresh-token",
      [
        validateSchema({
          body: userRefreshTokenBodySchema,
        }),
      ],
      (req: Request, res: Response) => usersController.refreshToken(req, res)
    );

    this.router.post(
      "/login",
      validateSchema({
        body: userLoginBodySchema,
      }),
      (req, res) => usersController.login(req, res)
    );

    this.router.get(
      "/:id",
      validateSchema({
        params: paramsIdSchema,
      }),
      (req, res) => usersController.findOneById(req, res)
    );

    this.router.delete(
      "/:id",
      validateSchema({
        params: paramsIdSchema,
      }),
      (req, res) => usersController.removeOne(req, res)
    );

    this.router.post(
      "/upload-avatar",
      [isAuthenticate],
      (req: Request, res: Response) => usersController.uploadAvatar(req, res)
    );

    this.router.post(
      "/forgot-password",
      validateSchema({
        body: forgotPasswordBodySchema,
      }),
      (req: Request, res: Response) => usersController.forgotPassword(req, res)
    );
    this.router.post(
      "/reset-password",
      validateSchema({
        body: resetPasswordBodySchema,
      }),
      (req: Request, res: Response) => usersController.resetPassword(req, res)
    );

    return this.router;
  }
}
