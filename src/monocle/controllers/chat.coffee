class ChatCtrl extends Monocle.Controller

  elements:
    "header h2#chat-name"    : "chat_name"
    "textarea#message"       : "message"
    "input#username"         : "username"

  events:
    "keyup textarea#message" : "onKeyUpMessage"
    "keyup input#username"   : "onKeyUpUsername"

  constructor: ->
    super
    @chat_name.text do @_roomName

  sendMessage: ->
    if @message.val().trim() isnt ""
      __Controller.Socket.send @message.val().trim()
      @message.val ""
      @_resizeInput false

  #Events
  onKeyUpMessage: (event) ->
    if @message.val().length > 60 then do @_resizeInput
    if event.keyCode is 13 then do @sendMessage

  onKeyUpUsername: (event) ->
    if event.keyCode is 13 and @username.val().trim() isnt ""
      username = HAN.parseName @username.val().trim()
      if username.length <= 25 and username isnt HAN.DEFAULT_NAME
        __Controller.Socket.setName username
        do @_prepareMessageInput

  #Private Methods
  _roomName: ->
    location.pathname.slice(1).toLowerCase()

  _prepareMessageInput: ->
    do @username.hide
    do @message.show
    do @message.focus

  _resizeInput: (bigger = true) ->
    if bigger
      @message.css "height", "100px"
    else
      @message.css "height", "54px"

$ ->
  __Controller.Chat = new ChatCtrl "section[data-control=chat]"