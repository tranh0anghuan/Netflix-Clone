import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";
import listRoutes from "./routes/list.route.js";

import { ENV_VARS } from "./config/envVar.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";
import path from "path";

const app = express();

const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();

app.use(express.json()); //will allow us to parse req.body
app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.send("Server is ready 123");
// });

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);
app.use("/api/v1/list", protectRoute, listRoutes);

if (ENV_VARS.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "frontend/netflix-frontend/dist"))
  );
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(
        __dirname,
        "frontend",
        "netflix-frontend",
        "dist",
        "index.html"
      )
    );
  });
}

app.listen(PORT, () => {
  console.log("Server started at http://localhost:" + PORT);
  connectDB();
});
