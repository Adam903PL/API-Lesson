import express, { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { object, string, number, ValidationError } from "yup";
export const productsController = express.Router();
import { CreateProductsDTO } from "../dtos/create-products.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { validationMiddleware } from "../../common/middlewares/validation.middleware";
const productsSchema = object({
  name: string()
    .required("Pole jest wymagane")
    .min(3, "Nazwa musi mieć min 3 znaki")
    .matches(/^[A-Za-z\s]+$/, "Tylko litery i spacje"),
  price: number()
    .required("Pole jest wymagane")
    .max(10000, "Price nie może przekroczyć 10k")
    .positive("Cena musi być w zbiorze liczb N+"),
  stock: number().integer().min(0, "Ilość nie może być ujemna"),
});

productsController.get("/", async (req: Request, res: Response) => {
  try {
    res.status(StatusCodes.OK).json({ message: "OK" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});


productsController.post(
    "/",
    validationMiddleware(CreateProductsDTO),
    async (request, response, next) => {
      const productDto = plainToInstance(CreateProductsDTO, request.body);
      response.send({
        data: productDto,
      });
    }
  );
  
  

productsController.post("/legacy", async (req: Request, res: Response) => {
  const { name, price, stock } = req.body;
  try {
    const validateProducts = await productsSchema.validate(
      { name, price, stock },
      { abortEarly: false }
    );
    res
      .status(StatusCodes.OK)
      .json({ message: "Produkt zosta dodany sigma", validateProducts });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.errors });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `No sie zjebało i masz problem womp womp womp`, error })
      .send();
  }
});



