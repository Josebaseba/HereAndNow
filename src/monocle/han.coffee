window.HAN = HAN = do ->

  SOCKET_URL   = "http://localhost:1337/socket"

  DEFAULT_NAME = "GUEST"

  COLORS = [
    "#F78181", "#FA8258", "#FA5882",
    "#F6CED8", "#F6CEF5", "#D8CEF6",
    "#A9F5E1", "#A5DF00", "#D0FA58"
  ]

  IMG =
    SIZE:
      WIDTH  : 500
      HEIGHT : 400
    EXTENSIONS: ["jpg", "jpeg", "bmp", "png", "gif"]

  REG_EXP =
    LINK    : /([^"']|^)(ftp|http|https):\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/gi
    NAME    : /[^a-z0-9]/gi
    YOUTUBE : /([^"']|^)(http|https):\/\/(www\.youtube\.com\/|youtu\.be\/)[\w=&\?]+/gi
    VIMEO   : /([^"']|^)(http|https):\/\/(www\.vimeo\.com\/|vimeo\.com\/)[\w=&\?]+/gi

  DEFAULT_COLOR = "#81DAF5"

  _parseName = (room_name) ->
    room_name.replace(REG_EXP.NAME, "")

  _parseMessages = (text) ->
    text = text.replace REG_EXP.LINK, (url) ->
      url = url.trim().replace(/\s/g,'')
      if REG_EXP.YOUTUBE.test(url)
        idExpregYouTube = /^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/
        id = url.match(idExpregYouTube)
        """<iframe width="#{IMG.SIZE.WIDTH}" height="#{IMG.SIZE.HEIGHT}" src="//www.youtube.com/embed/#{id[3]}" frameborder="0" allowfullscreen></iframe>"""
      else if REG_EXP.VIMEO.test(url)
        """<iframe src="//player.vimeo.com/video/#{url.split("/")[3]}" width="#{IMG.SIZE.WIDTH}" height="#{IMG.SIZE.HEIGHT}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>"""
      else
        extension = url.split(".").pop()
        if extension.toString() in IMG.EXTENSIONS
          """<img src="#{url}" width="#{IMG.SIZE.WIDTH}" height="#{IMG.SIZE.HEIGHT}">"""
        else
          """ <a href="#{url.replace(/\s/g,'')}" target="_blank">#{url}</a> """
    text

  SOCKET_URL    : SOCKET_URL
  DEFAULT_COLOR : DEFAULT_COLOR
  DEFAULT_NAME  : DEFAULT_NAME
  COLORS        : COLORS
  parseName     : _parseName
  parseMessages : _parseMessages

