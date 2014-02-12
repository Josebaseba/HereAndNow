class __View.User extends Monocle.View

  container: "article ul#user-list"

  template: """
    <li style="background-color:{{color}}">{{name}}</li>
  """

  constructor: ->
    super
    if @model.name isnt HAN.DEFAULT_NAME
      @append @model
    do @_addToUsersCount
    __Model.User.bind "destroy", @onDestroy

  onDestroy: (user) =>
    if user.uid is @model.uid
      do @el.remove
      do @_removeFromUsersCount

  #Private methods
  _addToUsersCount: ->
    $("span#user-count").html parseInt($("span#user-count").html()) + 1

  _removeFromUsersCount: ->
    if 0 < parseInt $("span#user-count").html()
      $("span#user-count").html parseInt($("span#user-count").html()) - 1
