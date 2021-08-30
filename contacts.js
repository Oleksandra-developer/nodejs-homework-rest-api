const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "db/contacts.json");

async function getContacts() {
  const allContacts = await fs.readFile(contactsPath);
  const contacts = JSON.parse(allContacts);
  return contacts;
}

// TODO: задокументировать каждую функцию
async function listContacts() {
  try {
    const contacts = await getContacts();
    console.table(contacts);
    // return contacts;
  } catch (error) {
    console.log(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const idNormalize = Number(contactId);
    const contacts = await getContacts();
    if (!idNormalize) {
      throw new Error(`This contact is not found`);
    }
    const selectContact = contacts.find(
      (contact) => contact.id === idNormalize
    );
    console.log(selectContact);
    return selectContact;
  } catch (error) {
    throw console.error(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await getContacts();
    const idNormalize = Number(contactId);
    const filteredContacts = contacts.filter(
      (contact) => contact.id !== idNormalize
    );
    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
    console.table(filteredContacts);
    return filteredContacts;
  } catch (error) {
    throw console.error(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await getContacts();
    const newContact = {
      id: uuidv4(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    const contactsString = JSON.stringify(contacts);
    await fs.writeFile(contactsPath, contactsString);
    console.table(contacts);
    return contacts;
  } catch (error) {
    throw console.error(error.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
