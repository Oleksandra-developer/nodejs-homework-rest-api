const express = require("express");
const router = express.Router();

const {
  validationCreateContacts,
  validationUpdateContacts,
  validationUpdateStatusContact,
  validateMongoId,
} = require("./validation");
const controllers = require("../../controllers/contacts");
router
  .get("/", controllers.getAll)
  .post("/", validationCreateContacts, controllers.createContact);
router
  .get("/:contactId", validateMongoId, controllers.getById)
  .delete("/:contactId", validateMongoId, controllers.deleteContact)
  .put(
    "/:contactId",
    validationUpdateContacts,
    validateMongoId,
    controllers.updateContact
  );
router.patch(
  "/:contactId/favorite",
  validationUpdateStatusContact,
  controllers.updateStatusContact
);
module.exports = router;
