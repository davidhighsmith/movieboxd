import getDbInstance from "@/lib/getDbInstance";

// checks a property on an object
// needs to have the most important error at the top
// will return on the first error it encounters for the property
// TODO: Will need some sort of settings object for more complex checks
export const checkProperty = (validObj, obj, property) => {
  // base checks that any type will need to pass
  if (!obj.hasOwnProperty(property.name)) {
    pushErrorProperty(validObj, property.name);
    return;
  }
  if (typeof(obj[property.name]) !== property.type) {
    pushErrorType(validObj, property.name, property.type);
    return;
  }

  if (property.type === 'string') {
    if (obj[property.name].trim() === '') pushErrorEmpty(validObj, property.name);
    return;
  }
}

const pushErrorProperty = (validObj, property) => {
  validObj.valid = false;
  validObj.errors.push(`There needs to be a '${property}' property.`);
}

const pushErrorType = (validObj, property, type) => {
  validObj.valid = false;
  validObj.errors.push(`The '${property}' property needs to be a ${type}.`);
}

const pushErrorEmpty = (validObj, property) => {
  validObj.valid = false;
  validObj.errors.push(`The '${property}' property cannot be empty.`);
}

export default class BaseModel {
  static async find(collection, params = {}) {
    const db = await getDbInstance();
    const result = await db.collection(collection).find(params).toArray();
    return JSON.parse(JSON.stringify(result));
  }

  static async insertOne(collection, params) {
    const db = await getDbInstance();
    const result = await db.collection(collection).insertOne(params);
    return result;
  }
}