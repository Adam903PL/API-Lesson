import express from "express";
import { v4 } from "uuid";
import { StatusCodes } from "http-status-codes";
import { NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import { Router } from "express";

export const ordersController = Router();

export type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  items: OrderItem[];
  total: number;
};

let orders: Order[] = [
  {
    id: 1,
    items: [
      { name: "Pizza", price: 1, quantity: 1 },
      { name: "Cola", price: 0.20, quantity: 2 },
    ],
    total: 40,
  },
  {
    id: 2,
    items: [
      { name: "Burger", price: 20, quantity: 2 },
      { name: "Fries", price: 10, quantity: 1 },
    ],
    total: 50,
  },
  {
    id: 3,
    items: [
      { name: "Pasta", price: 25, quantity: 1 },
      { name: "Juice", price: 8, quantity: 2 },
    ],
    total: 41,
  },
];

ordersController.get("/", async (req: Request, res: Response) => {
  try {
    res.json(orders).send();
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});
ordersController.get("/:id", async (req: Request, res: Response) => {
  try {
    const paramId = Number(req.params.id);
    if (isNaN(paramId)) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    const element = orders.find((ele) => (ele.id == paramId ? ele : NaN));
    if (element === undefined) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Element does not exist" })
        .send();
    } else {
      res.status(StatusCodes.OK).json({ element }).send();
    }
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

ordersController.post("/", async (req: Request, res: Response) => {
  try {
    const items: OrderItem[] = req.body.items;

    items.forEach((ele)=>{

    })

    let total = 0;
    items.forEach((ele) => {
      total += ele.quantity * ele.price;
    });
    const newOrder: Order = { id: orders.length, items: items, total };
    orders.push(newOrder);
    console.log(orders);
    res.sendStatus(StatusCodes.CREATED);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

ordersController.put("/:id", async (req: Request, res: Response) => {
  try {
    const paramId = Number(req.params.id);
    if (isNaN(paramId)) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
      return;
    }

    const orderIndex = orders.findIndex((ele) => ele.id === paramId);
    if (orderIndex === -1) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Order not found" });
      return;
    }

    const items: OrderItem[] = req.body.items;

    let total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const updatedOrder: Order = {
      ...orders[orderIndex],
      items,
      total,
    };
    orders[orderIndex] = updatedOrder;

    res.status(StatusCodes.OK).json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});
ordersController.delete("/:id", async (req: Request, res: Response) => {
  try {
    const paramId = Number(req.params.id);
    if (isNaN(paramId)) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    const newOrders = orders.filter((ele) => (ele.id == paramId ? NaN : ele));
    orders = newOrders;
    res.status(StatusCodes.OK).json({ orders }).send();
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

ordersController.get(
  "/:id/discount/:percent",
  async (req: Request, res: Response) => {
    try {
      const paramId = Number(req.params.id);
      const paramPercent = Number(req.params.percent);

      if (isNaN(paramId) || isNaN(paramPercent)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Fill id and percent" });
        return;
      }
      if (paramPercent > 50) {
        res
          .status(StatusCodes.FORBIDDEN)
          .json({ error: "The maximum discount is 50%" });
        return;
      }
      const newOrders = orders.find((ele) => ele.id === paramId);
      if (!newOrders) {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Order not found" });
        return;
      }
    

      const discountedItems = newOrders.items.map((item) => ({
        ...item,
        price: item.price - (item.price * paramPercent) / 100,
      }));

      let newTotal = 0

      discountedItems.map((ele)=>newTotal+=ele.price)


      const updatedOrders = orders.map((ele) => {
        if (ele.id === paramId) {
          return { ...ele,total:newTotal, items: discountedItems };
        }
        return ele;
      });
      if(newTotal < 1){
        res.status(StatusCodes.BAD_REQUEST).json({ "error": "Total cannot fall below 1" });
        return
      }

      orders = updatedOrders;
      res.sendStatus(StatusCodes.OK);
      return;
    } catch (err) {
      console.error(err);
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
);
