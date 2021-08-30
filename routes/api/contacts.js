const express = require("express");
const router = express.Router();
const model = require("../../model");
const {
  validationCreateContacts,
  validationUpdateContacts,
} = require("./validation");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await model.listContacts();
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
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await model.getContactById(parseInt(req.params.contactId));
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
});

router.post("/", validationCreateContacts, async (req, res, next) => {
  try {
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
      const contact = await model.addContact(req.body);
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
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    // const id = Number(req.params.contactId);
    const deletedContact = await model.removeContact(
      parseInt(req.params.contactId)
    );
    if (deletedContact) {
      res.json(deletedContact);
    }
    res.status(404).json({
      message: "Not Found",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", validationUpdateContacts, async (req, res, next) => {
  try {
    const id = parseInt(req.params.contactId);
    const body = req.body;
    if (body) {
      const updatedContact = await model.updateContact((id, body));
      if (!updatedContact) {
        res.status(404).json({
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
      data: {
        message: "missing fields",
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;