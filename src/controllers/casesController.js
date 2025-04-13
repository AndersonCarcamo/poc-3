const pool = require('../config/db');

// GET
exports.getCases = async (req, res) => {
    const { case_status, lawyer_id, client_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        let query = `SELECT cases.id, case_title,
                        case_description, case_status,
                        opened_date, clients.first_name as client_first_name,
                        clients.last_name as client_last_name,
                        lawyers.first_name as lawyer_first_name,
                        lawyers.last_name as lawyer_last_name
                    FROM cases
                    JOIN clients ON cases.client_id = clients.id
                    JOIN lawyers ON cases.lawyer_id = lawyers.id
                    WHERE 1=1`;

        const params = [];
        let paramIndex = 1;

        if (case_status) {
            query += ` AND case_status = $${paramIndex}`;
            params.push(case_status);
            paramIndex++;
        }
        if (lawyer_id) {
            query += ` AND cases.lawyer_id = $${paramIndex}`;
            params.push(lawyer_id);
            paramIndex++;
        }
        if (client_id) {
            query += ` AND cases.client_id = $${paramIndex}`;
            params.push(client_id);
            paramIndex++;
        }

        query += ` ORDER BY opened_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
};

// POST
exports.createCase = async (req, res) => {
    const { lawyer_id, client_id, case_title, case_description } = req.body;

    try {
        // el cliente y abogado tienen que estar almacenados en la base de datos
        const [lawyer, client] = await Promise.all([
            pool.query('SELECT id FROM lawyers WHERE id = $1', [lawyer_id]),
            pool.query('SELECT id FROM clients WHERE id = $1', [client_id])
        ]);

        if (lawyer.rows.length === 0 || client.rows.length === 0) {
            return res.status(404).json({ message: 'Abogado o cliente no encontrado' });
        }

        const result = await pool.query(
            `INSERT INTO cases 
            (lawyer_id, client_id, case_title, case_description)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [lawyer_id, client_id, case_title, case_description]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
};

// GET
exports.getCaseById = async (req, res) => {
    try {
        const caseResult = await pool.query(
            `SELECT 
                cases.*,
                CONCAT(clients.first_name, ' ', clients.last_name) as client_full_name,
                CONCAT(lawyers.first_name, ' ', lawyers.last_name) as lawyer_full_name,
                lawyers.specialty
            FROM cases
            JOIN clients ON cases.client_id = clients.id
            JOIN lawyers ON cases.lawyer_id = lawyers.id
            WHERE cases.id = $1`,
            [req.params.caseId]
        );

        const receipts = await pool.query(
            `SELECT id, amount, payment_date, payment_method 
             FROM receipts WHERE case_id = $1`,
            [req.params.caseId]
        );

        if (!caseResult.rows.length) {
            return res.status(404).json({ message: 'Caso no encontrado' });
        }

        res.json({
            ...caseResult.rows[0],
            receipts: receipts.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT
exports.updateCase = async (req, res) => {
    const { case_title, case_description, case_status } = req.body;

    try {
        const result = await pool.query(
            `UPDATE cases SET
             case_title = COALESCE($1, case_title),
             case_description = COALESCE($2, case_description),
             case_status = COALESCE($3, case_status),
             updated_at = NOW()
             WHERE id = $4 
             RETURNING *`,
            [case_title, case_description, case_status, req.params.caseId]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Caso no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
exports.deleteCase = async (req, res) => {
    try {
        await pool.query('DELETE FROM cases WHERE id = $1', [req.params.caseId]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: 'No se puede eliminar el caso mientras tenga recibos asociados'
        });
    }
};