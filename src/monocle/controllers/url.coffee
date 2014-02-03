class UrlCtrl extends Monocle.Controller

  ROOM_NAME: null

  initialize: ->
    if location.pathname isnt "/" then do @_prepareConnection

  _prepareConnection: ->
    @ROOM_NAME = location.pathname.slice(1).toLowerCase()
    do __Controller.Socket.initialize

$ ->
  __Controller.Url = new UrlCtrl "body"
  do __Controller.Url.initialize
