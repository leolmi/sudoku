'use strict';

const express = require('express');
const controller = require('./schema.controller');
const config = require('../../config/environment');
const auth = require('../../auth/auth.service');

const router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.save);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.post('/generate', controller.generate);
router.post('/recognize', controller.recognize);


module.exports = router;
