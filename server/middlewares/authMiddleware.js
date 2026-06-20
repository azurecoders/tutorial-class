import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth Header", authHeader);

  if (!authHeader) {
    throw new AppError("Authorization Header Not Found", 400);
  }

  const token = authHeader.split(" ")[1];
  console.log(authHeader.split(" "));

  if (!token) {
    throw new AppError("UnAuthorized! Token Not Found", 400);
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decode);
  next();
};
