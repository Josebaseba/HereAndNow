class SocketCtrl extends Monocle.Controller

  USERNAME = null

  socket_events: [
    "error", "connectedToRoom", "message",
    "userDisconnection", "userConnection",
    "newUserJoined", "nameChanged"
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
  onMessage: (message) =>
    if message?
      @_createMessageModel message
      $("html, body").animate scrollTop: $(document).height()

  onError: (error) =>
    console.error error, "ERROR"

  onConnectedToRoom: (messages, users) =>
    if users? then @_createUserModel user for user in users
    if messages? then @_createMessageModel message for message in messages
    $("html, body").animate scrollTop: $(document).height(), 1000

  onNameChanged: (username) ->
    do __Controller.Chat.prepareMessageInput

  onUserDisconnection: (user) =>
    console.log user, "DISCONNECTED"
    user_model = __Model.User.findBy "name", user
    if user_model? then do user_model.destroy

  onUserConnection: (user) =>
    @_createUserModel user
    console.log user, "CONNECTED"

  onNewUserJoined: (user) =>
    user_model = __Model.User.findBy "name", HAN.DEFAULT_NAME
    if user_model? then do user_model.destroy
    @_createUserModel user
    console.log user, "USERJOINED"

  #PRIVATE METHODS
  _createUserModel: (username) ->
    user = name: username, color: _randomColor()
    __Model.User.create user

  _createMessageModel: (message) ->
    owner = __Model.User.findBy "name", message.owner
    if owner?
      message.owner = owner
    else
      message.owner = name: message.owner, color: HAN.DEFAULT_COLOR
    new __View.Message model: __Model.Message.create message

  _randomColor = ->
    HAN.COLORS[Math.floor(Math.random() * HAN.COLORS.length)]

$ ->
  __Controller.Socket = new SocketCtrl "body"