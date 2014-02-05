window.HAN = HAN = do ->

  SOCKET_URL   = "http://localhost:1337/socket"

  EXAMPLE_ROOM = "example_room"

  DEFAULT_NAME = "GUEST"

  _parseName = (room_name) ->
    REG_EXP = /[^a-z0-9]/gi
    room_name.replace(REG_EXP, "")

  SOCKET_URL   : SOCKET_URL
  EXAMPLE_ROOM : EXAMPLE_ROOM
  DEFAULT_NAME : DEFAULT_NAME
  parseName    : _parseName

