const pool = require('../config/db');

exports.searchCases = async (req, res) => {
  const { query } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM cases
       WHERE document_with_weights @@ plainto_tsquery('spanish', $1)`,
      [query]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
