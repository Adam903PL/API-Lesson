import express from "express";
import { StatusCodes } from "http-status-codes";
import { type toDosTYpe } from "../server";
import { todo } from "node:test";
import { v4 } from "uuid";

export const todosController = express.Router();

export let Todos: toDosTYpe[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    done: true,
    text: "Example text 1",
  },
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    done: false,
    text: "Example text 2",
  },
  {
    id: "9c858901-8a57-4791-81fe-4c455b099bc9",
    done: true,
    text: "Example text 3",
  },
  {
    id: "7d444840-9dc0-11d1-b245-5ffdce74fad2",
    done: false,
    text: "Example text 4",
  },
  {
    id: "3d6f0a5e-17bd-4c5b-8b9c-4e9eeb6f5f21",
    done: true,
    text: "Example text 5",
  },
];

todosController.get("/", (req, res) => {
  try {
    res.send(Todos);
    // res.json(Todos);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

todosController.post("/", (req, res) => {
  if (!req.body.id || !req.body.done || !req.body.text) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Request body is missing" });
    return;
  }

  const { id, done, text } = req.body;
  const newTodo: toDosTYpe = {
    id: id || v4(),
    done,
    text,
  };

  Todos.push(newTodo);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Todo added", data: { id, done, text } });
});

todosController.patch("/:id", (req, res) => {
  try {
    const id = req.params.id;

    const { done, text } = req.body;
    const newTodo = {
      done,
      text,
    };

    Todos.filter((todo) => {
      todo.id === id ? { ...todo, newTodo } : todo;
    });

    res.status(StatusCodes.OK).json({ message: "succes", todo: newTodo });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Could not to update" });
  }
});

todosController.delete("/:id", (req, res) => {
  try {
    console.log(req.params.id);
    Todos = Todos.filter((ele) => ele.id !== req.params.id);
    res.status(StatusCodes.OK).json({ message: "success", Todos });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  }
});


