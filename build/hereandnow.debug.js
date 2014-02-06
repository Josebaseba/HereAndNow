(function() {
  var HAN;

  window.HAN = HAN = (function() {
    var COLORS, DEFAULT_COLOR, DEFAULT_NAME, SOCKET_URL, _parseName;
    SOCKET_URL = "http://localhost:1337/socket";
    DEFAULT_NAME = "GUEST";
    COLORS = ["#F78181", "#FA8258", "#FA5882", "#F6CED8", "#F6CEF5", "#D8CEF6", "#A9F5E1", "#A5DF00", "#D0FA58"];
    DEFAULT_COLOR = "#81DAF5";
    _parseName = function(room_name) {
      var REG_EXP;
      REG_EXP = /[^a-z0-9]/gi;
      return room_name.replace(REG_EXP, "");
    };
    return {
      SOCKET_URL: SOCKET_URL,
      DEFAULT_COLOR: DEFAULT_COLOR,
      DEFAULT_NAME: DEFAULT_NAME,
      COLORS: COLORS,
      parseName: _parseName
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
    __extends(Message, _super);

    Message.prototype.container = "article#message-list ul";

    Message.prototype.template = "<li style=\"background-color: {{owner.color}}\" class=\"padding\">\n  {{content}}\n</li>";

    function Message() {
      Message.__super__.constructor.apply(this, arguments);
      this.append(this.model);
    }

    return Message;

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
      "keyup textarea#message": "onKeyUpMessage",
      "keyup input#username": "onKeyUpUsername"
    };

    function ChatCtrl() {
      ChatCtrl.__super__.constructor.apply(this, arguments);
      this.chat_name.text(this._roomName());
    }

    ChatCtrl.prototype.sendMessage = function() {
      if (this.message.val().trim() !== "") {
        __Controller.Socket.send(this.message.val().trim());
        this.message.val("");
        return this._resizeInput(false);
      }
    };

    ChatCtrl.prototype.onKeyUpMessage = function(event) {
      if (this.message.val().length > 60) {
        this._resizeInput();
      }
      if (event.keyCode === 13) {
        return this.sendMessage();
      }
    };

    ChatCtrl.prototype.onKeyUpUsername = function(event) {
      var username;
      if (event.keyCode === 13 && this.username.val().trim() !== "") {
        username = HAN.parseName(this.username.val().trim());
        if (username.length <= 25 && username !== HAN.DEFAULT_NAME) {
          __Controller.Socket.setName(username);
          return this._prepareMessageInput();
        }
      }
    };

    ChatCtrl.prototype._roomName = function() {
      return location.pathname.slice(1).toLowerCase();
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

    SocketCtrl.prototype.socket_events = ["error", "connectedToRoom", "message", "userDisconnection", "userConnection", "newUserJoined"];

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
      var message, user, _i, _j, _len, _len1, _results;
      if (users != null) {
        for (_i = 0, _len = users.length; _i < _len; _i++) {
          user = users[_i];
          this._createUserModel(user);
        }
      }
      if (messages != null) {
        _results = [];
        for (_j = 0, _len1 = messages.length; _j < _len1; _j++) {
          message = messages[_j];
          _results.push(this._createMessageModel(message));
        }
        return _results;
      }
    };

    SocketCtrl.prototype.onUserDisconnection = function(user) {
      var user_model;
      console.log(user, "DISCONNECTED");
      user_model = __Model.User.findBy("name", user);
      if (user_model != null) {
        return user_model.destroy();
      }
    };

    SocketCtrl.prototype.onUserConnection = function(user) {
      this._createUserModel(user);
      return console.log(user, "CONNECTED");
    };

    SocketCtrl.prototype.onNewUserJoined = function(user) {
      var user_model;
      user_model = __Model.User.findBy("name", HAN.DEFAULT_NAME);
      if (user_model != null) {
        user_model.destroy();
      }
      this._createUserModel(user);
      return console.log(user, "USERJOINED");
    };

    SocketCtrl.prototype._createUserModel = function(username) {
      var user;
      user = {
        name: username,
        color: _randomColor()
      };
      return __Model.User.create(user);
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
