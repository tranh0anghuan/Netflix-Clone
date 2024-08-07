import express from "express";

import authRoutes from "./routes/auth.route.js";

const app = express();

// app.get("/", (req, res) => {
//   res.send("Server is ready 123");
// });

app.use("/api/v1/auth",authRoutes)

app.listen(5000, () => {
  console.log("Server started at http://localhost:5000");
});
