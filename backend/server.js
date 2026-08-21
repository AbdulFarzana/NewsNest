const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB =
  require("./config/db");

const authRoutes =
  require("./routes/auth");

const postRoutes =
  require("./routes/posts");

const announcementRoutes =
  require("./routes/announcements");

const eventRoutes =
  require("./routes/events");

const clubRoutes =
  require("./routes/clubs");
const app = express();

connectDB();

app.use(
  cors({
    origin:
      process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(
  express.json()
);

app.use(
  cookieParser()
);

app.get("/", (req, res) => {
  res.json({
    message:
      "NewsNest backend is running"
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/posts",
  postRoutes
);

app.use(
  "/api/announcements",
  announcementRoutes
);

app.use(
  "/api/events",
  eventRoutes
);

app.use(
  "/api/clubs",
  clubRoutes
);
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);