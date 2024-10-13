import { UserModel } from "@/users/domain/models";
import { email_forgot_password } from "@/users/templates/email";
import { getFullName } from "@/users/utils";
import { Envs } from "@/shared/config";
import { IEmailProvider } from "@/shared/infrastructure/containers";
import path from "path";

export type ISendEmailForgotPasswordServiceRequest = {
  user: UserModel;
  token: string;
};

export class SendEmailForgotPasswordService {
  constructor(private emailProvider: IEmailProvider) {}

  async execute({ user, token }: ISendEmailForgotPasswordServiceRequest) {
    const string_html = email_forgot_password({
      full_name: getFullName(user),
      link: `${Envs.FRONT_URL}/reset-password?token=${token}`,
    });

    await this.emailProvider.sendEmail({
      to: user.email,
      subject: "Recuperar contraseña",
      template_html_string: string_html,
      attachments: [
        {
          filename: "image.png",
          path: path.resolve("public/assets/logo_merchant.png"),
          cid: "logo_merchant",
        },
      ],
    });
  }
}
