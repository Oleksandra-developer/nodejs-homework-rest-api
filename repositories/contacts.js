const Contact = require("../model/contact");

const listContacts = async (userId) => {
  const allContacts = await Contact.find({ owner: userId }).populate({
    path: "owner",
    select: " email, subscription",
  });
  return allContacts;
};

const getContactById = async (userId, contactId) => {
  const contact = await Contact.findOne({ _id: contactId, owner: userId });
  return contact;
};

const removeContact = async (userId, contactId) => {
  const deletedContact = await Contact.findOneAndRemove({
    _id: contactId,
    owner: userId,
  });
  return deletedContact;
};

const addContact = async (userId, contact) => {
  try {
    const newContact = await Contact.create({ owner: userId, ...contact });
    return newContact;
  } catch (err) {
    console.log(err);
  }
};

const updateContact = async (userId, contactId, body) => {
  const updateContact = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
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
