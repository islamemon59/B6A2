import { pool } from "../../config/db";

// getAllUser admin only
const getAllUser = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result.rows;
};

// update user admin, customer
const updateUser = async (
  body: Record<string, unknown>,
  payload: Record<string, unknown>,
  id: string
) => {
  const { name, email, phone, role } = body;
  // console.log(payload);

  if (payload.role === "admin") {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`,
      [name, email, phone, role, id]
    );
    delete result.rows[0].password;
    return result.rows[0];
  } else if (payload.role === "customer" && payload.id == id) {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING *`,
      [name, email, phone, id]
    );
    delete result.rows[0].password;
    return result.rows[0];
  }
};

export const userServices = {
  getAllUser,
  updateUser,
};
