import express from "express";
import authRouter from "./routes/auth.js";

const app = express(); //using express
app.use(express.json());

//define a port number and giving us console log messages
const port = 3000;

//using routs
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
