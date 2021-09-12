const express = require("express");
const router = express.Router();
const guard = require("../../../helpers/guard");

const {
  validationCreateContacts,
  validationUpdateContacts,
  validationUpdateStatusContact,
  validateMongoId,
} = require("./validation");
const controllers = require("../../../controllers/contacts");
router
  .get("/", guard, controllers.getAll)
  .post("/", guard, validationCreateContacts, controllers.createContact);
router
  .get("/:contactId", guard, validateMongoId, controllers.getById)
  .delete("/:contactId", guard, validateMongoId, controllers.deleteContact)
  .put(
    "/:contactId",
    guard,
    validationUpdateContacts,
    validateMongoId,
    controllers.updateContact
  );
router.patch(
  "/:contactId/favorite",
  guard,
  validationUpdateStatusContact,
  controllers.updateStatusContact
);
module.exports = router;
