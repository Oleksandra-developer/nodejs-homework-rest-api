const model = require("../repositories/contacts");

const getAll = async (req, res, next) => {
  try {
    const userId = req.body.id;
    const contacts = await model.listContacts(userId);
    res.json({
      status: "success",
      code: 200,
      data: {
        result: contacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.body.id;
    const contact = await model.getContactById(userId, req.params.contactId);
    if (contact) {
      return res.status(200).json({
        status: "success",
        code: 200,
        data: { contact },
      });
    } else {
      return res
        .status(404)
        .json({ status: "error", code: 404, data: "Not found contact" });
    }
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const userId = req.body.id;
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.json({
        status: "error",
        code: 404,
        data: {
          message: "missing required name field",
        },
      });
    } else {
      const contact = await model.addContact(userId, req.body);
      return res.status(201).json({
        status: "success",
        code: 201,
        data: {
          contact,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const userId = req.body.id;
    const deletedContact = await model.removeContact(
      userId,
      req.params.contactId
    );
    if (deletedContact) {
      return res.status(200).json(deletedContact);
    }
    return res.status(404).json({
      message: "Not Found",
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const userId = req.body.id;
    const id = req.params.contactId;
    const body = req.body;
    if (body) {
      const updatedContact = await model.updateContact(userId, id, body);
      if (!updatedContact) {
        return res.status(404).json({
          status: "error",
          code: 404,
          data: {
            message: "Not found",
          },
        });
      }
      return res.status(200).json(updatedContact);
    }
    return res.status(400).json({
      status: "error",
      code: 400,
      data: { message: "missing fields" },
    });
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const body = req.body;
    if (body) {
      const patchedContact = await model.updateStatusContact(id, body);
      if (!patchedContact) {
        return res.status(404).json({
          status: "error",
          code: 404,
          data: {
            message: "Not found",
          },
        });
      }
      return res.status(200).json(patchedContact);
    }
    return res.status(400).json({
      status: "error",
      code: 400,
      data: { message: "missing field favorite" },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAll,
  getById,
  createContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};
