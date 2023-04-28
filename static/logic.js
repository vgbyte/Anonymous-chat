const socket = io()
const clickHere = document.getElementById("clickHere")

socket.on("unique-room", (uniqueRoomName) => {
  clickHere.href = `/${uniqueRoomName}`
})
