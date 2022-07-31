const orderService = require('./order.service.js');
const logger = require('../../services/logger.service');

// GET LIST
async function getOrders(req, res) {
  try {
    logger.debug('Getting Orders');
    // console.log('req', req, 'res', res);
    var queryParams = req.query;
    console.log('queryParams', queryParams);
    const orders = await orderService.query(queryParams);
    res.json(orders);
  } catch (err) {
    logger.error('Failed to get orders', err);
    res.status(500).send({ err: 'Failed to get orders' });
  }
}

async function getOrder(req, res) {
  try {
    const order = await orderService.getById(req.params.id);
    res.send(order);
  } catch (err) {
    logger.error('Failed to get order', err);
    res.status(500).send({ err: 'Failed to get order' });
  }
}

// GET BY ID
async function getOrderById(req, res) {
  try {
    const orderId = req.params.id;
    const order = await orderService.getById(orderId);
    res.json(order);
  } catch (err) {
    logger.error('Failed to get order', err);
    res.status(500).send({ err: 'Failed to get order' });
  }
}

// POST (add order)
async function addOrder(req, res) {
  try {
    const order = req.body;
    const addedOrder = await orderService.add(order);
    return res.json(addedOrder);
  } catch (err) {
    logger.error('Failed to add order', err);
    res.status(500).send({ err: 'Failed to add order' });
  }
}

// PUT (Update order)
async function updateOrder(req, res) {
  try {
    const order = req.body;
    const updatedOrder = await orderService.update(order);
    res.json(updatedOrder);
  } catch (err) {
    logger.error('Failed to update order', err);
    res.status(500).send({ err: 'Failed to update order' });
  }
}

// DELETE (Remove order)
async function removeOrder(req, res) {
  try {
    const orderId = req.params.id;
    await orderService.remove(orderId);
    res.send('Removed');
  } catch (err) {
    logger.error('Failed to remove order', err);
    res.status(500).send({ err: 'Failed to remove order' });
  }
}

module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  updateOrder,
  removeOrder,
  getOrder,
};
