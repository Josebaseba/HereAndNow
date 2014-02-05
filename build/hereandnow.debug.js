(function() {
  var HAN;

  window.HAN = HAN = (function() {
    var DEFAULT_NAME, EXAMPLE_ROOM, SOCKET_URL, _parseName;
    SOCKET_URL = "http://localhost:1337/socket";
    EXAMPLE_ROOM = "example_room";
    DEFAULT_NAME = "GUEST";
    _parseName = function(room_name) {
      var REG_EXP;
      REG_EXP = /[^a-z0-9]/gi;
      return room_name.replace(REG_EXP, "");
    };
    return {
      SOCKET_URL: SOCKET_URL,
      EXAMPLE_ROOM: EXAMPLE_ROOM,
      DEFAULT_NAME: DEFAULT_NAME,
      parseName: _parseName
    };
  })();

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
    var USERNAME;

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

    SocketCtrl.prototype.onMessage = function(message, user) {
      return console.log(message, ":: " + user + "'s MESSAGE");
    };

    SocketCtrl.prototype.onError = function(error) {
      return console.error(error, "ERROR");
    };

    SocketCtrl.prototype.onConnectedToRoom = function(messages, users) {
      return console.log(messages, users, "CONNECTED");
    };

    SocketCtrl.prototype.onUserDisconnection = function(user) {
      return console.log(user, "DISCONNECTED");
    };

    SocketCtrl.prototype.onUserConnection = function(user) {
      return console.log(user, "CONNECTED");
    };

    SocketCtrl.prototype.onNewUserJoined = function(user) {
      return console.log(user, "USERJOINED");
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
