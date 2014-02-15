class ChatCtrl extends Monocle.Controller

  elements:
    "header h2#chat-name"      : "chat_name"
    "textarea#message"         : "message"
    "input#username"           : "username"

  events:
    "keypress textarea#message" : "onKeyPressMessage"
    "keypress input#username"   : "onKeyPressUsername"

  constructor: ->
    super
    @chat_name.text do @_roomName
    @prepareMessageInput = @_prepareMessageInput

  sendMessage: ->
    if @message.val().trim() isnt ""
      __Controller.Socket.send @message.val().trim()
      do @_resetTextarea

  #Events
  onKeyPressMessage: (event) ->
    if @message.val().length > 60 then do @_resizeInput
    if event.keyCode is 13
      do event.preventDefault
      do @sendMessage

  onKeyPressUsername: (event) ->
    if event.keyCode is 13
      username = HAN.parseName @username.val().trim()
      if username isnt "" and username.length <= 25 and username isnt HAN.DEFAULT_NAME and @_isValidUsername username
        __Controller.Socket.setName username

  #Private Methods
  _roomName: ->
    location.pathname.slice(1).toLowerCase()

  _resetTextarea: ->
    @message.val ""
    @_resizeInput false
    $("html, body").animate scrollTop: $(document).height()

  _isValidUsername: (name) ->
    user = __Model.User.findBy "name", name
    unless user? then true else false

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