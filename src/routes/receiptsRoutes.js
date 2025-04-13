const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptsController');

/**
 * @swagger
 * tags:
 *   name: Receipts
 *   description: API para gestionar recibos de pagos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Receipt:
 *       type: object
 *       required:
 *         - client_id
 *         - lawyer_id
 *         - amount
 *         - concept
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del recibo
 *         client_id:
 *           type: string
 *           format: uuid
 *           description: ID del cliente
 *         lawyer_id:
 *           type: string
 *           format: uuid
 *           description: ID del abogado
 *         case_id:
 *           type: string
 *           format: uuid
 *           description: ID del caso (opcional)
 *         amount:
 *           type: number
 *           description: Monto del pago
 *         concept:
 *           type: string
 *           description: Concepto del pago
 *         payment_date:
 *           type: string
 *           format: date-time
 *           description: Fecha del pago
 *         payment_method:
 *           type: string
 *           description: Método de pago
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 */

/**
 * @swagger
 * /receipts:
 *   get:
 *     summary: Obtiene todos los recibos
 *     tags: [Receipts]
 *     responses:
 *       200:
 *         description: Lista de recibos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receipt'
 */
router.get('/', receiptController.getAllReceipts);

/**
 * @swagger
 * /receipts/{id}:
 *   get:
 *     summary: Obtiene un recibo por su ID
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del recibo
 *     responses:
 *       200:
 *         description: Detalle del recibo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receipt'
 *       404:
 *         description: Recibo no encontrado
 */
router.get('/:id', receiptController.getReceiptById);

/**
 * @swagger
 * /receipts:
 *   post:
 *     summary: Crea un nuevo recibo
 *     tags: [Receipts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client_id
 *               - lawyer_id
 *               - amount
 *               - concept
 *             properties:
 *               client_id:
 *                 type: string
 *                 format: uuid
 *               lawyer_id:
 *                 type: string
 *                 format: uuid
 *               case_id:
 *                 type: string
 *                 format: uuid
 *               amount:
 *                 type: number
 *               concept:
 *                 type: string
 *               payment_method:
 *                 type: string
 *     responses:
 *       201:
 *         description: Recibo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receipt'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Cliente, abogado o caso no encontrado
 */
router.post('/', receiptController.createReceipt);

/**
 * @swagger
 * /receipts/{id}:
 *   put:
 *     summary: Actualiza un recibo existente
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del recibo
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               concept:
 *                 type: string
 *               payment_method:
 *                 type: string
 *               payment_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Recibo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receipt'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Recibo no encontrado
 */
router.put('/:id', receiptController.updateReceipt);

/**
 * @swagger
 * /receipts/{id}:
 *   delete:
 *     summary: Elimina un recibo
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del recibo
 *     responses:
 *       204:
 *         description: Recibo eliminado exitosamente
 *       400:
 *         description: No se puede eliminar el recibo porque tiene facturas asociadas
 *       404:
 *         description: Recibo no encontrado
 */
router.delete('/:id', receiptController.deleteReceipt);

/**
 * @swagger
 * /receipts/lawyer/{lawyerId}:
 *   get:
 *     summary: Obtiene recibos por abogado
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: lawyerId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del abogado
 *     responses:
 *       200:
 *         description: Lista de recibos del abogado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receipt'
 *       404:
 *         description: Abogado no encontrado
 */
router.get('/lawyer/:lawyerId', receiptController.getReceiptsByLawyer);

/**
 * @swagger
 * /receipts/client/{clientId}:
 *   get:
 *     summary: Obtiene recibos por cliente
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de recibos del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receipt'
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/client/:clientId', receiptController.getReceiptsByClient);

module.exports = router;