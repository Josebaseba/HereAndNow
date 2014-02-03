class SocketCtrl extends Monocle.Controller

  USERNAME = "JOSEBA"

  socket_events: [
    "error", "joined", "message",
    "disconnection", "connection"
  ]

  initialize: ->
    @socket = io.connect HAN.SOCKET_URL
    for event in @socket_events
      @socket.on event, @["on#{event.charAt(0).toUpperCase() + event.slice(1)}"]
    do @join

  join: ->
    if __Controller.Url.ROOM_NAME?
      @socket.emit "join", __Controller.Url.ROOM_NAME, "Joseba"

  send: (message) ->
    @socket.emit "message", message, USERNAME

  #EVENTS
  onMessage: (message, user) =>
    console.log message, ":: #{user}'s MESSAGE"

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