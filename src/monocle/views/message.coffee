class __View.Message extends Monocle.View

  prev_model_owner = null

  container: "article#message-list ul"

  template: """
    <li style="background-color: {{owner.color}}"
      class="{{^same_user}}padding{{/same_user}}{{#same_user}}padding-bottom padding-left{{/same_user}}">
      {{^same_user}}
      <strong class="text big normal block padding-bottom">{{owner.name}}</strong>
      {{/same_user}}
      <span class="text book">{{{content}}}</span>
    </li>
    """

  constructor: ->
    super
    do @_parseModel
    do @_parseContent
    @append @model

  _parseModel: ->
    if prev_model_owner? and @model.owner.name is prev_model_owner
      @model.same_user = true
    else
      prev_model_owner = @model.owner.name

  _parseContent: ->
    @model.content = HAN.parseMessages @model.content