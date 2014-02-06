window.HAN = HAN = do ->

  SOCKET_URL   = "http://localhost:1337/socket"

  DEFAULT_NAME = "GUEST"

  COLORS = [
    "#F78181", "#FA8258", "#FA5882",
    "#F6CED8", "#F6CEF5", "#D8CEF6",
    "#A9F5E1", "#A5DF00", "#D0FA58"
  ]

  DEFAULT_COLOR = "#81DAF5"

  _parseName = (room_name) ->
    REG_EXP = /[^a-z0-9]/gi
    room_name.replace(REG_EXP, "")

  SOCKET_URL    : SOCKET_URL
  DEFAULT_COLOR : DEFAULT_COLOR
  DEFAULT_NAME  : DEFAULT_NAME
  COLORS        : COLORS
  parseName     : _parseName

