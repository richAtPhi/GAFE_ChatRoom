class MessageSending {
  constructor(CMD) {
    this.cmd = CMD;
    this.data = [];
    this.currentWriting = 0;
    this.writeShort(CMD);
  }
  writeBoolean(booleanValue) {
    if (booleanValue) this.data[this.currentWriting++] = 1;
    else this.data[this.currentWriting++] = 0;
  }
  writeByte(byteValue) {
    this.data[this.currentWriting++] = byteValue & 0xff;
  }
  writeShort(shortValue) {
    this.data[this.currentWriting++] = (shortValue >>> 8) & 0xff;
    this.data[this.currentWriting++] = shortValue & 0xff;
  }
  writeInt(intValue) {
    this.data[this.currentWriting++] = (intValue >>> 24) & 0xff;
    this.data[this.currentWriting++] = (intValue >>> 16) & 0xff;
    this.data[this.currentWriting++] = (intValue >>> 8) & 0xff;
    this.data[this.currentWriting++] = intValue & 0xff;
  }
  writeFloat(floatValue) {
    let _dataView = new DataView(new ArrayBuffer(4));
    _dataView.setFloat32(0, floatValue);
    this.data[this.currentWriting++] = _dataView.getUint8(0);
    this.data[this.currentWriting++] = _dataView.getUint8(1);
    this.data[this.currentWriting++] = _dataView.getUint8(2);
    this.data[this.currentWriting++] = _dataView.getUint8(3);
  }
  writeLong(longValue) {
    this.data[this.currentWriting++] = (longValue >>> 56) & 0xff;
    this.data[this.currentWriting++] = (longValue >>> 48) & 0xff;
    this.data[this.currentWriting++] = (longValue >>> 40) & 0xff;
    this.data[this.currentWriting++] = (longValue >>> 32) & 0xff;
    this.data[this.currentWriting++] = (longValue >>> 24) & 0xff;
    this.data[this.currentWriting++] = (longValue >>> 16) & 0xff;
    this.data[this.currentWriting++] = (longValue >>> 8) & 0xff;
    this.data[this.currentWriting++] = longValue & 0xff;
  }
  writeDouble(doubleValue) {
    let _dataView = new DataView(new ArrayBuffer(8));
    _dataView.setFloat64(0, doubleValue);
    this.data[this.currentWriting++] = _dataView.getUint8(0);
    this.data[this.currentWriting++] = _dataView.getUint8(1);
    this.data[this.currentWriting++] = _dataView.getUint8(2);
    this.data[this.currentWriting++] = _dataView.getUint8(3);
    this.data[this.currentWriting++] = _dataView.getUint8(4);
    this.data[this.currentWriting++] = _dataView.getUint8(5);
    this.data[this.currentWriting++] = _dataView.getUint8(6);
    this.data[this.currentWriting++] = _dataView.getUint8(7);
  }
  writeString(strValue) {
    let _dataString = new TextEncoder().encode(strValue);
    this.writeShort(_dataString.length);
    for (let i = 0; i < _dataString.length; i++)
      this.data[this.currentWriting++] = _dataString[i] & 0xff;
  }
}
class MessageReceiving {
  constructor(dataReceiving) {
    this.arrBuffer = dataReceiving;
    this.currentreading = 2;
    this.bufferDataview = new DataView(dataReceiving);
    this.cmd = this.bufferDataview.getInt16(0);
  }
  readBoolean() {
    if (this.currentreading + 1 > this.bufferDataview.byteLength) return -1;
    else return this.bufferDataview.getInt8(this.currentreading++) != 0;
  }
  readByte() {
    if (this.currentreading + 1 > this.bufferDataview.byteLength) return -1;
    else return this.bufferDataview.getInt8(this.currentreading++);
  }
  readShort() {
    if (this.currentreading + 2 > this.bufferDataview.byteLength) return -1;
    let shortResult = this.bufferDataview.getInt16(this.currentreading);
    this.currentreading += 2;
    return shortResult;
  }
  readInt() {
    if (this.currentreading + 4 > this.bufferDataview.byteLength) return -1;
    let intResult = this.bufferDataview.getInt32(this.currentreading);
    this.currentreading += 4;
    return intResult;
  }
  readLong() {
    if (this.currentreading + 8 > this.bufferDataview.byteLength) return -1;
    let l0 = this.bufferDataview.getInt8(this.currentreading++) & 0xff;
    let l1 = this.bufferDataview.getInt8(this.currentreading++) & 0xff;
    let l2 = this.bufferDataview.getInt8(this.currentreading++) & 0xff;
    let l3 = this.bufferDataview.getInt8(this.currentreading++) & 0xff;
    let l4 = this.bufferDataview.getInt8(this.currentreading++) & 0xff;
    let l5 = this.bufferDataview.getInt8(this.currentreading++) & 0xff;
    let l6 = this.bufferDataview.getInt8(this.currentreading++) & 0xff;
    let l7 = this.bufferDataview.getInt8(this.currentreading++) & 0xff;
    return (
      (l0 << 56) +
      (l1 << 48) +
      (l2 << 40) +
      (l3 << 32) +
      (l4 << 24) +
      (l5 << 16) +
      (l6 << 8) +
      l7
    );
  }
  readString() {
    if (this.currentreading + 2 > this.bufferDataview.byteLength) return "";
    let strLength = this.bufferDataview.getUint16(this.currentreading);
    this.currentreading += 2;
    if (this.currentreading + strLength > this.bufferDataview.byteLength)
      return "";
    let _buffStr = new DataView(this.arrBuffer, this.currentreading, strLength);
    this.currentreading += strLength;
    return new TextDecoder("utf-8").decode(_buffStr);
  }
  readFloat() {
    if (this.currentreading + 4 > this.bufferDataview.byteLength) return -1;
    let _floatValue = this.bufferDataview.getFloat32(this.currentreading);
    this.currentreading += 4;
    return _floatValue;
  }
  readDouble() {
    if (this.currentreading + 8 > this.bufferDataview.byteLength) return -1;
    let _doubleValue = this.bufferDataview.getFloat64(this.currentreading);
    this.currentreading += 8;
    return _doubleValue;
  }
}
class BGWebsocket {
  #websocket;
  #threadPing;
  constructor() {
    this.isPause = false;
    this.#threadPing = null;
    this.onWSBinary = [];
    console.log(
      "Init BGWebsocket with method : onConnectSuccess, onServerFull, onDisconnect"
    );
  }
  start(_ip, _port) {
    this.#websocket = new WebSocket(
      "wss://" + _ip + ":" + _port + "/websocket"
    );
    this.#websocket.binaryType = "arraybuffer";

