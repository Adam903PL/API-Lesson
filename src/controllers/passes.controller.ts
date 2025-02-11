import express from "express";
import { StatusCodes } from "http-status-codes";
import { type toDosTYpe } from "../server";
import { todo } from "node:test";
import { v4 } from "uuid";
  import { NextFunction, type Request, type Response } from "express";
import { l } from "vite/dist/node/types.d-aGj9QkWt";
import { addSyntheticLeadingComment, sortAndDeduplicateDiagnostics } from "typescript";
export const passesController = express.Router();

type Subscription = {
  id: string;
  owner: string;
  type: "Miesięczny" | "Kwartalny" | "Półroczny" | "Roczny";
  startDate: string;
  endDate: string;
  price: number;
};

let gymData: Subscription[] = [
  {
    id: v4(),
    owner: "Jan Kowalski",
    type: "Miesięczny",
    startDate: "2025-02-01",
    endDate: "2025-03-01",
    price: 100,
  },
  {
    id: v4(),
    owner: "Anna Nowak",
    type: "Roczny",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    price: 1000,
  },
  {
    id: v4(),
    owner: "Piotr Wiśniewski",
    type: "Kwartalny",
    startDate: "2025-03-01",
    endDate: "2025-06-01",
    price: 300,
  },
  {
    id: v4(),
    owner: "Katarzyna Zielińska",
    type: "Miesięczny",
    startDate: "2025-04-01",
    endDate: "2025-05-01",
    price: 120,
  },
  {
    id: v4(),
    owner: "Tomasz Wójcik",
    type: "Półroczny",
    startDate: "2025-02-15",
    endDate: "2025-08-15",
    price: 600,
  },
];
const formatDateISO = (date: any) => {
  const isoString = date.toISOString();
  const formattedDate = isoString.split("T")[0];
  return formattedDate;
};
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

passesController.post("/", (req, res) => {
  if (!req.body.owner || !req.body.type) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Request body is missing" });
    return;
  }

  const { owner, type }: Subscription = req.body;
  let finalPrice: number;
  switch (type) {
    case "Miesięczny":
      finalPrice = 120;
      break;
    case "Kwartalny":
      finalPrice = 300;
      break;

    case "Półroczny":
      finalPrice = 600;
      break;
    case "Roczny":
      finalPrice = 1000;
      break;
  }

  const newData = new Date();
  const startDateFinal: string = formatDateISO(newData);
  const endDateFinal: string = formatDateISO(addDays(newData, 30));

  const newSub: Subscription = {
    id: v4(),
    owner,
    type,
    startDate: startDateFinal,
    endDate: endDateFinal,
    price: finalPrice,
  };

  gymData.push(newSub);
  res.status(StatusCodes.CREATED).json({ message: "Todo added", data: newSub });
});

passesController.get("/", (req, res) => {
  try {
    res.json(gymData).send();
  } catch (err) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  }
});

passesController.get("/:id", (req, res) => {
  try {
    if (!req.params.id) {
      res.sendStatus(StatusCodes.NO_CONTENT);
    }
    console.log(req.params.id);
    gymData.find((ele) => ele.id !== req.params.id);

    res.status(StatusCodes.OK).json({ message: "success", gymData });
  } catch (err) {
    console.error("Interval Server Error:", err

    );
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  }
});

passesController.put("/:id", (req, res) => {
  try {
    if (!req.params.id) {
      res.sendStatus(StatusCodes.NO_CONTENT);
    }
    const id = req.params.id;

    const { owner, type, startDate, endDate, price }: Subscription = req.body;
    const newSub = { owner, type, startDate, endDate, price };

    gymData.filter((todo) => {
      todo.id === id ? { ...todo, newSub } : todo;
    });


    res.status(StatusCodes.OK).json({ message: "success", todo: newSub });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Could not to update" });
  }
});

passesController.delete("/:id", (req, res) => {
  try {
    if(!req.params.id){
        res.sendStatus(StatusCodes.NO_CONTENT)
    }

    console.log(req.params.id);
    gymData = gymData.filter((ele) => ele.id !== req.params.id);
    res.status(StatusCodes.OK).json({ message: "success", gymData });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  }
});


