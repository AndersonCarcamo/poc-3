const pool = require('../config/db');

// GET all or by ID
exports.getLawyers = async (req, res) => {
  try {
    const { id } = req.query;
    const query = id
      ? 'SELECT * FROM lawyers WHERE id = $1'
      : 'SELECT * FROM lawyers';
    const values = id ? [id] : [];
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener abogados:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST
exports.createLawyer = async (req, res) => {
  try {
    const { first_name, last_name, email, specialty, phone, hourly_rate } = req.body;
    const result = await pool.query(
      `INSERT INTO lawyers (first_name, last_name, email, specialty, phone, hourly_rate)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [first_name, last_name, email, specialty, phone, hourly_rate]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear abogado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT
exports.updateLawyer = async (req, res) => {
  try {
    const { id, first_name, last_name, email, specialty, phone, hourly_rate } = req.body;
    if (!id) return res.status(400).json({ message: 'ID requerido' });

    await pool.query(
      `UPDATE lawyers SET first_name = $1, last_name = $2, email = $3,
       specialty = $4, phone = $5, hourly_rate = $6 WHERE id = $7`,
      [first_name, last_name, email, specialty, phone, hourly_rate, id]
    );
    res.status(200).json({ message: 'Abogado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar abogado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// DELETE
exports.deleteLawyer = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: 'ID requerido' });

    await pool.query('DELETE FROM lawyers WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar abogado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
