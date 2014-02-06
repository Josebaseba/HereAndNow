class __View.Message extends Monocle.View

  container: "article#message-list ul"

  template: """
    <li style="background-color: {{owner.color}}" class="padding">
      {{content}}
    </li>
    """

  constructor: ->
    super
    @append @model