import { NextFunction, type Request, type Response } from "express";
export const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    console.log("log mildwere")
    next()
};
