import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const eventsMiddleware = (DtoClass?: ClassConstructor<object>) => { 
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            if (req.method === "DELETE") {
                const paramID = req.params.id;
                if (paramID === ":id") {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        status: 'error',
                        message: 'Bad Request: ID is required',
                    });
                    return;
                }
            }

            
            if (req.method === "PUT" || req.method === 'PATCH') {
                const paramID = req.params.id;
                if (paramID === ":id") {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        status: 'error',
                        message: 'Bad Request: ID is required',
                    });
                    return;
                }

                
                if (DtoClass) {
                    const bodyDTO = plainToInstance(DtoClass, req.body);
                    const bodyErrors = await validate(bodyDTO);

                    if (bodyErrors.length > 0) {
                        res.status(StatusCodes.BAD_REQUEST).json({ errors: bodyErrors });
                        return;
                    }
                }
            }


            if (req.method === 'POST') {

                if (DtoClass) {
                    const bodyDTO = plainToInstance(DtoClass, req.body);
                    const bodyErrors = await validate(bodyDTO);

                    if (bodyErrors.length > 0) {
                        res.status(StatusCodes.BAD_REQUEST).json({ errors: bodyErrors });
                        return;
                    }
                }
            }

            next(); 
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
            return;
        }
    };
};