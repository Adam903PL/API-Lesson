// src/server.ts
import express from "express";
import bodyParser from "body-parser";
import { logMiddleware } from "./auth/middlewares/logMiddleware";
import { todosController } from "./todos/controllers/todos.controller";
import { passesController } from "./passes/controllers/passes.controller";
import { ordersController } from "./orders/controllers/orders.controller";
import { ordersMiddleware } from "./auth/middlewares/ordersMiddleware";
import { productsController } from "./product/controllers/products.controller";
import { eventsController } from "./events/controllers/events.controller";
import dotenv  from "dotenv"
dotenv.config()
const PORT = process.env.PORT;
const app = express();

export type toDosTYpe = {
  id: string;
  done: boolean;
  text: string;
};

app.use(bodyParser.json());
app.use('/orders', ordersMiddleware);

app.use('/todos', todosController);
app.use('/passes', passesController);
app.use('/orders', ordersController);
app.use('/products', productsController);
app.use('/events', eventsController);


if (process.env.NODE_ENV !== 'serverless') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
