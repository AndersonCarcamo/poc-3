const pool = require('../config/db');

exports.createInvoice = async (req, res) => {
  try {
    const { receipt_id, invoice_number, due_date, tax_amount, total_amount } = req.body;
    const result = await pool.query(
      `INSERT INTO invoices (receipt_id, invoice_number, due_date, tax_amount, total_amount)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [receipt_id, invoice_number, due_date, tax_amount, total_amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllInvoices = async (_, res) => {
  const result = await pool.query('SELECT * FROM invoices');
  res.json(result.rows);
};

exports.getInvoiceById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);
  res.json(result.rows[0]);
};

exports.updateInvoice = async (req, res) => {
  const { id } = req.params;
  const { due_date, tax_amount, total_amount, status } = req.body;
  const result = await pool.query(
    `UPDATE invoices SET due_date = $1, tax_amount = $2,
     total_amount = $3, status = $4 WHERE id = $5 RETURNING *`,
    [due_date, tax_amount, total_amount, status, id]
  );
  res.json(result.rows[0]);
};

exports.deleteInvoice = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM invoices WHERE id = $1', [id]);
  res.status(204).send();
};
