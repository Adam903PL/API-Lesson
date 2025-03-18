import serverless from "serverless-http";
import app from "../src/server";
import { Request,Response } from "express";

export default (req:Request, res:Response) => {
  const handler = serverless(app);
  return handler(req, res);
};
