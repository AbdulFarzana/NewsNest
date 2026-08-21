const express = require("express");

const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementImage
} = require("../controller/announcementController");

const protect = require("../middleware/authmiddleware");
const upload = require("../middleware/announcementUpload");

const router = express.Router();

router.get(
  "/",
  protect,
  getAnnouncements
);

router.post(
  "/",
  protect,
  upload.single("image"),
  createAnnouncement
);

router.get(
  "/:id/image",
  getAnnouncementImage
);

router.delete(
  "/:id",
  protect,
  deleteAnnouncement
);

module.exports = router;