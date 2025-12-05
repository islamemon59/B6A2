import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";

("./config/db");

const app = express();
const port = config.port;

app.use(express.json())

initDB();

//auth routes
app.use("/api/v1/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
