'use strict';

const express = require('express');
const controller = require('./schema.controller');
const config = require('../../config/environment');
const auth = require('../../auth/auth.service');

const router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.put('/', auth.isAuthenticated(), controller.save);
router.patch('/', auth.isAuthenticated(), controller.save);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.post('/generate', controller.generate);

module.exports = router;
