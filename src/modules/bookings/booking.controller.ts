import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

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

export const bookingControllers = {
  createBooking,
};
