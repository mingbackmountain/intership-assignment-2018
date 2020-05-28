import express, { RequestHandler, Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";

const app = express();
const port = 3000;

function callback() {
  console.log(`Application running on port:${port}`);
}

const path = "/home";
const handler: RequestHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.send("Get Home");
};

app.get(path, handler);

const homeIdPath = "/home/:id";
app.get(homeIdPath, (request, response, next) => {
  const params = request.params;
  response.status(200).send(params);
});

app.listen(port, callback);
