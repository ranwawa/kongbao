import { EEnvironment, EPlatform } from "@/assets/constant/common";
import dev from "./dev";
import prod from "./prod";

const customEnv: EEnvironment = process.env.customEnv as EEnvironment;
const customPlatform: EPlatform = process.env.customPlatform as EPlatform;

export const config = customEnv === EEnvironment.DEV ? prod : dev;
