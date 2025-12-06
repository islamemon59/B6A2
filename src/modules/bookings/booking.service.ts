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

// update booking
const updateBooking = async (
  status: string,
  id: string,
  user: Record<string, unknown>
) => {
  const booking = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);

  const bookings = booking.rows[0];

  const today = new Date();
  const startDate = new Date(bookings.rent_start_date);
  const endDate = new Date(bookings.rent_end_date);

  if (
    user.role === "customer" &&
    status === "cancelled" &&
    startDate.getTime() > today.getTime() &&
    startDate.getTime() != today.getTime()
  ) {
    await pool.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,
      ["available", bookings.vehicle_id]
    );
    const updateBookings = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
      ["cancelled", id]
    );
    return updateBookings.rows[0];
  }

  if (user.role === "admin" && status === "returned") {
    const updateVehicle = await pool.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status`,
      ["available", bookings.vehicle_id]
    );
    const updateBookings = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
      ["returned", id]
    );
    return { ...updateBookings.rows[0], vehicle: updateVehicle.rows[0] };
  }

  if (today.getTime() > endDate.getTime()) {
    const updateVehicle = await pool.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status`,
      ["available", bookings.vehicle_id]
    );
    const updateBookings = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
      ["returned", id]
    );
    return { ...updateBookings.rows[0], vehicle: updateVehicle.rows[0] };
  }
};

export const bookingServices = {
  createBooking,
  updateBooking,
};
