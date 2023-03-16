const Table = require('./table.js');

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

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const tableOne = new Table("table_one", 1);
const tableTwo = new Table("table_two", 2);
const tableThree = new Table("table_three", 3);
const tableFour = new Table("table_four", 4);

const tableMap = {
  "table_one": tableOne,
  "table_two": tableTwo,
  "table_three": tableThree,
  "table_four": tableFour,
}
function joinTable(socket, user, table, id) {
  socket.join(table);
  user.tableID = id;
  user.table = table;
  tableMap[table].players.push(user.name);
  console.log(user.name, "Joined", table, "id:", id);
  console.log("Table One:", tableMap[table].players)
  console.log("user status:", user)
}

function leaveTable(socket, user) {
  socket.leave(tableMap[user.table]);
  // Set the the tables players list to a new arrray without the player in it
  tableMap[user.table].players = tableMap[user.table].players.filter((player) => player != user.name);

  console.log(user.name, "left table", user.table, "id:", user.tableID)
  console.log(user.table, tableMap[user.table].players)
  user.table = null;
  user.tableID = null;
  console.log("user status:", user)

}









io.on('connection', (socket) => {
  let user = {
    name: "anon",
    tableID: null,
    table: null,
  }
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });

  socket.on("user_login", (data) => {
    console.log("User just logged in", data)
    user.name = data;
  })
  socket.on('request_username', () => {
    socket.emit('response_username', user.name)
  })
  socket.on("leave_table", () => {
    if (user.table) {
      leaveTable(socket, user);
    }

  })


  socket.on('test', () => {
    console.log("EMIT TEST FROM SERVER");
    io.to("room_one").emit("recieve_message");
  })

  // Recieve A Message from client
  socket.on('chat_send_message', (data) => {
    io.to(user.table).emit("chat_recieve_message", data);
  })

  socket.on('join_table', (table, id) => {
    joinTable(socket, user, table, id);
  })
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
