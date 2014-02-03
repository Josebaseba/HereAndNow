class ChatCtrl extends Monocle.Controller

  elements:
    "header h2#chat-name"    : "chat_name"
    "textarea#message"       : "message"

  events:
    "keyup textarea#message" : "onKeyUp"

  constructor: ->
    super
    @chat_name.text do @_roomName

  sendMessage: ->
    if @message.val().trim() isnt ""
      __Controller.Socket.send @message.val().trim()
      @message.val ""
      @_resizeInput false

  #Events
  onKeyUp: (event) ->
    if @message.val().length > 60 then do @_resizeInput
    if event.keyCode is 13 then do @sendMessage

  #Private Methods
  _roomName: ->
    location.pathname.slice(1).toLowerCase()

  _resizeInput: (bigger = true) ->
    if bigger
      @message.css "height", "100px"
    else
      @message.css "height", "54px"

$ ->
  __Controller.Chat = new ChatCtrl "section[data-control=chat]"