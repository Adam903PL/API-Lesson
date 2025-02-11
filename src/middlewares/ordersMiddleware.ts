import { NextFunction, type Request, type Response,type ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import type { Order, OrderItem } from "../controllers/orders.controller";
export const ordersMiddleware = (err:ErrorRequestHandler,req: Request, res: Response, next: NextFunction) => {
    try{
        const body: OrderItem[] = req.body.items;

        if (!body) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Items are required" });
            return;
        }
        if(body.length === 0){
            res.status(StatusCodes.BAD_REQUEST).json({"error":"No data available"})
            return
        }
        
        for (const item of body) {
            if (item.price < 0) {
                res.status(StatusCodes.BAD_REQUEST).json({ "error": "Incorrect order details" });
                return;
            }
            if (item.quantity <= 0) {
                res.status(StatusCodes.BAD_REQUEST).json({ "error": "Incorrect order details" });
                return;
            }
        }
    
        next();
    }catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"error":"A server error occurred"})
    }
};