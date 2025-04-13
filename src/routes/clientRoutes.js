const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: API para gestionar clientes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del cliente
 *         first_name:
 *           type: string
 *           description: Nombre del cliente
 *         last_name:
 *           type: string
 *           description: Apellido del cliente
 *         email:
 *           type: string
 *           format: email
 *           description: Email del cliente
 *         phone:
 *           type: string
 *           description: Teléfono del cliente
 *         address:
 *           type: string
 *           description: Dirección del cliente
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
 * /client:
 *   get:
 *     summary: Obtiene todos los clientes
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 */
router.get('/', clientController.getAllClients);

/**
 * @swagger
 * /client/{id}:
 *   get:
 *     summary: Obtiene un cliente por su ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Detalle del cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', clientController.getClientById);

/**
 * @swagger
 * /client:
 *   post:
 *     summary: Crea un nuevo cliente
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Datos inválidos o email ya registrado
 */
router.post('/', clientController.createClient);

/**
 * @swagger
 * /client/{id}:
 *   put:
 *     summary: Actualiza un cliente existente
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del cliente
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Datos inválidos o email ya registrado
 *       404:
 *         description: Cliente no encontrado
 */
router.put('/:id', clientController.updateClient);

/**
 * @swagger
 * /client/{id}:
 *   delete:
 *     summary: Elimina un cliente
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       204:
 *         description: Cliente eliminado exitosamente
 *       400:
 *         description: No se puede eliminar el cliente porque tiene casos o recibos asociados
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/:id', clientController.deleteClient);

module.exports = router;