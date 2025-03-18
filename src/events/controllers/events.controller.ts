import express, { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { object, string, number, ValidationError } from "yup";
import { v4 } from "uuid";
import { CreateEventsDTO } from "../dto/events-dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { validationMiddleware } from "../../common/middlewares/validation.middleware";
import { eventsMiddleware } from "../../common/middlewares/events.middleware";
import {  PatchEventsDTO } from "../dto/events-patch-dto";
import { EventsPutDTO } from "../dto/event-put-dto";

let Events = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "Tech Conference 2025",
    date: "2025-06-15",
    location: "Warsaw",
    capacity: 500,
  },
  {
    id: "7e9162e7-90a8-4a55-8d71-5424124afdcb",
    name: "Something",
    date: "2026-07-25",
    location: "Lublin",
    capacity: 210,
  },
];

export const eventsController = express.Router();

eventsController.get("/", async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ events: Events });
});

eventsController.get("/:id", async (req: Request, res: Response) => {
  const paramID = req.params.id

  if (!paramID) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid ID format" });
    return;
  }

  const event = Events.find((event) => event.id === paramID);

  res.status(StatusCodes.OK).json({ event });
});

eventsController.post("/", eventsMiddleware(CreateEventsDTO), async (req: Request, res: Response) => {
    const newEvent = {
      id: v4(),
      ...req.body,
    };
  
    Events.push(newEvent);
  
    res.status(StatusCodes.CREATED).json({ data: newEvent });
});



eventsController.put("/:id", eventsMiddleware(EventsPutDTO), async (req: Request, res: Response) => {
    const paramID = req.params.id;



    const eventIndex = Events.findIndex(event => event.id === paramID);

    if (eventIndex === -1) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Event not found" });
        return;
    }

    Events[eventIndex] = {
        id: paramID, 
        ...req.body,
    };

    res.status(StatusCodes.OK).json({ data: Events[eventIndex] });
});



eventsController.patch("/:id", eventsMiddleware(PatchEventsDTO), async (req: Request, res: Response) => {
    const paramID = req.params.id
    console.log(paramID);


    const eventIndex = Events.findIndex(event => event.id === paramID);


    
    Events[eventIndex] = { ...Events[eventIndex], ...req.body };

    res.status(StatusCodes.OK).json({ success:true,data: Events[eventIndex] });
});




eventsController.delete("/:id",eventsMiddleware(), async (req: Request, res: Response) => {
    const paramID = req.params.id

  
    const event = Events.filter((event) => event.id !== paramID);
    Events = event
  
    res.status(StatusCodes.OK).json({ event,message:"Event successfully deleted" });
  });