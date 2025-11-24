import express from "express";
import { 
  createLink, 
  getLinks, 
  deleteLink, 
} from "../controllers/linkController.js";

const router = express.Router();

// API Routes
router.post("/api/links", createLink);
router.get("/api/links", getLinks);
router.delete("/api/links/:id", deleteLink);

export default router;