import { Request, Response } from "express";
import { bookingServices } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

//cerate booking admin, customer
const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, error: error });
  }
};

// update booking
const updateBooking = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const status = req.body?.status
  try {
    const result = await bookingServices.updateBooking(
      status,
      req.params.bookingId!,
      user
    );
    if (user.role === "customer" && status === "cancelled") {
      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: result,
      });
    } else if (user.role === "admin" && status === "returned") {
      res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: result,
      });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, error: error });
  }
};

export const bookingControllers = {
  createBooking,
  updateBooking,
};
