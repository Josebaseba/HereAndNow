"use strict"
Yoi      = require "yoi"
socketio = require "socket.io"
Room     = require "../../commons/models/room"
Message  = require "../../commons/models/message"

DEFAULT_NAME = "GUEST"

_connections = {}

module.exports = (server) ->
  io = socketio.listen(server).of("/socket")

  io.on "connection", (client) =>
    client.on "connectToRoom", (room_name) ->
      if room_name?
        Room.findBy(name: room_name).then (error, room) =>
          if error?
            @emit "error", error
          else if room?
            _connectToRoom @, room_name
          else
            _createRoom @, room_name
      else
        @emit "error", "No room name."

    client.on "disconnect", (reason) ->
      if @room_name?
        @broadcast.to(@room_name).emit "userDisconnection", @user
        @leave @room_name
        if io.clients(@room_name).length is 0
          _deleteRoomAndMessages @room_name
        _deleteConnection @room_name, @user

    client.on "message", (message) ->
      if @room_name? and @user and message?
        io.in(@room_name).emit "message", content: message, owner: @user
        _saveMessage @room_name, message, @user
      else
        @emit "error", "Not enougth parameters."

    client.on "setName", (user) ->
      if user? and user isnt DEFAULT_NAME
        if _isValidUsername user, @room_name
          @user = user
          _updateUsernameInRoom @room_name, user
          io.in(@room_name).emit "newUserJoined", user
          client.emit "nameChanged", user
        else
          client.emit "error", "No valid username"


# PRIVATE METHODS
_createRoom = (client, room_name) ->
  Room.create(name: room_name).then (error, room) =>
    if room?
      _connectToRoom client, room_name
    else
      client.emit "error", error

_connectToRoom = (client, room_name) ->
  Yoi.Hope.shield([ ->
    Room.findBy name: room_name
  , (error, room) ->
    if room?
      Message.findBy room: room._id
  ]).then (error, messages) ->
    _setConnection client, room_name
    client.emit "connectedToRoom", messages, _connections[room_name]
    client.broadcast.to(room_name).emit "userConnection", DEFAULT_NAME
    _saveConnectionInRoom room_name, DEFAULT_NAME

_setConnection = (client, room_name) ->
  client.join room_name
  client.room_name = room_name
  client.user = DEFAULT_NAME

_saveConnectionInRoom = (room_name, user) ->
  if not _connections[room_name]?
    _connections[room_name] = []
  _connections[room_name].push user

_updateUsernameInRoom = (room_name, user) ->
  _connections[room_name].splice _connections[room_name].indexOf(DEFAULT_NAME), 1
  _connections[room_name].push user

_saveMessage = (room_name, message, user) ->
  Yoi.Hope.shield [ ->
    Room.findBy name: room_name
  , (error, room) ->
    if room?
      Message.create room: room._id, content: message, owner: user
  ]

_deleteRoomAndMessages = (room_name) ->
  Yoi.Hope.shield [ ->
    Room.delete room_name
  , (error, room) ->
    Message.deleteByRoom room._id
  ]

_deleteConnection = (room_name, user) ->
  if _connections[room_name]?.length isnt 0 and _connections[room_name].indexOf(user) isnt -1
    _connections[room_name].splice _connections[room_name].indexOf(user), 1
    if _connections[room_name]?.length is 0 then _connections[room_name] = null

_isValidUsername = (user, room_name) ->
  if _connections[room_name]?
    if user in _connections[room_name] then false else true
  else
    _connections[room_name] = []
    true
