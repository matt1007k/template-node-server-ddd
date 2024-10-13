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
} from "@/users/application/v1";
import { AppError } from "@/shared/domain/models";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { BaseController } from "../../models";
import { RequestUser } from "@/types";
import { uploadFileMulter } from "../../middleware";

export class UsersController extends BaseController {
  constructor(
    private createUserService: CreateUserService,
    private getAllUserService: GetAllUserService,
    private loginUserService: LoginUserService,
    private updateUserService: UpdateUserService,
    private getUserDetailService: GetUserDetailService,
    private removeOneUserService: RemoveOneUserService,
    private refreshTokenService: RefreshTokenService,
    private updateAvatarUserService: UpdateAvatarUserService,
    private forgotPasswordUserService: ForgotPasswordUserService,
    private resetPasswordUserService: ResetPasswordUserService,
    private meService: MeService
  ) {
    super();
  }

  async me(req: Request, res: Response): Promise<any> {
    const userId = (req as RequestUser).userId;
    try {
      const response = await this.meService.execute({
        userId,
      });
      return this.ok(res, response);
    } catch (error) {
      if (error instanceof AppError) {
        return this.badRequest(res, error.message);
      }
    }
  }

  async resetPassword(req: Request, res: Response): Promise<any> {
    try {
      const response = await this.resetPasswordUserService.execute(req.body);
      return this.ok(res, response);
    } catch (error) {
      if (error instanceof AppError) {
        return this.badRequest(res, error.message);
      }
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<any> {
    try {
      const response = await this.forgotPasswordUserService.execute(req.body);
      return this.ok(res, response);
    } catch (error) {
      if (error instanceof AppError) {
        return this.badRequest(res, error.message);
      }
    }
  }

  async uploadAvatar(req: Request, res: Response): Promise<any> {
    const userId = (req as RequestUser).userId;
    uploadFileMulter("avatar").single("file")(req, res, async (err: any) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      }
      if (!req.file) {
        return res.status(400).json({ error: "Please send file avatar" });
      }
      try {
        const user = await this.updateAvatarUserService.execute({
          id: userId,
          avatarUrl: req.file.path,
        });
        return this.ok(res, user.data.avatarUrl);
      } catch (error) {
        if (error instanceof AppError) {
          this.badRequest(res, error.message);
        }
      }
    });
  }

  async refreshToken(req: Request, res: Response): Promise<any> {
    const { refresh_token } = req.body;

    try {
      const response = await this.refreshTokenService.execute({
        refresh_token,
      });
      return this.ok(res, response);
    } catch (error) {
      if (error instanceof AppError) {
        return this.unauthorized(res, error.message);
      }
    }
  }

  async login(req: Request, res: Response): Promise<any> {
    const { username, password } = req.body;

    try {
      const response = await this.loginUserService.execute({
        username,
        password,
      });
      return this.ok(res, response);
    } catch (error) {
      if (error instanceof AppError) {
        return this.badRequest(res, error.message);
      }
    }
  }

  async create(req: Request, res: Response): Promise<any> {
    const body = req.body;

    try {
      const user = await this.createUserService.execute(body);
      return this.ok(res, user);
    } catch (error) {
      if (error instanceof AppError) {
        return this.badRequest(res, error.message);
      }
    }
  }

  async findAll(req: Request, res: Response): Promise<any> {
    try {
      const users = await this.getAllUserService.execute(req.query);

      return this.ok(res, users);
    } catch (error) {
      if (error instanceof AppError) {
        return this.badRequest(res, error.message);
      }
    }
  }

  async update(req: Request, res: Response): Promise<any> {
    const body = req.body;
    const id = req.params.id as string;

    try {
      const user = await this.updateUserService.execute({
        ...body,
        id,
      });
      return this.ok(res, user);
    } catch (error) {
      if (error instanceof AppError) {
        return this.badRequest(res, error.message);
      }
    }
  }
  async findOneById(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id;
      const users = await this.getUserDetailService.execute({ id });

      return this.ok(res, users);
    } catch (error) {
      if (error instanceof AppError) {
        if (error.status_code === 404) return this.notFound(res, error.message);
        return this.badRequest(res, error.message);
      }
    }
  }
  async removeOne(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id;
      await this.removeOneUserService.execute({ id });

      return this.notContent(res);
    } catch (error) {
      if (error instanceof AppError) {
        return this.badRequest(res, error.message);
      }
    }
  }
}
