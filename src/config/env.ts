import { throwIfUndefined } from "../utilities/throwIfUndefined";
import dotenv from "dotenv";

dotenv.config();

export const Environment = {
    PORT: process.env.PORT,
    LOCAL_DB_HOST: process.env.LOCAL_DB_HOST || "mongodb://localhost:27017/ultravox",
    TEST_DB_HOST: throwIfUndefined("Test MongoDB Database", process.env.URL),
    JWT_SECRET: throwIfUndefined("JWT Secret", process.env.JWT_SECRET),
    ULTRAVOX_KEY: throwIfUndefined("Ultravox key", process.env.ULTRAVOX_KEY)
};