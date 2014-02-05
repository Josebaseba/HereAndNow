class SocketCtrl extends Monocle.Controller

  USERNAME = null

  socket_events: [
    "error", "connectedToRoom", "message",
    "userDisconnection", "userConnection",
    "newUserJoined"
  ]

  initialize: ->
    @socket = io.connect HAN.SOCKET_URL
    for event in @socket_events
      @socket.on event, @["on#{event.charAt(0).toUpperCase() + event.slice(1)}"]
    do @connectToRoom

  connectToRoom: ->
    if __Controller.Url.ROOM_NAME
      @socket.emit "connectToRoom", __Controller.Url.ROOM_NAME

  setName: (username) ->
    USERNAME = username
    @socket.emit "setName", USERNAME

  send: (message) ->
    if USERNAME? then @socket.emit "message", message

  #EVENTS
  onMessage: (message, user) =>
    console.log message, ":: #{user}'s MESSAGE"

  onError: (error) =>
    console.error error, "ERROR"

  onConnectedToRoom: (messages, users) =>
    console.log messages, users, "CONNECTED"

  onUserDisconnection: (user) =>
    console.log user, "DISCONNECTED"

  onUserConnection: (user) =>
    console.log user, "CONNECTED"

  onNewUserJoined: (user) =>
    console.log user, "USERJOINED"

$ ->
  __Controller.Socket = new SocketCtrl "body"