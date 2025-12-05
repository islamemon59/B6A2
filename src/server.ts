import express, { Request, Response } from "express";
import config from "./config";

const app = express();
const port = config.port;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
