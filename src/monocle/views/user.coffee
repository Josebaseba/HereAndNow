class __View.User extends Monocle.View

  container: "article ul#user-list"

  template: """
    <li style="background-color:{{color}}">{{name}}</li>
  """

  constructor: ->
    super
    @append @model
    __Model.User.bind "destroy", @onDestroy

  onDestroy: (user) =>
    if user.uid is @model.uid then do @el.remove
