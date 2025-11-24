import express from "express";
import cors from "cors";
import linkRoutes from "./routes/linkRoutes.js";

const app = express();

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.get("/healthz", (req, res) => {
  res.status(200).json({
    ok: true,
    version: "1.0",
  });
});

// Routes
app.use("/", linkRoutes);

export default app;
