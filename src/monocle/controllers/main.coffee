class MainCtrl extends Monocle.Controller

  elements:
    "input#room-name"       : "room_name"
    "button#start"          : "btn_start"

  events:
    "click button#start"    : "onStart"
    "keyup input#room-name" : "onKeyUp"

  constructor: ->
    super

  #Events
  onStart: ->
    if @room_name.val().trim() isnt ""
      room_name = _parseRoomName @room_name.val().trim()
      window.location.href = room_name

  onKeyUp: (event) ->
    if event.keyCode is 13 then do @onStart

  #Private methods
  _parseRoomName = (room_name) ->
    if room_name.length <= 128
      REG_EXP = /[^a-z0-9]/gi
      room_name.replace(REG_EXP, "").toLowerCase()
    else
      null

$ ->
  __Controller.Main = new MainCtrl "body"