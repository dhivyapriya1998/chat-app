const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { accessChat, fetchChats, createGroupChat, renameGroup,addUserToGroup,removeUserFromGroup } = require('../controller/chatControllers');

const router = express.Router();

router.route("/").post(protect, accessChat).get(protect, fetchChats)
router.route("/group").post(protect, createGroupChat)
router.route("/rename").put(protect, renameGroup)
router.route("/addToGroup").put(protect, addUserToGroup)
router.route("/removeFromGroup").put(protect, removeUserFromGroup)


module.exports = router;