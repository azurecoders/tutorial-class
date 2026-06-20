import express from "express";
import { signUpUser } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUpUser);
router.get("/", authMiddleware, (req, res) => {
  res.send("Test Route");
});

export default router;
