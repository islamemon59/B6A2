import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

// create booking route
router.post("/", bookingControllers.createBooking);

//update booking
router.put("/:bookingId", auth("admin", "customer"), bookingControllers.updateBooking);

export const bookingRoutes = router;