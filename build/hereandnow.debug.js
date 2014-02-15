(function() {
  var HAN,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.HAN = HAN = (function() {
    var COLORS, DEFAULT_COLOR, DEFAULT_NAME, IMG, REG_EXP, SOCKET_URL, _parseMessages, _parseName;
    SOCKET_URL = "http://localhost:1337/socket";
    DEFAULT_NAME = "GUEST";
    COLORS = ["#F78181", "#FA8258", "#FA5882", "#F6CED8", "#F6CEF5", "#D8CEF6", "#A9F5E1", "#A5DF00", "#D0FA58"];
    IMG = {
      SIZE: {
        WIDTH: 500,
        HEIGHT: 400
      },
      EXTENSIONS: ["jpg", "jpeg", "bmp", "png", "gif"]
    };
    REG_EXP = {
      LINK: /([^"']|^)(ftp|http|https):\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/gi,
      NAME: /[^a-z0-9]/gi
    };
    DEFAULT_COLOR = "#81DAF5";
    _parseName = function(room_name) {
      return room_name.replace(REG_EXP.NAME, "");
    };
    _parseMessages = function(text) {
      text = text.replace(REG_EXP.LINK, function(url) {
        var extension, id, idExpregYouTube, vimeoExpreg, youtubeExpreg, _ref;
        url = url.trim().replace(/\s/g, '');
        youtubeExpreg = /([^"']|^)(http|https):\/\/(www\.youtube\.com\/|youtu\.be\/)[\w=&\?]+/gi;
        vimeoExpreg = /([^"']|^)(http|https):\/\/(www\.vimeo\.com\/|vimeo\.com\/)[\w=&\?]+/gi;
        if (youtubeExpreg.test(url)) {
          idExpregYouTube = /^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/;
          id = url.match(idExpregYouTube);
          return "<iframe width=\"" + IMG.SIZE.WIDTH + "\" height=\"" + IMG.SIZE.HEIGHT + "\" src=\"//www.youtube.com/embed/" + id[3] + "\" frameborder=\"0\" allowfullscreen></iframe>";
        } else if (vimeoExpreg.test(url)) {
          return "<iframe src=\"//player.vimeo.com/video/" + (url.split("/")[3]) + "\" width=\"" + IMG.SIZE.WIDTH + "\" height=\"" + IMG.SIZE.HEIGHT + "\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>";
        } else {
          extension = url.split(".").pop();
          if (_ref = extension.toString(), __indexOf.call(IMG.EXTENSIONS, _ref) >= 0) {
            return "<img src=\"" + url + "\" width=\"" + IMG.SIZE.WIDTH + "\" height=\"" + IMG.SIZE.HEIGHT + "\">";
          } else {
            return " <a href=\"" + (url.replace(/\s/g, '')) + "\" target=\"_blank\">" + url + "</a> ";
          }
        }
      });
      return text;
    };
    return {
      SOCKET_URL: SOCKET_URL,
      DEFAULT_COLOR: DEFAULT_COLOR,
      DEFAULT_NAME: DEFAULT_NAME,
      COLORS: COLORS,
      parseName: _parseName,
      parseMessages: _parseMessages
    };
  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Model.Message = (function(_super) {
    __extends(Message, _super);

    function Message() {
      return Message.__super__.constructor.apply(this, arguments);
    }

    Message.fields("owner", "content");

    return Message;

  })(Monocle.Model);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Model.User = (function(_super) {
    __extends(User, _super);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    User.fields("name", "color");

    return User;

  })(Monocle.Model);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __View.Message = (function(_super) {
    var prev_model_owner;

    __extends(Message, _super);

    prev_model_owner = null;

    Message.prototype.container = "article ul#message-list";

    Message.prototype.template = "<li style=\"background-color: {{owner.color}}\"\n  class=\"{{^same_user}}padding{{/same_user}}{{#same_user}}padding-bottom padding-left{{/same_user}}\">\n  {{^same_user}}\n  <strong class=\"text big normal block padding-bottom\">{{owner.name}}</strong>\n  {{/same_user}}\n  <span class=\"text book\">{{{content}}}</span>\n</li>";

    function Message() {
      Message.__super__.constructor.apply(this, arguments);
      this._parseModel();
      this._parseContent();
      this.append(this.model);
    }

    Message.prototype._parseModel = function() {
      if ((prev_model_owner != null) && this.model.owner.name === prev_model_owner) {
        return this.model.same_user = true;
      } else {
        return prev_model_owner = this.model.owner.name;
      }
    };

    Message.prototype._parseContent = function() {
      return this.model.content = HAN.parseMessages(this.model.content);
    };

    return Message;

  })(Monocle.View);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __View.User = (function(_super) {
    __extends(User, _super);

    User.prototype.container = "article ul#user-list";

    User.prototype.template = "<li style=\"background-color:{{color}}\">{{name}}</li>";

    function User() {
      this.onDestroy = __bind(this.onDestroy, this);
      User.__super__.constructor.apply(this, arguments);
      if (this.model.name !== HAN.DEFAULT_NAME) {
        this.append(this.model);
      }
      this._addToUsersCount();
      __Model.User.bind("destroy", this.onDestroy);
    }

    User.prototype.onDestroy = function(user) {
      if (user.uid === this.model.uid) {
        this.el.remove();
        return this._removeFromUsersCount();
      }
    };

    User.prototype._addToUsersCount = function() {
      return $("span#user-count").html(parseInt($("span#user-count").html()) + 1);
    };

    User.prototype._removeFromUsersCount = function() {
      if (0 < parseInt($("span#user-count").html())) {
        return $("span#user-count").html(parseInt($("span#user-count").html()) - 1);
      }
    };

    return User;

  })(Monocle.View);

}).call(this);

(function() {
  var ChatCtrl,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ChatCtrl = (function(_super) {
    __extends(ChatCtrl, _super);

    ChatCtrl.prototype.elements = {
      "header h2#chat-name": "chat_name",
      "textarea#message": "message",
      "input#username": "username"
    };

    ChatCtrl.prototype.events = {
      "keypress textarea#message": "onKeyPressMessage",
      "keypress input#username": "onKeyPressUsername"
    };

    function ChatCtrl() {
      ChatCtrl.__super__.constructor.apply(this, arguments);
      this.chat_name.text(this._roomName());
      this.prepareMessageInput = this._prepareMessageInput;
    }

    ChatCtrl.prototype.sendMessage = function() {
      if (this.message.val().trim() !== "") {
        __Controller.Socket.send(this.message.val().trim());
        return this._resetTextarea();
      }
    };

    ChatCtrl.prototype.onKeyPressMessage = function(event) {
      if (this.message.val().length > 60) {
        this._resizeInput();
      }
      if (event.keyCode === 13) {
        event.preventDefault();
        return this.sendMessage();
      }
    };

    ChatCtrl.prototype.onKeyPressUsername = function(event) {
      var username;
      if (event.keyCode === 13) {
        username = HAN.parseName(this.username.val().trim());
        if (username !== "" && username.length <= 25 && username !== HAN.DEFAULT_NAME && this._isValidUsername(username)) {
          return __Controller.Socket.setName(username);
        }
      }
    };

    ChatCtrl.prototype._roomName = function() {
      return location.pathname.slice(1).toLowerCase();
    };

    ChatCtrl.prototype._resetTextarea = function() {
      this.message.val("");
      this._resizeInput(false);
      return $("html, body").animate({
        scrollTop: $(document).height()
      });
    };

    ChatCtrl.prototype._isValidUsername = function(name) {
      var user;
      user = __Model.User.findBy("name", name);
      if (user == null) {
        return true;
      } else {
        return false;
      }
    };

    ChatCtrl.prototype._prepareMessageInput = function() {
      this.username.hide();
      this.message.show();
      return this.message.focus();
    };

    ChatCtrl.prototype._resizeInput = function(bigger) {
      if (bigger == null) {
        bigger = true;
      }
      if (bigger) {
        return this.message.css("height", "100px");
      } else {
        return this.message.css("height", "54px");
      }
    };

    return ChatCtrl;

  })(Monocle.Controller);

  $(function() {
    return __Controller.Chat = new ChatCtrl("section[data-control=chat]");
  });

}).call(this);

(function() {
  var MainCtrl,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MainCtrl = (function(_super) {
    __extends(MainCtrl, _super);

    MainCtrl.prototype.elements = {
      "input#room-name": "room_name",
      "button#start": "btn_start"
    };

    MainCtrl.prototype.events = {
      "click button#start": "onStart",
      "keyup input#room-name": "onKeyUp"
    };

    function MainCtrl() {
      MainCtrl.__super__.constructor.apply(this, arguments);
    }

    MainCtrl.prototype.onStart = function() {
      var room_name;
      if (this.room_name.val().trim() !== "" && this.room_name.length <= 128) {
        room_name = HAN.parseName(this.room_name.val().trim().toLowerCase());
        return window.location.href = room_name;
      }
    };

    MainCtrl.prototype.onKeyUp = function(event) {
      if (event.keyCode === 13) {
        return this.onStart();
      }
    };

    return MainCtrl;

  })(Monocle.Controller);

  $(function() {
    return __Controller.Main = new MainCtrl("section[data-control=main]");
  });

}).call(this);

(function() {
  var SocketCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SocketCtrl = (function(_super) {
    var USERNAME, _randomColor;

    __extends(SocketCtrl, _super);

    function SocketCtrl() {
      this.onNewUserJoined = __bind(this.onNewUserJoined, this);
      this.onUserConnection = __bind(this.onUserConnection, this);
      this.onUserDisconnection = __bind(this.onUserDisconnection, this);
      this.onConnectedToRoom = __bind(this.onConnectedToRoom, this);
      this.onError = __bind(this.onError, this);
      this.onMessage = __bind(this.onMessage, this);
      return SocketCtrl.__super__.constructor.apply(this, arguments);
    }

    USERNAME = null;

    SocketCtrl.prototype.socket_events = ["error", "connectedToRoom", "message", "userDisconnection", "userConnection", "newUserJoined", "nameChanged"];

    SocketCtrl.prototype.initialize = function() {
      var event, _i, _len, _ref;
      this.socket = io.connect(HAN.SOCKET_URL);
      _ref = this.socket_events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        this.socket.on(event, this["on" + (event.charAt(0).toUpperCase() + event.slice(1))]);
      }
      return this.connectToRoom();
    };

    SocketCtrl.prototype.connectToRoom = function() {
      if (__Controller.Url.ROOM_NAME) {
        return this.socket.emit("connectToRoom", __Controller.Url.ROOM_NAME);
      }
    };

    SocketCtrl.prototype.setName = function(username) {
      USERNAME = username;
      return this.socket.emit("setName", USERNAME);
    };

    SocketCtrl.prototype.send = function(message) {
      if (USERNAME != null) {
        return this.socket.emit("message", message);
      }
    };

    SocketCtrl.prototype.onMessage = function(message) {
      if (message != null) {
        return this._createMessageModel(message);
      }
    };

    SocketCtrl.prototype.onError = function(error) {
      return console.error(error, "ERROR");
    };

    SocketCtrl.prototype.onConnectedToRoom = function(messages, users) {
      var message, user, _i, _j, _len, _len1;
      this._createUserModel(HAN.DEFAULT_NAME);
      if (users != null) {
        for (_i = 0, _len = users.length; _i < _len; _i++) {
          user = users[_i];
          this._createUserModel(user);
        }
      }
      if (messages != null) {
        for (_j = 0, _len1 = messages.length; _j < _len1; _j++) {
          message = messages[_j];
          this._createMessageModel(message);
        }
      }
      return $("html, body").animate({
        scrollTop: $(document).height()
      }, 1000);
    };

    SocketCtrl.prototype.onNameChanged = function(username) {
      return __Controller.Chat.prepareMessageInput();
    };

    SocketCtrl.prototype.onUserDisconnection = function(user) {
      var user_model;
      user_model = __Model.User.findBy("name", user);
      if (user_model != null) {
        return user_model.destroy();
      }
    };

    SocketCtrl.prototype.onUserConnection = function(user) {
      return this._createUserModel(user);
    };

    SocketCtrl.prototype.onNewUserJoined = function(user) {
      var user_model;
      user_model = __Model.User.findBy("name", HAN.DEFAULT_NAME);
      console.log(user_model);
      if (user_model != null) {
        user_model.destroy();
      }
      return this._createUserModel(user);
    };

    SocketCtrl.prototype._createUserModel = function(username) {
      var user;
      user = {
        name: username,
        color: _randomColor()
      };
      return new __View.User({
        model: __Model.User.create(user)
      });
    };

    SocketCtrl.prototype._createMessageModel = function(message) {
      var owner;
      owner = __Model.User.findBy("name", message.owner);
      if (owner != null) {
        message.owner = owner;
      } else {
        message.owner = {
          name: message.owner,
          color: HAN.DEFAULT_COLOR
        };
      }
      return new __View.Message({
        model: __Model.Message.create(message)
      });
    };

    _randomColor = function() {
      return HAN.COLORS[Math.floor(Math.random() * HAN.COLORS.length)];
    };

    return SocketCtrl;

  })(Monocle.Controller);

  $(function() {
    return __Controller.Socket = new SocketCtrl("body");
  });

}).call(this);

(function() {
  var UrlCtrl,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  UrlCtrl = (function(_super) {
    __extends(UrlCtrl, _super);

    function UrlCtrl() {
      return UrlCtrl.__super__.constructor.apply(this, arguments);
    }

    UrlCtrl.prototype.ROOM_NAME = null;

    UrlCtrl.prototype.initialize = function() {
      if (location.pathname !== "/") {
        return this._prepareConnection();
      }
    };

    UrlCtrl.prototype._prepareConnection = function() {
      this.ROOM_NAME = location.pathname.slice(1).toLowerCase();
      return __Controller.Socket.initialize();
    };

    return UrlCtrl;

  })(Monocle.Controller);

  $(function() {
    __Controller.Url = new UrlCtrl("body");
    return __Controller.Url.initialize();
  });

}).call(this);
