const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
  try {
    // const filterCriteria = _buildFilterCriteria(filterBy)
    // const sortCriteria = _buildSortCriteria(filterBy)

    const collection = await dbService.getCollection('stay')
    let stays = await collection.find({}).toArray()
    // .sort(sortCriteria).toArray()

    return stays
  } catch (err) {
    logger.error('cannot find stays', err)
    throw err
  }
}

async function getById(stayId) {
  try {
    const collection = await dbService.getCollection('stay')
    const stay = await collection.findOne({ '_id': stayId })

    return stay
  } catch (err) {
    logger.error(`while finding stay ${stayId}`, err)
    throw err
  }
}

async function remove(stayId) {
  try {
    const collection = await dbService.getCollection('stay')
    await collection.deleteOne({ _id: ObjectId(stayId) })
    return stayId
  } catch (err) {
    logger.error(`cannot remove stay ${stayId}`, err)
    throw err
  }
}

async function add(stay) {
  try {
    const collection = await dbService.getCollection('stay')
    const addedStay = await collection.insertOne(stay)
    return stay
  } catch (err) {
    logger.error('cannot insert stay', err)
    throw err
  }
}
async function update(stay) {
  try {
    var id = ObjectId(stay._id)
    delete stay._id
    const collection = await dbService.getCollection('stay')
    await collection.updateOne({ _id: id }, { $set: { ...stay } })
    stay._id = id
    return stay
  } catch (err) {
    logger.error(`cannot update stay ${stayId}`, err)
    throw err
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
}

function _buildFilterCriteria(filterBy = { txt: '', status: null, byLabel: '' }) {
  const { txt, status, byLabel } = filterBy
  const criteria = {}
  if (txt) criteria.name = { $regex: txt, $options: 'i' }
  if (status) {
    var inStock = status === 'In stock' ? true : false
    criteria.inStock = { $eq: inStock }
  }
  if (byLabel) criteria.labels = { $in: byLabel }
  return criteria
}

function _buildSortCriteria({ bySort = '' }) {
  let sort = bySort.split(' - ')
  let criteria = {}
  switch (sort[0]) {
    case 'Name':
      criteria.name = sort[1] === 'Increasing' ? 1 : -1
      break
    case 'price':
      criteria.price = sort[1] === 'Increasing' ? 1 : -1
      break
    case 'Created':
      criteria.createdAt = sort[1] === 'Increasing' ? 1 : -1
      break
  }
  return criteria
}
