import mongoose from "mongoose";
import { Environment } from "./env";

export const connectDb = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(Environment.TEST_DB_HOST);
        console.log("MongoDB connected to " + conn.connection.name);
    } catch (error) {
        console.log("Error: " + (error as Error).message);
        process.exit(1);
    };
};