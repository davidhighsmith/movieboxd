import getDbInstance from "@/lib/getDbInstance";

// checks a property on an object
// needs to have the most important error at the top
// will return on the first error it encounters for the property
// TODO: Will need some sort of settings object for more complex checks
export const checkProperty = (validObj, obj, schema) => {
  // base checks that any type will need to pass
  // must have all properties in the schema
  if (!obj.hasOwnProperty(schema.name)) {
    pushErrorProperty(validObj, schema.name);
    return;
  }

  // if property is nullable and the value is null no further checks are needed
  if (schema.nullable && obj[schema.name] === null) return;

  // checks to make sure the type of the propert is correct
  if (typeof(obj[schema.name]) !== schema.type) {
    pushErrorType(validObj, schema.name, schema.type);
    return;
  }

  // specific checks
  if (schema.type === 'string') {
    if (obj[schema.name].trim() === '') pushErrorEmpty(validObj, schema.name);
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