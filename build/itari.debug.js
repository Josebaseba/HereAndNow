(function() {


}).call(this);

(function() {


}).call(this);

(function() {
  var SocketCtrl,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SocketCtrl = (function(_super) {
    __extends(SocketCtrl, _super);

    function SocketCtrl() {
      SocketCtrl.__super__.constructor.apply(this, arguments);
      this.socket = io.connect("http://localhost:1337/socket");
      this.socket.on("error", function(error) {
        return console.error(error);
      });
      this.socket.on("joined", (function(_this) {
        return function(messages, users) {
          console.log(messages, users);
          return _this.socket.emit("message", "HELLO WORLD!!! " + (new Date()), "Joseba");
        };
      })(this));
      this.socket.on("message", function(message) {
        return console.log(message, "MESSAGE");
      });
      this.socket.on("disconnection", function(user) {
        return console.log(user, "DISCONNECTED");
      });
      this.socket.on("connection", function(user) {
        return console.log(user, "CONNECTED");
      });
      this.socket.emit("join", "Joseba-Group", "JOSEBA");
    }

    return SocketCtrl;

  })(Monocle.Controller);

  $(function() {
    return __Controller.Socket = new SocketCtrl("body");
  });

}).call(this);
