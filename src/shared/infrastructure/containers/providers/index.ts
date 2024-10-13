import { EmailProvider } from "./EmailProvider";
import { JobsProvider } from "./JobsProvider";
import { JwtProvider } from "./JwtProvider";
import { RedisProvider } from "./RedisProvider";

export * from "./EmailProvider";
export * from "./EncryptProvider";
export * from "./GenerateRandomNumberProvider";
export * from "./models";
export * from "./RedisProvider";
export * from "./UploadFileProvider";

export const jwtProvider = new JwtProvider();
export const emailProvider = new EmailProvider();
export const jobsProvider = new JobsProvider();
export const redisProvider = new RedisProvider();
