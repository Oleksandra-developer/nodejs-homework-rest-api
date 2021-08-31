/* eslint-disable no-useless-catch */
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const contactsPath = path.join(__dirname, "./contacts.json");

// async function getContacts() {
//   const allContacts = await fs.readFile(contactsPath);
//   const contactsFromJson = JSON.parse(allContacts);
//   return contactsFromJson.toString();
// }
const readData = async () => {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
};

const listContacts = async () => {
  try {
    return await readData();
  } catch (error) {
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await readData();
    const selectContact = contacts.find((contact) => contact.id === contactId);
    return selectContact;
  } catch (error) {
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const result = await readData();

    const idx = result.findIndex((item) => item.id === contactId);
    if (idx === -1) {
      return null;
    }
    const contact = result[idx];
    const contacts = result.filter((item) => item.id !== contactId);
    const newContacts = JSON.stringify(contacts);
    await fs.writeFile(contactsPath, newContacts);
    return contact;
  } catch (error) {
    throw error;
  }
};

const addContact = async (contact) => {
  try {
    const id = uuidv4();
    const newContact = { ...contact, id };
    const contacts = await readData();
    contacts.push(newContact);
    const contactsString = JSON.stringify(contacts);
    await fs.writeFile(contactsPath, contactsString);
    return newContact;
  } catch (error) {
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await readData();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      throw new Error(`Product with id=${contactId} not found`);
    }
    contacts[index] = { ...contacts[index], ...body };
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return contacts[index];
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
