import { Response, NextFunction } from "express";

class RootService {
    constructor() {};

    handle_validation_errors(error: any, res: Response, next: NextFunction) {
        if (error) {
            const errorMessages = error.details.map((detail: any) => detail.message.replace(/\"/g, ""));
            return res.status(400).json({
                error: "Validation failed",
                validation_errors: errorMessages,
                status_code: 400
            });
        }
    }
};

export default RootService;