const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB =
  require("./config/db");

const authRoutes =
  require("./routes/auth");

const postRoutes =
  require("./routes/posts");

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