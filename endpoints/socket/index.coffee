"use strict"
Yoi      = require "yoi"
socketio = require "socket.io"
Room     = require "../../commons/models/room"
Message  = require "../../commons/models/message"

_connections = {}

module.exports = (server) ->
  io = socketio.listen(server).of("/socket")

  io.on "connection", (client) =>
    client.on "join", (room_name, user) ->
      if room_name?
        Room.findBy(name: room_name).then (error, room) =>
          if error?
            @emit "error", error
          else if room?
            _connectToRoom client, room_name, user
          else
            _createRoom client, room_name, user
      else
        @emit "error", "No room name."

    client.on "disconnect", (reason) ->
      if @room_name?
        @broadcast.to(@room_name).emit "disconnection", @user
        @leave @room_name
        if io.clients(@room_name).length is 0
          _deleteRoomAndMessages @room_name
        _deleteConnection @room_name, @user

    client.on "message", (message, user) ->
      if @room_name? and message? and user?
        io.in(@room_name).emit "message", message
        _saveMessage @room_name, message, user

# PRIVATE METHODS

_createRoom = (client, room_name, user) ->
  Room.create(name: room_name).then (error, room) =>
    if room?
      _connectToRoom client, room_name, user
    else
      client.emit "error", error

_connectToRoom = (client, room_name, user) ->
  Yoi.Hope.shield([ ->
    Room.findBy name: room_name
  , (error, room) ->
    if room?
      Message.findBy room: room._id
  ]).then (error, messages) ->
    client.join room_name
    client.room_name = room_name
    client.user = user
    client.emit "joined", messages, _connections[room_name]
    client.broadcast.to(room_name).emit "connection", user
    _saveConnectionsByRoom room_name, user

_saveConnectionsByRoom = (room_name, user) ->
  if not _connections[room_name]?
    _connections[room_name] = []
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
  if _connections[room_name]?.length isnt 0
    if _connections[room_name].indexOf(user) isnt -1
      _connections[room_name].splice _connections[room_name].indexOf(user), 1
      if _connections[room_name]?.length is 0 then _connections[room_name] = null
