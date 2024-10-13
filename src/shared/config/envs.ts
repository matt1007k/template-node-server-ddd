import { config } from "dotenv";
import z from "zod";
config();

const {
  JWT_SECRET,
  API_URL,
  SESSION_SECRET,
  REDIS_PORT,
  REDIS_HOST,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM_ADDRESS,
  MAIL_ENCRYPTION,
  FRONT_URL,
} = process.env;

const envSchema = z.object({
  JWT_SECRET: z.string().trim().min(1),
  API_URL: z.string().trim().min(1).url(),
  SESSION_SECRET: z.string().trim().min(1),
  REDIS_PORT: z.string().trim().min(1),
  REDIS_HOST: z.string().trim().min(1),
  MAIL_HOST: z.string().trim().min(1),
  MAIL_PORT: z.string().trim().min(1),
  MAIL_USERNAME: z.string().trim().min(1).email(),
  MAIL_PASSWORD: z.string().trim().min(1),
  MAIL_FROM_ADDRESS: z.string().trim().min(1).email(),
  MAIL_ENCRYPTION: z.string().trim().min(1),
  FRONT_URL: z.string().trim().min(1).url(),
});

const envServer = envSchema.safeParse({
  JWT_SECRET,
  API_URL,
  SESSION_SECRET,
  REDIS_PORT,
  REDIS_HOST,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM_ADDRESS,
  MAIL_ENCRYPTION,
  FRONT_URL,
});

if (!envServer.success) {
  console.error(envServer.error.issues);
  throw new Error("There is an error with the server environment variables");
  process.exit(1);
}

export const Envs = envServer.data;
