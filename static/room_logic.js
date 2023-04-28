const socket = io()
const form = document.getElementById("form")
const input = document.getElementById("input")
const message = document.getElementById("messages")

let userName = ""
while (!userName) {
  userName = prompt("Enter your display name")
}

const displayMessageBold = msg => {
  var item = document.createElement("li")
  item.textContent = msg
  item.style.textAlign = "center"
  item.style.fontWeight = "bold"
  item.style.background = "aqua"
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight)
}

const displayMessage = (msg, bot) => {
  var item = document.createElement("li")
  item.innerHTML = msg
  if (!bot) {
    item.style.textAlign = "end"
  }
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight)
}

const userJoiningAndLeavingMsg = msg => {
  let item = document.createElement("li")
  item.innerHTML = msg
  item.style.textAlign = "center"
  item.style.fontStyle = "italic"
  item.style.background = "white"
  item.style.color = "blue"
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight)
}

const websiteUrl = window.location.href.split("/")
const roomName = websiteUrl[websiteUrl.length - 1]
socket.emit("join-room", roomName)
socket.emit("new-user", userName, roomName)
const msg = `You joined the room`
displayMessageBold(msg)

form.addEventListener("submit", function (e) {
  e.preventDefault()
  if (input.value) {
    socket.emit("userUserMsg", input.value, roomName, socket.id)
    input.value = ""
  }
})

socket.on("UserMessage", function (msg, senderId, senderName) {
  // console.log("in BotUserMessage")
  // let bot = senderId == socket.id ? false : true
  // displayMessage(msg, bot)
  // console.log("left BotUserMessage")
  if (senderId) {
    if (senderId == socket.id) {
      displayMessage(msg, false)
    } else {
      msg = `<b>${senderName}</b>` + " : " + msg
      displayMessage(msg, true)
    }
  }
  // console.log(`message send with id ${socket.id}`)
})

socket.on("user-connected", (name, senderId) => {
  const msg = `<b>${name}</b> joined the room`
  if (socket.id != senderId) {
    userJoiningAndLeavingMsg(msg)
  }
})

socket.on("user-disconnected", (name, senderId) => {
  const msg = `<b>${name}</b> left the room`
  if (socket.id != senderId) {
    userJoiningAndLeavingMsg(msg)
  }
})
