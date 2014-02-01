class SocketCtrl extends Monocle.Controller

  constructor: ->
    super
    @socket = io.connect "http://localhost:1337/socket"

    @socket.on "error", (error) -> console.error error
    @socket.on "joined", (messages, users) =>
      console.log messages, users
      @socket.emit "message", "HELLO WORLD!!! #{new Date()}", "Joseba"
    @socket.on "message", (message) -> console.log message, "MESSAGE"
    @socket.on "disconnection", (user) -> console.log user, "DISCONNECTED"
    @socket.on "connection", (user) -> console.log user, "CONNECTED"

    @socket.emit "join", "Joseba-Group", "JOSEBA"

$ ->
  __Controller.Socket = new SocketCtrl "body"