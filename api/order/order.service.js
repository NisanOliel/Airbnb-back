const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;

async function query(filterBy) {
  try {
    // const filterCriteria = _buildFilterCriteria(filterBy)
    // const sortCriteria = _buildSortCriteria(filterBy)
    console.log('filter form bk', filterBy);
    const collection = await dbService.getCollection('order');
    let orders = await collection.find({ hostId: filterBy.userId }).toArray();
    // .sort(sortCriteria).toArray()

    return orders;
  } catch (err) {
    logger.error('cannot find orders', err);
    throw err;
  }
}

async function getById(orderId) {
  try {
    const collection = await dbService.getCollection('order');
    const order = await collection.findOne({ _id: orderId });

    return order;
  } catch (err) {
    logger.error(`while finding order ${orderId}`, err);
    throw err;
  }
}

async function remove(orderId) {
  try {
    const collection = await dbService.getCollection('order');
    await collection.deleteOne({ _id: ObjectId(orderId) });
    return orderId;
  } catch (err) {
    logger.error(`cannot remove order ${orderId}`, err);
    throw err;
  }
}

function _formatDate(timestamp) {
  timestampFormat = new Date(timestamp);
  return Intl.DateTimeFormat('he', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(timestampFormat);
}

async function add(order) {
  try {
    order.startDate = _formatDate(order.startDate);
    order.endDate = _formatDate(order.endDate);

    console.log('order:', order);
    const collection = await dbService.getCollection('order');
    const addedOrder = await collection.insertOne(order);
    return order;
  } catch (err) {
    logger.error('cannot insert order', err);
    throw err;
  }
}
async function update(order) {
  try {
    var id = ObjectId(order._id);
    delete order._id;
    const collection = await dbService.getCollection('order');
    await collection.updateOne({ _id: id }, { $set: { ...order } });
    order._id = id;
    return order;
  } catch (err) {
    logger.error(`cannot update order ${orderId}`, err);
    throw err;
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
};

function _buildFilterCriteria(filterBy = { txt: '', status: null, byLabel: '' }) {
  const { txt, status, byLabel } = filterBy;
  const criteria = {};
  if (txt) criteria.name = { $regex: txt, $options: 'i' };
  if (status) {
    var inStock = status === 'In stock' ? true : false;
    criteria.inStock = { $eq: inStock };
  }
  if (byLabel) criteria.labels = { $in: byLabel };
  return criteria;
}

function _buildSortCriteria({ bySort = '' }) {
  let sort = bySort.split(' - ');
  let criteria = {};
  switch (sort[0]) {
    case 'Name':
      criteria.name = sort[1] === 'Increasing' ? 1 : -1;
      break;
    case 'price':
      criteria.price = sort[1] === 'Increasing' ? 1 : -1;
      break;
    case 'Created':
      criteria.createdAt = sort[1] === 'Increasing' ? 1 : -1;
      break;
  }
  return criteria;
}
