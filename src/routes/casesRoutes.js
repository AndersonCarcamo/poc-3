const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/caseController');

/**
 * @swagger
 * tags:
 *   name: Cases
 *   description: Gestión de casos
 */

/**
 * @swagger
 * /cases:
 *   get:
 *     summary: Obtener casos con filtros
 *     tags: [Cases]
 * 
 *     parameters:
 *       - in: query
 *         name: case_status
 *         schema: { type: string }
 *         description: Filtro por estado del caso
 *       - in: query
 *         name: lawyer_id
 *         schema: { type: string }
 *         description: Filtro por ID de abogado
 *       - in: query
 *         name: client_id
 *         schema: { type: string }
 *         description: Filtro por ID de cliente
 *     responses:
 *       200:
 *         description: Lista de casos con información relacionada
 */
router.get('/', ctrl.getCases);

/**
 * @swagger
 * /cases:
 *   post:
 *     summary: Crear nuevo caso
 *     tags: [Cases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lawyer_id
 *               - client_id
 *               - case_title
 *             properties:
 *               lawyer_id: { type: string, format: uuid }
 *               client_id: { type: string, format: uuid }
 *               case_title:
 *                 type: string
 *               case_description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Caso creado exitosamente
 */
router.post('/', ctrl.createCase);

/**
 * @swagger
 * /cases/{caseId}:
 *   get:
 *     summary: Obtener detalles de un caso
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: caseId
 *         schema: 
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID del caso
 *     responses:
 *       200:
 *         description: Detalles completos del caso con relaciones
 */
router.get('/:caseId', ctrl.getCaseById);

/**
 * @swagger
 * /cases/{caseId}:
 *   put:
 *     summary: Actualizar un caso
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: caseId
 *         schema: { type: string }
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               case_title:
 *                 type: string
 *               case_description:
 *                 type: string
 *               case_status:
 *                 type: string
 *                 enum: [Abierto, En Proceso, Cerrado]
 *     responses:
 *       200:
 *         description: Caso actualizado
 */
router.put('/:caseId', ctrl.updateCase);

/**
 * @swagger
 * /cases/{caseId}:
 *   delete:
 *     summary: Eliminar un caso
 *     tags: [Cases]
 *     parameters:
 *       - in: path
 *         name: caseId
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       204:
 *         description: Caso eliminado exitosamente
 *       500:
 *         description: Error al eliminar caso con recibos asociados
 */
router.delete('/:caseId', ctrl.deleteCase);

/**
 * @swagger
 * components:
 *   schemas:
 *     Case:
 *       # campos requeridos de un caso
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         case_title:
 *           type: string
 *         case_description:
 *           type: string
 *         case_status:
 *           type: string
 *         opened_date:
 *           type: string
 *           format: date-time
 *         client_first_name:
 *           type: string
 *         client_last_name:
 *           type: string
 *         lawyer_first_name:
 *           type: string
 *         lawyer_last_name:
 *           type: string
 * 
 *     CaseDetails:
 *       # Hereda todos los campos de Case
 *       allOf:
 *         - $ref: '#/components/schemas/Case'
 *         - type: object
 *           properties:
 *             client_full_name:
 *               type: string
 *             lawyer_full_name:
 *               type: string
 *             receipts:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receipt'
 * 
 *     Receipt:
 *       # Estructura de un recibo relacionado
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         amount:
 *           type: number
 *         payment_date:
 *           type: string
 *           format: date-time
 *         payment_method:
 *           type: string
 */

module.exports = router;