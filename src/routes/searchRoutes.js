const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/searchController');

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Búsqueda de casos usando texto
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Buscar casos por texto
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema: { type: string }
 *         required: true
 *         description: Texto a buscar
 *     responses:
 *       200:
 *         description: Lista de casos encontrados
 */
router.get('/', ctrl.searchCases);

module.exports = router;
