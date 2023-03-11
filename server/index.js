const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on("send_message", (data) => {
    console.log(data);
    io.emit("recieve_message", data)
  })
})

server.listen(8080, () => {
  console.log("SERVER IS RUNNING")
})
