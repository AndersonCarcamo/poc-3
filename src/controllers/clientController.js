const pool = require('../config/db');

exports.getAllClients = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM clients 
      ORDER BY last_name, first_name
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT * FROM clients WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    const casesResult = await pool.query(`
      SELECT c.*, l.first_name || ' ' || l.last_name as lawyer_name
      FROM cases c
      JOIN lawyers l ON c.lawyer_id = l.id
      WHERE c.client_id = $1
      ORDER BY c.opened_date DESC
    `, [id]);
    
    const receiptsResult = await pool.query(`
      SELECT r.*, l.first_name || ' ' || l.last_name as lawyer_name
      FROM receipts r
      JOIN lawyers l ON r.lawyer_id = l.id
      WHERE r.client_id = $1
      ORDER BY r.payment_date DESC
    `, [id]);
    
    const clientInfo = {
      ...result.rows[0],
      cases: casesResult.rows,
      receipts: receiptsResult.rows
    };
    
    res.json(clientInfo);
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
};

exports.createClient = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, address } = req.body;
    
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ error: 'Se requieren first_name, last_name y email' });
    }
    
    const emailCheck = await pool.query('SELECT id FROM clients WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un cliente con ese email' });
    }
    
    const result = await pool.query(`
      INSERT INTO clients (first_name, last_name, email, phone, address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [first_name, last_name, email, phone, address]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(500).json({ error: 'Error al crear el cliente' });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, address } = req.body;
    
    const clientCheck = await pool.query('SELECT id FROM clients WHERE id = $1', [id]);
    if (clientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    if (email) {
      const emailCheck = await pool.query('SELECT id FROM clients WHERE email = $1 AND id != $2', [email, id]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Ya existe otro cliente con ese email' });
      }
    }
    
    let updateFields = [];
    let queryParams = [];
    let paramCounter = 1;
    
    if (first_name !== undefined) {
      updateFields.push(`first_name = $${paramCounter}`);
      queryParams.push(first_name);
      paramCounter++;
    }
    
    if (last_name !== undefined) {
      updateFields.push(`last_name = $${paramCounter}`);
      queryParams.push(last_name);
      paramCounter++;
    }
    
    if (email !== undefined) {
      updateFields.push(`email = $${paramCounter}`);
      queryParams.push(email);
      paramCounter++;
    }
    
    if (phone !== undefined) {
      updateFields.push(`phone = $${paramCounter}`);
      queryParams.push(phone);
      paramCounter++;
    }
    
    if (address !== undefined) {
      updateFields.push(`address = $${paramCounter}`);
      queryParams.push(address);
      paramCounter++;
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }
    
    queryParams.push(id);
    
    const result = await pool.query(`
      UPDATE clients 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCounter} 
      RETURNING *
    `, queryParams);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    
    const clientCheck = await pool.query('SELECT id FROM clients WHERE id = $1', [id]);
    if (clientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    const casesCheck = await pool.query('SELECT id FROM cases WHERE client_id = $1', [id]);
    if (casesCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el cliente porque tiene casos asociados',
        cases: casesCheck.rows.map(row => row.id)
      });
    }
    
    const receiptsCheck = await pool.query('SELECT id FROM receipts WHERE client_id = $1', [id]);
    if (receiptsCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el cliente porque tiene recibos asociados',
        receipts: receiptsCheck.rows.map(row => row.id)
      });
    }
    
    await pool.query('DELETE FROM clients WHERE id = $1', [id]);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
};