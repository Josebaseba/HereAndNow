"use strict"
Yoi   = require "yoi"

module.exports = (server) ->

  server.get "/", (request, response, next) ->
    site = new Yoi.Site request, response
    site.template "index", {}

  server.get "/:name", (request, response, next) ->
    site = new Yoi.Site request, response
    site.template "chat", {}
