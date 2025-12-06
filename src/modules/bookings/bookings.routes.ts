import { Router } from "express";
import { bookingControllers } from "./booking.controller";

const router = Router();

// create booking route
router.post("/", bookingControllers.createBooking);

export const bookingRoutes = router;