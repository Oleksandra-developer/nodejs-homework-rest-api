/* eslint-disable no-useless-catch */
const db = require("./db");
const { ObjectID } = require("mongodb");

const readCollection = async (db, name) => {
  const client = await db;
  const collection = await client.db().collection(name);
  return collection;
};

const listContacts = async () => {
  try {
    const collection = await readCollection(db, "contacts");
    const result = await collection.find({}).toArray();
    return result;
  } catch (error) {
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const collection = await readCollection(db, "contacts");
    const objId = new ObjectID(contactId);
    const [contact] = await collection.find({ _id: objId }).toArray();
    return contact;
  } catch (error) {
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const collection = await readCollection(db, "contacts");
    const objId = new ObjectID(contactId);
  } catch (error) {
    throw error;
  }
};

const addContact = async (contact) => {
  try {
    const collection = await readCollection(db, "contacts");
    // contacts.push(newContact);
    // const contactsString = JSON.stringify(contacts);
    // await fs.writeFile(contactsPath, contactsString);
    // return newContact;
  } catch (error) {
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const collection = await readCollection(db, "contacts");
    const objId = new ObjectID(contactId);
    // const index = contacts.findIndex(
    //   (contact) => String(contact.id) === contactId
    // );
    // if (index === -1) {
    //   throw new Error(`Product with id=${contactId} not found`);
    // }
    // contacts[index] = { ...contacts[index], ...body };
    // await fs.writeFile(contactsPath, JSON.stringify(contacts));
    // return contacts[index];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
