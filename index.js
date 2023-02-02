const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 3000;
const {
  MONGO_IP,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_USER,
} = require("./config/config");
const postRouter = require("./routes/postRouter");
const userRouter = require("./routes/userRoute");
const url = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("Successfully connected to the database");
    })
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
app.enable("trust proxy");
app.use(cors({}));
app.use(express.json());
app.get("/api/v1", (req, res) => {
  res.send("Hi there??");
  console.log("Load balance up");
});
app.use("/api/v1/users", userRouter);

app.use("/api/v1/posts", postRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));

//docker compose down -v
// docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d  --build -V when neccessary --scale node-app=2 // this is to add two node instance
// docker logs name-of-folder-name-of-container-1
// docker exec -it name-of-folder-name-of-container-1 sh or bash
// docker network ls
// to see logs of the node-app docker logs  docker-node-mongo-node-app-1 -f
