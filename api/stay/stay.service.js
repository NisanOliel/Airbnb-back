const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;

async function query(filterBy) {
  console.log('filterBy3123213:', filterBy);

  try {
    // const filterCriteria = _buildFilterCriteria(filterBy)
    console.log('filter form bk', filterBy);

    // const deepStays = stays;
    const { location } = filterBy;
    const regex = new RegExp(location, 'i');
    console.log('regex', regex);
    const collection = await dbService.getCollection('stay');
    let stays = await collection.find({ 'address.country': { $regex: regex } }).toArray();
    // .sort(sortCriteria).toArray()

    return stays;
    // return filterBy ? _getFilteredStays(filterBy, stays) : stays;
  } catch (err) {
    logger.error('cannot find stays', err);
    throw err;
  }
}

function _buildFilterCriteria(filterBy = { location: '' }) {
  // const { location } = filterBy
  // const criteria = {}
  // if (location) criteria.address.country = { $regex: location, $options: 'i' }
  // if (status) {
  //   var inStock = status === 'In stock' ? true : false
  //   criteria.inStock = { $eq: inStock }
  // }
  // if (byLabel) criteria.labels = { $in: byLabel }
  return criteria;
}

function _getFilteredStays(filterBy, stays) {
  const loc = filterBy?.location;
  // const deepStays = stays;

  const regex = new RegExp(loc, 'i');
  let filters = stays;
  if (loc) {
    filters = stays.filter(stay => regex.test(stay.address.country) || regex.test(stay.address.city));
  }
  for (let key in filterBy) {
    let value = filterBy[key];
    // value = JSON.parse(value)
    switch (key) {
      case 'bedrooms':
      case 'beds':
        if (value && value !== 'Any') {
          filters = filters.filter(stay => {
            return stay[key] === +value;
          });

          break;
        }
      case 'price':
        if (value) {
          const filteryByPrice = JSON.parse(value);
          const { minPrice, maxPrice } = filteryByPrice;

          filters = filters.filter(stay => {
            return stay.price >= minPrice && stay.price <= maxPrice;
          });
        }
        break;
      case 'propertyType':
        if (value.length > 0) {
          filters = filters.filter(stay => value.includes(stay.propertyType));
        }
        break;
      case 'label':
        if (value) {
          filters = filters.filter(stay => stay.propertyType.includes(value));
          filters = filters.length === 0 ? stays : filters;
        }
        break;
      case 'amenities':
        if (value.length > 0) {
          filters = filters.filter(stay => {
            return stay.amenities.find(amenity => value.includes(amenity.name));
          });
        }
        break;
      case 'hostLanguage':
        if (value.length > 0) {
          filters = filters.filter(stay => value.includes(stay.host.hostLanguage));
        }
        break;
      default:
        break;
    }
  }
  return filters;
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
