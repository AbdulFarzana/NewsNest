const express = require("express");

const {
  getEvents,
  createEvent,
  registerForEvent,
  deleteEvent
} = require(
  "../controller/eventController"
);

const protect =
  require(
    "../middleware/authmiddleware"
  );

const router =
  express.Router();


router.get(
  "/",
  protect,
  getEvents
);


router.post(
  "/",
  protect,
  createEvent
);


router.post(
  "/:id/register",
  protect,
  registerForEvent
);


router.delete(
  "/:id",
  protect,
  deleteEvent
);


module.exports = router;