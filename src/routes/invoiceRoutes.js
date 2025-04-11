const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/invoiceController');

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Gestión de facturas
 */

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Crear factura
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receipt_id: { type: string }
 *               invoice_number: { type: string }
 *               due_date: { type: string, format: date-time }
 *               tax_amount: { type: number }
 *               total_amount: { type: number }
 *     responses:
 *       201:
 *         description: Factura creada
 */
router.post('/', ctrl.createInvoice);

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Obtener facturas (por ID o todas)
 *     tags: [Invoices]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: UUID de la factura (opcional)
 *     responses:
 *       200:
 *         description: Facturas obtenidas
 */
router.get('/', ctrl.getInvoices);

/**
 * @swagger
 * /invoices:
 *   put:
 *     summary: Actualizar factura por ID
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: string
 *               due_date:
 *                 type: string
 *               tax_amount:
 *                 type: number
 *               total_amount:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Factura actualizada
 */
router.put('/', ctrl.updateInvoice);

/**
 * @swagger
 * /invoices:
 *   delete:
 *     summary: Eliminar factura por ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID de la factura
 *     responses:
 *       204:
 *         description: Eliminado correctamente
 */
router.delete('/', ctrl.deleteInvoice);

module.exports = router;
