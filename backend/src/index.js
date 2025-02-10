import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import albumRoutes from "./routes/album.route.js";
import songRoutes from "./routes/song.route.js";
import statRoutes from "./routes/stat.route.js";
import { connectDB } from "./lib/db.js";

import { clerkMiddleware } from "@clerk/express";

dotenv.config();
const app = express();
app.use(express.json());
app.use(clerkMiddleware());

const PORT = process.env.PORT || 9000;

// Routes

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/stat", statRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
});

app.listen(PORT, () => {
  console.log("Server started on http://localhost:" + PORT);
  connectDB();
});
