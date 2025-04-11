const pool = require('../config/db');

// GET
exports.getInvoices = async (req, res) => {
  try {
    const { id } = req.query;
    const query = id
      ? 'SELECT * FROM invoices WHERE id = $1'
      : 'SELECT * FROM invoices';
    const values = id ? [id] : [];
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST
exports.createInvoice = async (req, res) => {
  try {
    const { receipt_id, invoice_number, due_date, tax_amount, total_amount, status } = req.body;
    const result = await pool.query(
      `INSERT INTO invoices (receipt_id, invoice_number, due_date, tax_amount, total_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [receipt_id, invoice_number, due_date, tax_amount, total_amount, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear factura:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT
exports.updateInvoice = async (req, res) => {
  try {
    const { id, due_date, tax_amount, total_amount, status } = req.body;
    if (!id) return res.status(400).json({ message: 'ID requerido' });

    await pool.query(
      `UPDATE invoices SET due_date = $1, tax_amount = $2, total_amount = $3, status = $4 WHERE id = $5`,
      [due_date, tax_amount, total_amount, status, id]
    );
    res.status(200).json({ message: 'Factura actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar factura:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// DELETE
exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: 'ID requerido' });

    await pool.query('DELETE FROM invoices WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar factura:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
