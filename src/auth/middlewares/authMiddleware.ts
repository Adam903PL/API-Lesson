import { NextFunction, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const rand = Boolean(Math.round(Math.random()));
    console.log(rand)
    if(!rand){
        res.status(StatusCodes.UNAUTHORIZED).send()
    }
    else(
        next()
    )

};
