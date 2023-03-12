const express = require('express')
const http = require('http')
const Server = require("socket.io").Server
const app = express()
const path = require('path')

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*"
  }
})


const _dirname = path.dirname("")
const buildPath = path.join(_dirname, "../client/build");

app.use(express.static(buildPath))

app.get("/*", function(req, res) {

  res.sendFile(
    path.join(__dirname, "../client/build/index.html"),
    function(err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );

})

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
