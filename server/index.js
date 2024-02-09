const Table = require('./table.js');

const express = require('express')
const http = require('http')
const Server = require("socket.io").Server
const app = express()
const path = require('path')
const PORT = 8080;

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

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

//Testing
const startPosition = "0101010110101010010101010000000000000000303030300303030330303030";

// const startPosition = "0101000010101010010001000030003000010303000000000300030030000030";

// Make some tables
const tableOne = new Table("table_one", 1);
const tableTwo = new Table("table_two", 2);
const tableThree = new Table("table_three", 3);
const tableFour = new Table("table_four", 4);


class User {
  constructor() {
    this.name = Math.floor(Math.random() * 1000);
    this.tableID = null;
    this.table = null;
    this.playerColor = null;
  }
}
let users = [];

// This is for when all we know is the table name and we want the class instance 
const tableMap = {
  "table_one": tableOne,
  "table_two": tableTwo,
  "table_three": tableThree,
  "table_four": tableFour,
}

function joinTable(socket, user, table, id) {
  if (tableMap[table].players?.includes(user.name)) return;
  // Seat the user at the table
  let otherPlayer = users.find((user) => user.table == table)?.playerColor;
  if (otherPlayer && users.find((user) => user.table == table).playerColor == "white") {
    user.playerColor = "red";
  } else {
    user.playerColor = "white";
  }

  socket.join(table);
  resetTable(tableMap[table], socket);
  sendTableStatus();
  user.tableID = id;
  user.table = table;
  tableMap[table].players.push(user.name);
  socket.emit("recieve_player_color", user.playerColor)
  socket.emit("recieve_table_color", "white");
  io.to(table).emit("recieve_foe_user", tableMap[user.table].players)
  logRooms();
}
function resetTable(table, socket) {
  table.fen = startPosition;
  table.turnColor = "white";
  // console.log("table.fen", table.fen)
  io.to(table.name).emit("recieve_fen", startPosition);
  io.to(table.name).emit("recieve_table_color", "white");

}

function leaveTable(socket, user) {
  if (user.table == null) return;
  io.to(user.table).emit('chat_recieve_message', {
    text: ` left the table`,
    username: `${user.name}`,
    id: `${socket.id}${Math.random()}`,
    sockedID: socket.id,
    joinMessage: false,
    leaveMessage: true,
  })

  socket.leave(user.table);
  // Set the the tables players list to a new arrray without the player in it
  tableMap[user.table].players = tableMap[user.table].players.filter((player) => player != user.name);
  io.to(user.table).emit("recieve_foe_user", tableMap[user.table].players)
  user.table = null;
  user.tableID = null;
  user.playerColor = null;
  logRooms();

}

async function logRooms() {
  // These are socket rooms, fetchSockets returns an array of sockets in the room
  let one = await io.in(`table_one`).fetchSockets()
  let two = await io.in(`table_two`).fetchSockets()
  let three = await io.in(`table_three`).fetchSockets()
  let four = await io.in(`table_four`).fetchSockets()
  console.log("ROOM ONE:")
  one.forEach((user) => console.log(user.id))
  console.log("ROOM TWO:")
  two.forEach((user) => console.log(user.id))
  console.log("ROOM THREE:")
  three.forEach((user) => console.log(user.id))
  console.log("ROOM FOUR:")
  four.forEach((user) => console.log(user.id))
}


function sendTableStatus() {
  io.emit("recieve_table_status", {
    table_one: tableOne.players.length,
    table_two: tableTwo.players.length,
    table_three: tableThree.players.length,
    table_four: tableFour.players.length,
  });
}
setInterval(sendTableStatus, 100);

function changeTableColor(table) {
  if (table.turnColor == "white") {
    table.turnColor = "red";
  } else {
    table.turnColor = "white";
  }

}

io.on('connection', (socket) => {
  socket.emit("recieve_new_connection");
  let user = new User();
  users.push(user);
  console.log(`⚡: ${socket.id} user just connected!`);
  console.log(users.map((item) => item.name));
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    users = users.filter((item) => user.name != item.name)
    leaveTable(socket, user)
    console.log(users);
  });
  socket.on("user_login", (data) => {
    console.log("User just logged in", data)
    user.name = data;
  })
  socket.on('request_username', () => {
    socket.emit('recieve_username', user.name)
  })
  socket.on("request_leave_table", () => {
    if (user.table) {
      leaveTable(socket, user);
    }
  })

  socket.on("request_reset_table", () => {
    resetTable(tableMap[user.table], socket);
    io.to(user.table).emit('chat_recieve_message', {
      text: ` reset the table.`,
      username: `${user.name}`,
      id: `${socket.id}${Math.random()}`,
      sockedID: socket.id,
      joinMessage: false,
      leaveMessage: true,
    })
    console.log("recieved")
  })

  // socket.emit("recieve_foe_user", tableMap[user.table].players)

  // This is basically a change of turn
  socket.on("request_fen", (data) => {
    let table = tableMap[user.table];
    console.log(user)
    console.log(table)
    table.fen = data;
    io.to(user.table).emit("recieve_fen", table.fen);
  })
  socket.on("request_change_turn", () => {
    let table = tableMap[user.table];
    changeTableColor(table);
    io.to(user.table).emit("recieve_table_color", table.turnColor);
  })

  // Here we flip the board so the current player is always at the bottom
  socket.on('request_flip', () => {
    // Check to see if the player is number 2
    if (user.playerColor == "red") {
      socket.emit('recieve_flip')
    }
  });


  // Recieve A Message from client
  socket.on('chat_send_message', (data) => {
    io.to(user.table).emit("chat_recieve_message", data);
  })

  socket.on('join_table', (table, id) => {
    joinTable(socket, user, table, id);
    // socket.emit("recieve_player_color", user.playerColor)
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
