/* hereandnow v0.0.1 - 2/3/2014
   http://josebaseba.com
   Copyright (c) 2014  - Licensed  */
(function(){var a;window.HAN=a={SOCKET_URL:"http://localhost:1337/socket",EXAMPLE_ROOM:"example_room"}}).call(this);(function(){var a,b={}.hasOwnProperty,c=function(a,c){for(var d in c){if(b.call(c,d))a[d]=c[d]}function e(){this.constructor=a}e.prototype=c.prototype;a.prototype=new e;a.__super__=c.prototype;return a};a=function(a){c(b,a);b.prototype.elements={"header h2#chat-name":"chat_name","textarea#message":"message"};b.prototype.events={"keyup textarea#message":"onKeyUp"};function b(){b.__super__.constructor.apply(this,arguments);this.chat_name.text(this._roomName())}b.prototype.sendMessage=function(){console.log(this.message.val());this.message.val("");return this._resizeInput(false)};b.prototype.onKeyUp=function(a){if(this.message.val().length>60){this._resizeInput()}if(a.keyCode===13){return this.sendMessage()}};b.prototype._roomName=function(){return location.pathname.slice(1).toLowerCase()};b.prototype._resizeInput=function(a){if(a==null){a=true}if(a){return this.message.css("height","100px")}else{return this.message.css("height","54px")}};return b}(Monocle.Controller);$(function(){return __Controller.Chat=new a("section[data-control=chat]")})}).call(this);(function(){var a,b={}.hasOwnProperty,c=function(a,c){for(var d in c){if(b.call(c,d))a[d]=c[d]}function e(){this.constructor=a}e.prototype=c.prototype;a.prototype=new e;a.__super__=c.prototype;return a};a=function(a){var b;c(d,a);d.prototype.elements={"input#room-name":"room_name","button#start":"btn_start"};d.prototype.events={"click button#start":"onStart","keyup input#room-name":"onKeyUp"};function d(){d.__super__.constructor.apply(this,arguments)}d.prototype.onStart=function(){var a;if(this.room_name.val().trim()!==""){a=b(this.room_name.val().trim());return window.location.href=a}};d.prototype.onKeyUp=function(a){if(a.keyCode===13){return this.onStart()}};b=function(a){var b;if(a.length<=128){b=/[^a-z0-9]/gi;return a.replace(b,"").toLowerCase()}else{return null}};return d}(Monocle.Controller);$(function(){return __Controller.Main=new a("section[data-control=main]")})}).call(this);(function(){var a,b=function(a,b){return function(){return a.apply(b,arguments)}},c={}.hasOwnProperty,d=function(a,b){for(var d in b){if(c.call(b,d))a[d]=b[d]}function e(){this.constructor=a}e.prototype=b.prototype;a.prototype=new e;a.__super__=b.prototype;return a};a=function(a){d(c,a);function c(){this.onConnection=b(this.onConnection,this);this.onDisconnection=b(this.onDisconnection,this);this.onJoined=b(this.onJoined,this);this.onError=b(this.onError,this);this.onMessage=b(this.onMessage,this);return c.__super__.constructor.apply(this,arguments)}c.prototype.socket_events=["error","joined","message","disconnection","connection"];c.prototype.initialize=function(){var a,b,c,d;this.socket=io.connect(HAN.SOCKET_URL);d=this.socket_events;for(b=0,c=d.length;b<c;b++){a=d[b];this.socket.on(a,this["on"+(a.charAt(0).toUpperCase()+a.slice(1))])}return this.join()};c.prototype.join=function(){if(__Controller.Url.ROOM_NAME!=null){return this.socket.emit("join",__Controller.Url.ROOM_NAME,"Joseba")}};c.prototype.onMessage=function(a){return console.log(a,"MESSAGE")};c.prototype.onError=function(a){return console.error(a,"ERROR")};c.prototype.onJoined=function(a,b){return console.log(a,b,"JOINED")};c.prototype.onDisconnection=function(a){return console.log(a,"DISCONNECTED")};c.prototype.onConnection=function(a){return console.log(a,"CONNECTED")};return c}(Monocle.Controller);$(function(){return __Controller.Socket=new a("body")})}).call(this);(function(){var a,b={}.hasOwnProperty,c=function(a,c){for(var d in c){if(b.call(c,d))a[d]=c[d]}function e(){this.constructor=a}e.prototype=c.prototype;a.prototype=new e;a.__super__=c.prototype;return a};a=function(a){c(b,a);function b(){return b.__super__.constructor.apply(this,arguments)}b.prototype.ROOM_NAME=null;b.prototype.initialize=function(){if(location.pathname!=="/"){return this._prepareConnection()}};b.prototype._prepareConnection=function(){this.ROOM_NAME=location.pathname.slice(1).toLowerCase();return __Controller.Socket.initialize()};return b}(Monocle.Controller);$(function(){__Controller.Url=new a("body");return __Controller.Url.initialize()})}).call(this);