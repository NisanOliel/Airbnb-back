const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;

async function query(filterBy) {
  try {
    const filterCriteria = _buildFilterCriteria(filterBy);

    const collection = await dbService.getCollection('stay');
    let stays = await collection.find(filterCriteria).toArray();

    return stays;
  } catch (err) {
    logger.error('cannot find stays', err);
    throw err;
  }
}

function _buildFilterCriteria(filterBy) {
  if (!Object.values(filterBy).length) return;
  const { location, price, bedrooms, beds, propertyType, amenities, hostLanguage, hostID } = filterBy;
  if (price) {
    var jsonPrice = JSON.parse(price);
  }

  let criteria = {};
  if (location) {
    criteria = { $or: [{ ['address.country']: { $regex: location, $options: 'i' } }, { ['address.city']: { $regex: location, $options: 'i' } }] };
  }

  if (jsonPrice) criteria['price'] = { $gt: jsonPrice.minPrice, $lt: jsonPrice.maxPrice };
  if (bedrooms) criteria.bedrooms = +bedrooms;
  if (beds) criteria.beds = +beds;

  if (propertyType) criteria.propertyType = { $in: propertyType };

  if (amenities) criteria['amenities.name'] = { $in: amenities };
  if (hostLanguage) criteria['host.hostLanguage'] = { $in: hostLanguage };

  if (hostID) criteria['host._id'] = hostID;

  return criteria;
}


async function getById(stayId) {
  try {
    const collection = await dbService.getCollection('stay');
    const stay = await collection.findOne({ _id: stayId });

    return stay;
  } catch (err) {
    logger.error(`while finding stay ${stayId}`, err);
    throw err;
  }
}

async function remove(stayId) {
  try {
    const collection = await dbService.getCollection('stay');
    await collection.deleteOne({ _id: ObjectId(stayId) });
    return stayId;
  } catch (err) {
    logger.error(`cannot remove stay ${stayId}`, err);
    throw err;
  }
}

async function add(stay) {
  try {
    const collection = await dbService.getCollection('stay');
    const addedStay = await collection.insertOne(stay);
    return stay;
  } catch (err) {
    logger.error('cannot insert stay', err);
    throw err;
  }
}
async function update(stay) {
  try {
    var id = ObjectId(stay._id);
    delete stay._id;
    const collection = await dbService.getCollection('stay');
    await collection.updateOne({ _id: id }, { $set: { ...stay } });
    stay._id = id;
    return stay;
  } catch (err) {
    logger.error(`cannot update stay ${stayId}`, err);
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