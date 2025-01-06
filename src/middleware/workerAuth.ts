import jwt, { JwtPayload } from 'jsonwebtoken';
import { WorkerModel } from '../model/worker';
import { NextFunction } from "express";
import { AuthRequest } from './authRequest';

class AuthMiddleware {
    constructor () {};

    authenticate = async (request: AuthRequest, _: any, next: NextFunction) => {
        try {
            const { authorization } = request.headers;
            if (!authorization) {
                return next({
                    status_code: 403,
                    error: "Unauthorized: Authorization header not found"
                });
            };

            const [, apiKey] = authorization.split(" ");

            if (!apiKey) {
                return next({
                    status_code: 403,
                    error: "Unauthorized: Auth token not found"
                });
            };

            try {
                const user_details = jwt.verify(apiKey, process.env.JWT_SECRET) as JwtPayload;

                request.worker = await WorkerModel.findById(user_details._id).select("-password");

                if (request.worker) {                    
                    return next();
                };

                return next({
                    status_code: 403,
                    error: "Unauthorized: Invalid auth token for worker"
                });
            } catch (e) {
                console.error({ e });
                return next({ error: "Unauthorized: Error decoding auth token" });
            }
        } catch (e) {
            console.error({ e });
            return next({ error: "Unauthorized" });
        };
    };
};

export default new AuthMiddleware();