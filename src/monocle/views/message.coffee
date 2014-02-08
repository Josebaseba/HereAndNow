class __View.Message extends Monocle.View

  prev_model = null

  container: "article#message-list ul"

  template: """
    <li style="background-color: {{owner.color}}" class="padding">
      {{^same_user}}
      <strong class="text big normal block">{{owner.name}}</strong>
      {{/same_user}}
      <span class="text book">{{content}}</span>
    </li>
    """

  constructor: ->
    super
    do @_parseModel
    @append @model

  _parseModel: ->
    if prev_model? and @model.owner.name is prev_model.owner.name
      @model.same_user = true
    else
      prev_model = @model