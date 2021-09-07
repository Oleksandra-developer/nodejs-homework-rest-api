const Contact = require("../model/contact");

const listContacts = async () => {
  const allContacts = await Contact.find();
  return allContacts;
};

const getContactById = async (contactId) => {
  const contact = await Contact.findOne({ _id: contactId });
  return contact;
};

const removeContact = async (contactId) => {
  const deletedContact = await Contact.findOneAndRemove({ _id: contactId });
  return deletedContact;
};

const addContact = async (contact) => {
  const newContact = await Contact.create(contact);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const updateContact = await Contact.findOneAndUpdate(
    { _id: contactId },
    { ...body },
    { new: true }
  );
  return updateContact;
};

const updateStatusContact = async (contactId, body) => {
  const updateContact = await Contact.findOneAndUpdate(
    { _id: contactId },
    { ...body },
    { new: true }
  );
  return updateContact;
};
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
