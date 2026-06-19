import express from "express";
import { signUpUser } from "../controllers/index.js";

const router = express.Router();

router.post("/signup", signUpUser);
// router.post("/login");

export default router;
