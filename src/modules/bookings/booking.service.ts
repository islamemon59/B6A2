import { pool } from "../../config/db";

// create booking admin , customer;
const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, "active"]
  );

  const vehicleId = result.rows[0].vehicle_id;
  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);

  const number_of_days: number = Math.floor(
    (end.getTime() - start.getTime()) / 86400000
  );

  const vehicle = await pool.query(
    `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING vehicle_name, daily_rent_price`,
    ["booked", vehicleId]
  );

  const totalPrice: number = vehicle.rows[0].daily_rent_price * number_of_days;

  const data = {
    ...result.rows[0],
    total_price: totalPrice,
    vehicle: vehicle.rows[0],
  };
  return data;
};

export const bookingServices = {
  createBooking,
};
