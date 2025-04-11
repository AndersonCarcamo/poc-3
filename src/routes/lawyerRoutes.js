const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/lawyerController');

/**
 * @swagger
 * tags:
 *   name: Lawyer
 *   description: Endpoints para abogados
 */

/**
 * @swagger
 * /lawyer:
 *   post:
 *     summary: Crear abogado
 *     tags: [Lawyer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, email]
 *             properties:
 *               first_name: { type: string }
 *               last_name: { type: string }
 *               email: { type: string }
 *               specialty: { type: string }
 *               phone: { type: string }
 *               hourly_rate: { type: number }
 *     responses:
 *       201:
 *         description: Abogado creado
 */
router.post('/', ctrl.createLawyer);

/**
 * @swagger
 * /lawyer:
 *   get:
 *     summary: Obtener todos los abogados
 *     tags: [Lawyer]
 *     responses:
 *       200:
 *         description: Lista de abogados
 */
router.get('/', ctrl.getLawyers);

/**
 * @swagger
 * /lawyer/{id}:
 *   put:
 *     summary: Actualizar abogado
 *     tags: [Lawyer]
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
 *               first_name: { type: string }
 *               last_name: { type: string }
 *               email: { type: string }
 *               specialty: { type: string }
 *               phone: { type: string }
 *               hourly_rate: { type: number }
 *     responses:
 *       200:
 *         description: Abogado actualizado
 */
router.put('/:id', ctrl.updateLawyer);

/**
 * @swagger
 * /lawyer/{id}:
 *   delete:
 *     summary: Eliminar abogado
 *     tags: [Lawyer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Eliminado correctamente
 */
router.delete('/:id', ctrl.deleteLawyer);

module.exports = router;
