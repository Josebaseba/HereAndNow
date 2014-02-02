class SocketCtrl extends Monocle.Controller

  events: [
    "error", "joined", "message",
    "disconnection", "connection"
  ]

  initialize: ->
    @socket = io.connect "http://localhost:1337/socket"
    for event in @events
      @socket.on event, @["on#{event.charAt(0).toUpperCase() + event.slice(1)}"]
    do @join

  join: ->
    if __Controller.Url.ROOM_NAME?
      @socket.emit "join", __Controller.Url.ROOM_NAME, "Joseba"

  #EVENTS
  onMessage: (message) =>
    console.log message, "MESSAGE"

  onError: (error) =>
    console.error error, "ERROR"

  onJoined: (messages, users) =>
    console.log messages, users, "JOINED"

  onDisconnection: (user) =>
    console.log user, "DISCONNECTED"

  onConnection: (user) =>
    console.log user, "CONNECTED"

$ ->
  __Controller.Socket = new SocketCtrl "body"