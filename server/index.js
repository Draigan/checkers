const express = require('express');
const app = express();
const PORT = 4001;

const http = require('http').Server(app);
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: "*"
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });

  socket.on('test', () => {
    console.log("EMIT TEST FROM SERVER");
    io.to("room_one").emit("recieve_message");
  })

  // Recieve A Message from client
  socket.on('chat_send_message', (data) => {
    io.emit("chat_recieve_message", data);
  })

  socket.on('table_one', () => {
    console.log(socket.id, "Joined Table One");
    socket.join("room_one");
  })
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


// const express = require('express')
// const http = require('http')
// const Server = require("socket.io").Server
// const app = express()
// const path = require('path')
// const port = 8080;

// const server = http.createServer(app)
// const io = new Server(server, {
//   cors: {
//     origin: "*"
//   }
// })

// const _dirname = path.dirname("")
// const buildPath = path.join(_dirname, "../client/build");

// app.use(express.static(buildPath))

// app.get("/*", function(req, res) {

//   res.sendFile(
//     path.join(__dirname, "../client/build/index.html"),
//     function(err) {
//       if (err) {
//         res.status(500).send(err);
//       }
//     }
//   );

// })

// io.on("connection", (socket) => {
//   console.log("user connected", socket.id);
//   socket.on("test", () => {
//     console.log("Joined Table One");
//     // io.emit("recieve_message", data)
//   })
// })

// server.listen(port, () => {
//   console.log("SERVER IS LISTENING ON PORT", port)
// });
