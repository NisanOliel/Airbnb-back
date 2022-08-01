const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addOrder, getOrders, getOrder, updateOrder } = require('./order.controller')
const router = express.Router()



router.get('/', log, getOrders)
router.post('/', log, addOrder)
router.put('/:id', log, updateOrder)
router.get('/:id', log, getOrder)


module.exports = router