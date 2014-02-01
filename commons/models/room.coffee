"use strict"
Yoi             = require "yoi"
Schema          = Yoi.Mongoose.Schema
ObjectId        = Schema.ObjectId
db              = Yoi.Mongo.connections.primary

Room = new db.Schema
  name            : type: String, required: true
  allowedUsers    : [type: String]
  persistent      : type: Boolean, required: true, default: false
  type            : type: String, required: true, default: "public"
  created_at      : type: Date, default: Date.now

Room.statics.create = (parameters) ->
  promise = new Yoi.Hope.Promise()
  room = db.model "Room", Room
  new room(parameters).save (error, result) -> promise.done error, result
  promise

Room.statics.delete = (name) ->
  promise = new Yoi.Hope.Promise()
  @findOneAndRemove(name: name).exec (error, result) -> promise.done error, result
  promise

Room.statics.findBy = (filter) ->
  promise = new Yoi.Hope.Promise()
  @findOne(filter).exec (error, result) -> promise.done error, result
  promise

module.exports = db.model "Room", Room