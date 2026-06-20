import express from "express";
import "dotenv/config";
import router from "./routes/index.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK");
});

// http://localhost:5000/signup -> current version
// http://localhost:5000/auth/signup -> current version

app.use("/auth", router);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
