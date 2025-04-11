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
 *     summary: Obtener todas las facturas
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: Lista de facturas
 */
router.get('/', ctrl.getAllInvoices);

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Obtener factura por ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Factura encontrada
 */
router.get('/:id', ctrl.getInvoiceById);

/**
 * @swagger
 * /invoices/{id}:
 *   put:
 *     summary: Actualizar factura
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               due_date: { type: string }
 *               tax_amount: { type: number }
 *               total_amount: { type: number }
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Factura actualizada
 */
router.put('/:id', ctrl.updateInvoice);

/**
 * @swagger
 * /invoices/{id}:
 *   delete:
 *     summary: Eliminar factura
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Eliminado correctamente
 */
router.delete('/:id', ctrl.deleteInvoice);

module.exports = router;
