"use strict"
Yoi             = require "yoi"
Schema          = Yoi.Mongoose.Schema
ObjectId        = Schema.ObjectId
db              = Yoi.Mongo.connections.primary

Message = new db.Schema
  room    : type: Schema.ObjectId, ref: "Room"
  content : type: String, required: true
  owner   : type: String, required: true

Message.statics.create = (parameters) ->
  promise = new Yoi.Hope.Promise()
  message = db.model "Message", Message
  new message(parameters).save (error, result) -> promise.done error, result
  promise

Message.statics.deleteByRoom = (room) ->
  promise = new Yoi.Hope.Promise()
  @remove(room: room).exec (error, result) -> promise.done error, result
  promise

Message.statics.findBy = (filter) ->
  promise = new Yoi.Hope.Promise()
  @find(filter, "-_id content owner").exec (error, result) -> promise.done error, result
  promise

module.exports = db.model "Message", Message