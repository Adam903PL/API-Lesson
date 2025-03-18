import express from "express";
import bodyParser from "body-parser";
import { logMiddleware } from "./auth/middlewares/logMiddleware";
import { todosController } from "./todos/controllers/todos.controller";
import { passesController } from "./passes/controllers/passes.controller";
import { ucs2 } from "node:punycode";
import { MOVED_PERMANENTLY } from "http-status-codes";
import { createLogger } from "vite";
import { ordersController } from "./orders/controllers/orders.controller";
import { ordersMiddleware } from "./auth/middlewares/ordersMiddleware";
import { productsController } from "./product/controllers/products.controller";
import { eventsController } from "./events/controllers/events.controller";

const PORT = 3333;
const app = express();

export type toDosTYpe = {
  id: string;
  done: boolean;
  text: string;
};
// app.use(express.json());
app.use(bodyParser.json());
app.use('/orders', ordersMiddleware);


app.use('/todos',todosController)
app.use('/passes',passesController)
app.use('/orders',ordersController)
app.use('/products',productsController)
app.use('/events',eventsController)





app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
