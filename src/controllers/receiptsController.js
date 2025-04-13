const pool = require('../config/db');

exports.getAllReceipts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, c.first_name || ' ' || c.last_name as client_name, 
      l.first_name || ' ' || l.last_name as lawyer_name
      FROM receipts r
      JOIN clients c ON r.client_id = c.id
      JOIN lawyers l ON r.lawyer_id = l.id
      ORDER BY r.payment_date DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener recibos:', error);
    res.status(500).json({ error: 'Error al obtener recibos' });
  }
};

exports.getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT r.*, c.first_name || ' ' || c.last_name as client_name, 
      l.first_name || ' ' || l.last_name as lawyer_name,
      ca.case_title
      FROM receipts r
      JOIN clients c ON r.client_id = c.id
      JOIN lawyers l ON r.lawyer_id = l.id
      LEFT JOIN cases ca ON r.case_id = ca.id
      WHERE r.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recibo no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el recibo:', error);
    res.status(500).json({ error: 'Error al obtener el recibo' });
  }
};

exports.createReceipt = async (req, res) => {
  try {
    const { client_id, lawyer_id, case_id, amount, concept, payment_method } = req.body;
    
    if (!client_id || !lawyer_id || !amount || !concept) {
      return res.status(400).json({ error: 'Se requieren client_id, lawyer_id, amount y concept' });
    }
    
    // Verificar que el cliente y el abogado existan
    const clientResult = await pool.query('SELECT id FROM clients WHERE id = $1', [client_id]);
    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    const lawyerResult = await pool.query('SELECT id FROM lawyers WHERE id = $1', [lawyer_id]);
    if (lawyerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Abogado no encontrado' });
    }
    
    // Verificar que el caso exista si se proporcionó
    if (case_id) {
      const caseResult = await pool.query('SELECT id FROM cases WHERE id = $1', [case_id]);
      if (caseResult.rows.length === 0) {
        return res.status(404).json({ error: 'Caso no encontrado' });
      }
    }
    
    const result = await pool.query(`
      INSERT INTO receipts (client_id, lawyer_id, case_id, amount, concept, payment_method)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [client_id, lawyer_id, case_id, amount, concept, payment_method]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear el recibo:', error);
    res.status(500).json({ error: 'Error al crear el recibo' });
  }
};

exports.updateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, concept, payment_method, payment_date } = req.body;
    
    const receiptCheck = await pool.query('SELECT id FROM receipts WHERE id = $1', [id]);
    if (receiptCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Recibo no encontrado' });
    }
    
    let updateFields = [];
    let queryParams = [];
    let paramCounter = 1;
    
    if (amount !== undefined) {
      updateFields.push(`amount = $${paramCounter}`);
      queryParams.push(amount);
      paramCounter++;
    }
    
    if (concept !== undefined) {
      updateFields.push(`concept = $${paramCounter}`);
      queryParams.push(concept);
      paramCounter++;
    }
    
    if (payment_method !== undefined) {
      updateFields.push(`payment_method = $${paramCounter}`);
      queryParams.push(payment_method);
      paramCounter++;
    }
    
    if (payment_date !== undefined) {
      updateFields.push(`payment_date = $${paramCounter}`);
      queryParams.push(payment_date);
      paramCounter++;
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }
    
    // Añadir el ID al final de los parámetros
    queryParams.push(id);
    
    const result = await pool.query(`
      UPDATE receipts 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCounter} 
      RETURNING *
    `, queryParams);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el recibo:', error);
    res.status(500).json({ error: 'Error al actualizar el recibo' });
  }
};

exports.deleteReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el recibo existe
    const receiptCheck = await pool.query('SELECT id FROM receipts WHERE id = $1', [id]);
    if (receiptCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Recibo no encontrado' });
    }
    
    // Verificar si hay facturas asociadas
    const invoiceCheck = await pool.query('SELECT id FROM invoices WHERE receipt_id = $1', [id]);
    if (invoiceCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el recibo porque tiene facturas asociadas',
        invoices: invoiceCheck.rows.map(row => row.id)
      });
    }
    
    await pool.query('DELETE FROM receipts WHERE id = $1', [id]);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el recibo:', error);
    res.status(500).json({ error: 'Error al eliminar el recibo' });
  }
};

exports.getReceiptsByLawyer = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    
    const lawyerCheck = await pool.query('SELECT id FROM lawyers WHERE id = $1', [lawyerId]);
    if (lawyerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Abogado no encontrado' });
    }
    
    const result = await pool.query(`
      SELECT r.*, c.first_name || ' ' || c.last_name as client_name
      FROM receipts r
      JOIN clients c ON r.client_id = c.id
      WHERE r.lawyer_id = $1
      ORDER BY r.payment_date DESC
    `, [lawyerId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener recibos del abogado:', error);
    res.status(500).json({ error: 'Error al obtener recibos del abogado' });
  }
};

exports.getReceiptsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    // Verificar que el cliente existe
    const clientCheck = await pool.query('SELECT id FROM clients WHERE id = $1', [clientId]);
    if (clientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    const result = await pool.query(`
      SELECT r.*, l.first_name || ' ' || l.last_name as lawyer_name
      FROM receipts r
      JOIN lawyers l ON r.lawyer_id = l.id
      WHERE r.client_id = $1
      ORDER BY r.payment_date DESC
    `, [clientId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener recibos del cliente:', error);
    res.status(500).json({ error: 'Error al obtener recibos del cliente' });
  }
};