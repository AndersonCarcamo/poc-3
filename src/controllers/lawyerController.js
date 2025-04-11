const pool = require('../config/db');

exports.createLawyer = async (req, res) => {
  try {
    const { first_name, last_name, specialty, email, phone, hourly_rate } = req.body;
    const result = await pool.query(
      `INSERT INTO lawyers (first_name, last_name, specialty, email, phone, hourly_rate)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [first_name, last_name, specialty, email, phone, hourly_rate]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLawyers = async (_, res) => {
  const result = await pool.query('SELECT * FROM lawyers');
  res.json(result.rows);
};

exports.updateLawyer = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, specialty, email, phone, hourly_rate } = req.body;
    const result = await pool.query(
      `UPDATE lawyers SET first_name = $1, last_name = $2, specialty = $3,
       email = $4, phone = $5, hourly_rate = $6 WHERE id = $7 RETURNING *`,
      [first_name, last_name, specialty, email, phone, hourly_rate, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLawyer = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM lawyers WHERE id = $1', [id]);
  res.status(204).send();
};
