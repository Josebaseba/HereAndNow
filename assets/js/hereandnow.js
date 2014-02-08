/* hereandnow v0.0.1 - 2/8/2014
   http://josebaseba.com
   Copyright (c) 2014  - Licensed  */
(function(){var a,b=[].indexOf||function(a){for(var b=0,c=this.length;b<c;b++){if(b in this&&this[b]===a)return b}return-1};window.HAN=a=function(){var a,c,d,e,f,g,h,i;g="http://localhost:1337/socket";d="GUEST";a=["#F78181","#FA8258","#FA5882","#F6CED8","#F6CEF5","#D8CEF6","#A9F5E1","#A5DF00","#D0FA58"];e={SIZE:{WIDTH:500,HEIGHT:400},EXTENSIONS:["jpg","jpeg","bmp","png","gif"]};f={LINK:/([^"']|^)(ftp|http|https):\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/gi,NAME:/[^a-z0-9]/gi};c="#81DAF5";i=function(a){return a.replace(f.NAME,"")};h=function(a){a=a.replace(f.LINK,function(a){var c,d,f,g,h,i;a=a.trim().replace(/\s/g,"");h=/([^"']|^)(http|https):\/\/(www\.youtube\.com\/|youtu\.be\/)[\w=&\?]+/gi;g=/([^"']|^)(http|https):\/\/(www\.vimeo\.com\/|vimeo\.com\/)[\w=&\?]+/gi;if(h.test(a)){f=/^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/;d=a.match(f);return'<iframe width="'+e.SIZE.WIDTH+'" height="'+e.SIZE.HEIGHT+'" src="//www.youtube.com/embed/'+d[3]+'" frameborder="0" allowfullscreen></iframe>'}else if(g.test(a)){return'<iframe src="//player.vimeo.com/video/'+a.split("/")[3]+'" width="'+e.SIZE.WIDTH+'" height="'+e.SIZE.HEIGHT+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'}else{c=a.split(".").pop();if(i=c.toString(),b.call(e.EXTENSIONS,i)>=0){return'<img src="'+a+'" width="'+e.SIZE.WIDTH+'" height="'+e.SIZE.HEIGHT+'">'}else{return' <a href="'+a.replace(/\s/g,"")+'" target="_blank">'+a+"</a> "}}});return a};return{SOCKET_URL:g,DEFAULT_COLOR:c,DEFAULT_NAME:d,COLORS:a,parseName:i,parseMessages:h}}()}).call(this);(function(){var a={}.hasOwnProperty,b=function(b,c){for(var d in c){if(a.call(c,d))b[d]=c[d]}function e(){this.constructor=b}e.prototype=c.prototype;b.prototype=new e;b.__super__=c.prototype;return b};__Model.Message=function(a){b(c,a);function c(){return c.__super__.constructor.apply(this,arguments)}c.fields("owner","content");return c}(Monocle.Model)}).call(this);(function(){var a={}.hasOwnProperty,b=function(b,c){for(var d in c){if(a.call(c,d))b[d]=c[d]}function e(){this.constructor=b}e.prototype=c.prototype;b.prototype=new e;b.__super__=c.prototype;return b};__Model.User=function(a){b(c,a);function c(){return c.__super__.constructor.apply(this,arguments)}c.fields("name","color");return c}(Monocle.Model)}).call(this);(function(){var a={}.hasOwnProperty,b=function(b,c){for(var d in c){if(a.call(c,d))b[d]=c[d]}function e(){this.constructor=b}e.prototype=c.prototype;b.prototype=new e;b.__super__=c.prototype;return b};__View.Message=function(a){var c;b(d,a);c=null;d.prototype.container="article#message-list ul";d.prototype.template='<li style="background-color: {{owner.color}}" class="padding">\n  {{^same_user}}\n  <strong class="text big normal block">{{owner.name}}</strong>\n  {{/same_user}}\n  <span class="text book">{{{content}}}</span>\n</li>';function d(){d.__super__.constructor.apply(this,arguments);this._parseModel();this._parseContent();this.append(this.model)}d.prototype._parseModel=function(){if(c!=null&&this.model.owner.name===c.owner.name){return this.model.same_user=true}else{return c=this.model}};d.prototype._parseContent=function(){return this.model.content=HAN.parseMessages(this.model.content)};return d}(Monocle.View)}).call(this);(function(){var a,b={}.hasOwnProperty,c=function(a,c){for(var d in c){if(b.call(c,d))a[d]=c[d]}function e(){this.constructor=a}e.prototype=c.prototype;a.prototype=new e;a.__super__=c.prototype;return a};a=function(a){c(b,a);b.prototype.elements={"header h2#chat-name":"chat_name","textarea#message":"message","input#username":"username"};b.prototype.events={"keyup textarea#message":"onKeyUpMessage","keyup input#username":"onKeyUpUsername"};function b(){b.__super__.constructor.apply(this,arguments);this.chat_name.text(this._roomName())}b.prototype.sendMessage=function(){if(this.message.val().trim()!==""){__Controller.Socket.send(this.message.val().trim());this.message.val("");return this._resizeInput(false)}};b.prototype.onKeyUpMessage=function(a){if(this.message.val().length>60){this._resizeInput()}if(a.keyCode===13){return this.sendMessage()}};b.prototype.onKeyUpUsername=function(a){var b;if(a.keyCode===13&&this.username.val().trim()!==""){b=HAN.parseName(this.username.val().trim());if(b.length<=25&&b!==HAN.DEFAULT_NAME){__Controller.Socket.setName(b);return this._prepareMessageInput()}}};b.prototype._roomName=function(){return location.pathname.slice(1).toLowerCase()};b.prototype._prepareMessageInput=function(){this.username.hide();this.message.show();return this.message.focus()};b.prototype._resizeInput=function(a){if(a==null){a=true}if(a){return this.message.css("height","100px")}else{return this.message.css("height","54px")}};return b}(Monocle.Controller);$(function(){return __Controller.Chat=new a("section[data-control=chat]")})}).call(this);(function(){var a,b={}.hasOwnProperty,c=function(a,c){for(var d in c){if(b.call(c,d))a[d]=c[d]}function e(){this.constructor=a}e.prototype=c.prototype;a.prototype=new e;a.__super__=c.prototype;return a};a=function(a){c(b,a);b.prototype.elements={"input#room-name":"room_name","button#start":"btn_start"};b.prototype.events={"click button#start":"onStart","keyup input#room-name":"onKeyUp"};function b(){b.__super__.constructor.apply(this,arguments)}b.prototype.onStart=function(){var a;if(this.room_name.val().trim()!==""&&this.room_name.length<=128){a=HAN.parseName(this.room_name.val().trim().toLowerCase());return window.location.href=a}};b.prototype.onKeyUp=function(a){if(a.keyCode===13){return this.onStart()}};return b}(Monocle.Controller);$(function(){return __Controller.Main=new a("section[data-control=main]")})}).call(this);(function(){var a,b=function(a,b){return function(){return a.apply(b,arguments)}},c={}.hasOwnProperty,d=function(a,b){for(var d in b){if(c.call(b,d))a[d]=b[d]}function e(){this.constructor=a}e.prototype=b.prototype;a.prototype=new e;a.__super__=b.prototype;return a};a=function(a){var c,e;d(f,a);function f(){this.onNewUserJoined=b(this.onNewUserJoined,this);this.onUserConnection=b(this.onUserConnection,this);this.onUserDisconnection=b(this.onUserDisconnection,this);this.onConnectedToRoom=b(this.onConnectedToRoom,this);this.onError=b(this.onError,this);this.onMessage=b(this.onMessage,this);return f.__super__.constructor.apply(this,arguments)}c=null;f.prototype.socket_events=["error","connectedToRoom","message","userDisconnection","userConnection","newUserJoined"];f.prototype.initialize=function(){var a,b,c,d;this.socket=io.connect(HAN.SOCKET_URL);d=this.socket_events;for(b=0,c=d.length;b<c;b++){a=d[b];this.socket.on(a,this["on"+(a.charAt(0).toUpperCase()+a.slice(1))])}return this.connectToRoom()};f.prototype.connectToRoom=function(){if(__Controller.Url.ROOM_NAME){return this.socket.emit("connectToRoom",__Controller.Url.ROOM_NAME)}};f.prototype.setName=function(a){c=a;return this.socket.emit("setName",c)};f.prototype.send=function(a){if(c!=null){return this.socket.emit("message",a)}};f.prototype.onMessage=function(a){if(a!=null){this._createMessageModel(a);return $("html, body").animate({scrollTop:$(document).height()})}};f.prototype.onError=function(a){return console.error(a,"ERROR")};f.prototype.onConnectedToRoom=function(a,b){var c,d,e,f,g,h;if(b!=null){for(e=0,g=b.length;e<g;e++){d=b[e];this._createUserModel(d)}}if(a!=null){for(f=0,h=a.length;f<h;f++){c=a[f];this._createMessageModel(c)}}return $("html, body").animate({scrollTop:$(document).height()},1e3)};f.prototype.onUserDisconnection=function(a){var b;console.log(a,"DISCONNECTED");b=__Model.User.findBy("name",a);if(b!=null){return b.destroy()}};f.prototype.onUserConnection=function(a){this._createUserModel(a);return console.log(a,"CONNECTED")};f.prototype.onNewUserJoined=function(a){var b;b=__Model.User.findBy("name",HAN.DEFAULT_NAME);if(b!=null){b.destroy()}this._createUserModel(a);return console.log(a,"USERJOINED")};f.prototype._createUserModel=function(a){var b;b={name:a,color:e()};return __Model.User.create(b)};f.prototype._createMessageModel=function(a){var b;b=__Model.User.findBy("name",a.owner);if(b!=null){a.owner=b}else{a.owner={name:a.owner,color:HAN.DEFAULT_COLOR}}return new __View.Message({model:__Model.Message.create(a)})};e=function(){return HAN.COLORS[Math.floor(Math.random()*HAN.COLORS.length)]};return f}(Monocle.Controller);$(function(){return __Controller.Socket=new a("body")})}).call(this);(function(){var a,b={}.hasOwnProperty,c=function(a,c){for(var d in c){if(b.call(c,d))a[d]=c[d]}function e(){this.constructor=a}e.prototype=c.prototype;a.prototype=new e;a.__super__=c.prototype;return a};a=function(a){c(b,a);function b(){return b.__super__.constructor.apply(this,arguments)}b.prototype.ROOM_NAME=null;b.prototype.initialize=function(){if(location.pathname!=="/"){return this._prepareConnection()}};b.prototype._prepareConnection=function(){this.ROOM_NAME=location.pathname.slice(1).toLowerCase();return __Controller.Socket.initialize()};return b}(Monocle.Controller);$(function(){__Controller.Url=new a("body");return __Controller.Url.initialize()})}).call(this);