import { Router } from "express";
import { vehicleControllers } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();

// create vehicle admin only
router.post("/", vehicleControllers.createVehicle);

// get all vehicles
router.get("/", vehicleControllers.getAllVehicles);

// get single vehicle
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);

// update vehicle admin only
router.put("/:vehicleId", vehicleControllers.updateVehicle);

export const vehicleRoutes = router;
