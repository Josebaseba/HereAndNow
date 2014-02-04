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
    if @room_name.val().trim() isnt "" and @room_name.length <= 128
      room_name = HAN.parseName @room_name.val().trim().toLowerCase()
      window.location.href = room_name

  onKeyUp: (event) ->
    if event.keyCode is 13 then do @onStart

$ ->
  __Controller.Main = new MainCtrl "section[data-control=main]"