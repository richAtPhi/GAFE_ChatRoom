class CMD {
  static C_JOIN_CHAT = 1;
  static S_JOIN_CHAT = 2;
  static C_SEND_MESSAGE = 100;
  static S_SEND_MESSAGE = 100;
  static C_GIVE_GIFT = 200;
  static S_GIVE_GIFT = 201;
}

const ws = new BGWebsocket();
ws.onWSBinary[CMD.S_GIVE_GIFT] = function (message) {
  switch (message.readByte()) {
    case 1: //Success
      const balance = message.readString();
      document.getElementById("userBalance").innerHTML =
        "Balance: " + balance + ".00";
      console.log("Success", "Balance: " + balance + ".00");
      break;
    case -1: //Not enought money
      console.log("Not enought money", message.readString());
      break;
    case -2: //Token error
      console.log("Token error", message.readString());
      break;

    default:
      console.log("default", message.readString());
      break;
  }
  //When server send S_GIVE_GIFT, this method will be working. process logic here
};
ws.onWSBinary[CMD.S_JOIN_CHAT] = function (message) {
  if (message.readByte() == 1) {
    // console.log("Join chat thành công : " + message.readString());
    const loginData = JSON.parse(message.readString());
    console.log(loginData);
    // document.getElementById("userName").innerHTML =
    //   "username: " + loginData.name;
    document.getElementById("userBalance").innerHTML =
      "Balance: " + loginData.balance;
    console.log("Join chat thành công : ", loginData.name);
    let numberLog = message.readInt();
    const chatList = document.getElementById("chatList");

    chatList.innerHTML = "";
    for (let i = 0; i < numberLog; i++) {
      if (message.readString().length > 0) {
        const messageElement = createChatMessageElement(message.readString());
        chatList.appendChild(messageElement);
      }
    }
  } else {
    console.log("Join chat thất bại");
  }
};
ws.onWSBinary[CMD.S_SEND_MESSAGE] = function (message) {
  let numberLog = message.readString();
  const chatList = document.getElementById("chatList");

  const messageElement = createChatMessageElement(numberLog);
  chatList.appendChild(messageElement);
};

window.addEventListener("load", function () {
  ws.start("chatroom.vnstream6789.com", 443);
});

function createChatMessageElement(message) {
  const element = document.createElement("div");
  const chatMessage = message.split(":");
  element.className = "messageItem";
  element.innerHTML = `
  <span class="chatSenderName">${chatMessage[0]}</span> : <span class="chatSenderMessage">${chatMessage[1]}</span>
  `;
  return element;
}
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("sendButton").addEventListener("click", sendMessage);

  document
    .getElementById("messageInput")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        sendMessage();
      }
    });

  function sendMessage() {
    const message = document.getElementById("messageInput").value;
    var mgSend = new MessageSending(CMD.C_SEND_MESSAGE);
    mgSend.writeString(message);
    ws.send(mgSend);
    document.getElementById("messageInput").value = "";
  }
});
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("setName").addEventListener("click", function () {
    const message = document.getElementById("nameInput").value;
    var mgSend = new MessageSending(CMD.C_JOIN_CHAT);
    mgSend.writeString(message);
    ws.send(mgSend);
    document.getElementById("nameInput").value = "";
  });
});

const sendGift = (amount) => {
  var mgSend = new MessageSending(CMD.C_GIVE_GIFT);
  mgSend.writeInt(1);
  ws.send(mgSend);
};
