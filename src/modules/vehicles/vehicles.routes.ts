import { Router } from "express";
import { vehicleControllers } from "./vehicles.controller";

const router = Router();

// create vehicle
router.post("/", vehicleControllers.createVehicle);

// get all vehicles
router.get("/", vehicleControllers.getAllVehicles);

export const vehicleRoutes = router;