    let currentBGWS = this;
    currentBGWS.sessionId = -1;
    currentBGWS.validateData = null;
    this.#websocket.onopen = function (e) {};
    this.#websocket.onclose = () => {
      if (currentBGWS.onDisconnect) currentBGWS.onDisconnect();
      if (this.#threadPing != null) clearInterval(this.#threadPing);
    };

    this.#websocket.onmessage = function (event) {
      currentBGWS.lastTimeWebsocket = Date.now();
      let _data = event.data;
      if (_data instanceof ArrayBuffer) {
        // binary frame
        if (currentBGWS.validateData == null) {
          let _tmp = new Int8Array(_data);
          currentBGWS.validateCode = _tmp[5];
          currentBGWS.validateData = [
            _tmp[0] ^ _tmp[5],
            _tmp[1] ^ _tmp[5],
            _tmp[2] ^ _tmp[5],
            _tmp[3] ^ _tmp[5],
            _tmp[4] ^ _tmp[5],
            _tmp[6] ^ _tmp[5],
            _tmp[7] ^ _tmp[5],
          ];
          currentBGWS.#websocket.send(
            new Int8Array(currentBGWS.validateData, 7)
          );
        } else {
          let messageReceiving = new MessageReceiving(_data);
          if (currentBGWS.sessionId == -1) {
            if (messageReceiving.cmd == -1) {
              if (currentBGWS.onServerFull) currentBGWS.onServerFull();
              currentBGWS.release();
            } else {
              currentBGWS.sessionId = messageReceiving.readShort();
              console.log(
                "Connect Success with sessionId = " + currentBGWS.sessionId
              );
              if (currentBGWS.onConnectSuccess) currentBGWS.onConnectSuccess();
              currentBGWS.#threadPing = setInterval(function () {
                currentBGWS.#websocket.send(new Int8Array([127, 255]));
              }, 1000);
            }
          } else if (messageReceiving.cmd == 32767) {
            //console.log("Ping-Pong");
          } else if (messageReceiving.cmd == -32768) {
            if (messageReceiving.readByte() == 127) {
              console.log(
                "Websocket disconnect by : too long time to send message"
              );
            }
            currentBGWS.release();
          } else {
            if (currentBGWS.onWSBinary[messageReceiving.cmd]) {
              console.log(
                "Websocket receive CMD(" +
                  messageReceiving.cmd +
                  ") : " +
                  messageReceiving.bufferDataview.byteLength +
                  " bytes"
              );
              currentBGWS.onWSBinary[messageReceiving.cmd](messageReceiving);
            } else
              console.log(
                "CMD(" +
                  messageReceiving.cmd +
                  ") is not Process. Please setup BGWebsocket.onWSBinary[" +
                  messageReceiving.cmd +
                  "]= (messageReceiving)=>{};"
              );
          }
        }
      } else {
        // text frame
      }
    };
    this.#websocket.onerror = function (error) {
      console.log(
        "=====> this.#websocket.onerror = function(error) : " +
          JSON.stringify(error)
      );
    };
  }
  isRunning() {
    return (
      this.#websocket &&
      (this.#websocket.readyState == WebSocket.OPEN ||
        this.#websocket.readyState == WebSocket.CONNECTING)
    );
  } /*CONNECTING(0) - OPEN(1) - CLOSING(2) - CLOSED(3)*/
  send(message) {
    console.log(
      "Websocket send CMD(" +
        message.cmd +
        ") : " +
        (message.currentWriting - 2) +
        " byte"
    );
    this.#websocket.send(new Int8Array(message.data, message.currentWriting));
  }
  release() {
    this.#websocket.close();
    if (this.#threadPing != null) clearInterval(this.#threadPing);
  }
}
