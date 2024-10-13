import { UserModel } from "@/users/domain/models";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { jwtProvider } from "../../containers";
import { RequestUser } from "@/types/express";
import { AppError } from "@/shared/domain/models";
import { error } from "console";

export const isAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers["authorization"]) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: "Token is required",
    });
  }
  const [_, token] = req.headers["authorization"]?.split(" ")!;

  try {
    const user = await jwtProvider.verify(token);

    if (typeof user === "undefined") {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Credentials are not verified",
        status: "error",
      });
    }

    const userData = user as UserModel;
    console.log("userId", userData.id);

    (req as RequestUser).userId = userData.id;
    next();
  } catch (error) {
    console.log("ERROR::::", error);
    if (error instanceof AppError) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        code: "token.expired",
      });
    }
  }
};
