(function() {
  var HAN;

  window.HAN = HAN = {
    SOCKET_URL: "http://localhost:1337/socket",
    EXAMPLE_ROOM: "example_room"
  };

}).call(this);

(function() {
  var SocketCtrl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SocketCtrl = (function(_super) {
    __extends(SocketCtrl, _super);

    function SocketCtrl() {
      this.onConnection = __bind(this.onConnection, this);
      this.onDisconnection = __bind(this.onDisconnection, this);
      this.onJoined = __bind(this.onJoined, this);
      this.onError = __bind(this.onError, this);
      this.onMessage = __bind(this.onMessage, this);
      return SocketCtrl.__super__.constructor.apply(this, arguments);
    }

    SocketCtrl.prototype.events = ["error", "joined", "message", "disconnection", "connection"];

    SocketCtrl.prototype.initialize = function() {
      var event, _i, _len, _ref;
      this.socket = io.connect(HAN.SOCKET_URL);
      _ref = this.events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        this.socket.on(event, this["on" + (event.charAt(0).toUpperCase() + event.slice(1))]);
      }
      return this.join();
    };

    SocketCtrl.prototype.join = function() {
      if (__Controller.Url.ROOM_NAME != null) {
        return this.socket.emit("join", __Controller.Url.ROOM_NAME, "Joseba");
      }
    };

    SocketCtrl.prototype.onMessage = function(message) {
      return console.log(message, "MESSAGE");
    };

    SocketCtrl.prototype.onError = function(error) {
      return console.error(error, "ERROR");
    };

    SocketCtrl.prototype.onJoined = function(messages, users) {
      return console.log(messages, users, "JOINED");
    };

    SocketCtrl.prototype.onDisconnection = function(user) {
      return console.log(user, "DISCONNECTED");
    };

    SocketCtrl.prototype.onConnection = function(user) {
      return console.log(user, "CONNECTED");
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
      this.ROOM_NAME = location.pathname.slice(1);
      return __Controller.Socket.initialize();
    };

    return UrlCtrl;

  })(Monocle.Controller);

  $(function() {
    __Controller.Url = new UrlCtrl("body");
    return __Controller.Url.initialize();
  });

}).call(this);
