import express, { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { object, string, number, ValidationError } from "yup";
export const productsController = express.Router();
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator"


export const validationMiddleware = (DtoClass:any) => {

    return async (req:Request,res:Response,next:NextFunction)=>{
        try{
            
            const instanceDTO = plainToInstance(DtoClass, req.body);
            const errors = await validate(instanceDTO)
            if(errors.length > 0){
                res.status(StatusCodes.BAD_REQUEST).json({errors})
            }
            next()
        
        
        
        }catch(error){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
        }
    }
}