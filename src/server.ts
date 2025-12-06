import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";
import { userRoutes } from "./modules/users/users.routes";

("./config/db");

const app = express();
const port = config.port;

app.use(express.json());

initDB();

//auth routes
app.use("/api/v1/auth", authRoutes);

// vehicle routes
app.use("/api/v1/vehicles", vehicleRoutes);

//users route
app.use("/api/v1/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
