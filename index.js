const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const PORT = process.env.PORT || 3000
const users = {}

app.use(express.static(__dirname + "/static"))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.get("/:roomName", (req, res) => {
  roomName = req.params.roomName
  res.sendFile(__dirname + "/room.html")
})

io.on("connection", (socket) => {
  const userRoom = socket.id
  let uniqueId = socket.id.split("_").join("-")
  let randomRoomName = "anonymous-chat-" + uniqueId + Date.now()
  io.to(userRoom).emit("unique-room", randomRoomName)
  socket.on("disconnecting", () => {
    const Rooms = socket.rooms
    Rooms.forEach((room) => {
      if (room != socket.id) {
        io.to(room).emit("user-disconnected", users[socket.id], socket.id)
      }
    })
    delete users[socket.id]
  })
  socket.on("disconnect", () => { })
  socket.on("userUserMsg", (msg, roomName, senderId) => {
    io.to(roomName).emit("UserMessage", msg, senderId, users[senderId])
  })
  socket.on("join-room", (room) => {
    socket.join(room)
  })
  socket.on("leave-room", (name, room) => {
    socket.leave(room)
    io.to(room).emit("user-disconnected", name, socket.id)
  })
  socket.on("new-user", (name, room) => {
    users[socket.id] = name
    io.to(room).emit("user-connected", name, socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`)
})
