import express from "express";
import bodyParser from "body-parser";
import { logMiddleware } from "./middlewares/logMiddleware";
import { todosController } from "./controllers/todos.controller";
import { passesController } from "./controllers/passes.controller";
import { ucs2 } from "node:punycode";
import { MOVED_PERMANENTLY } from "http-status-codes";
import { createLogger } from "vite";
import { ordersController } from "./controllers/orders.controller";
import { ordersMiddleware } from "./middlewares/ordersMiddleware";

const PORT = 4444;
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






app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
