module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    meta:
      assets  : "assets",
      temp    : "build",
      banner  : """
        /* <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("m/d/yyyy") %>
           <%= pkg.homepage %>
           Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - Licensed <%= _.pluck(pkg.license, "type").join(", ") %> */

        """
    # =========================================================================

    source:
      site:
        coffee: [
          "src/monocle/*.coffee",
          "src/monocle/models/*.coffee",
          "src/monocle/views/*.coffee",
          "src/monocle/controllers/*.coffee"]
        stylus: [
          "src/stylesheets/tuktuk.*.styl"]

    components:
      site:
        js: [
          "src/bower_components/jquery/jquery.js",
          "src/bower_components/monocle/monocle.js",
          "src/bower_components/hope/hope.js",
          "src/bower_components/tuktuk/tuktuk.js",
          "src/bower_components/pickadate/lib/picker.js",
          "src/bower_components/pickadate/lib/picker.date.js",
          "src/bower_components/moment/moment.js",
          "src/bower_components/favico.js/favico.min.js",
          "src/bower_components/socket.io/socket.io.js"]
        css: [
          "src/bower_components/tuktuk/tuktuk.css",
          "src/bower_components/tuktuk/tuktuk.theme.css",
          "src/bower_components/tuktuk/tuktuk.icons.css",
          "src/bower_components/pickadate/lib/themes/classic.css",
          "src/bower_components/pickadate/lib/themes/classic.date.css"]

    # =========================================================================
    coffee:
      site  : files: "<%=meta.temp%>/<%=pkg.name%>.debug.js"  : "<%= source.site.coffee %>"

    uglify:
      options: compress: false, banner: "<%= meta.banner %>"
      site  : files: "<%=meta.assets%>/js/<%=pkg.name%>.js"   : "<%=meta.temp%>/<%=pkg.name%>.debug.js"

    stylus:
      options: compress: true, import: [ '__init']
      site  : files: "<%=meta.assets%>/css/<%=pkg.name%>.css" : "<%=source.site.stylus%>"

    concat:
      site_js   : src: "<%= components.site.js %>", dest: "<%=meta.assets%>/js/<%=pkg.name%>.components.js"
      site_css  : src: "<%= components.site.css %>", dest: "<%=meta.assets%>/css/<%=pkg.name%>.components.css"

    # =========================================================================
    watch:
      coffee_site:
        files: ["<%= source.site.coffee %>"]
        tasks: ["coffee:site", "uglify:site"]
      stylus_site:
        files: ["<%= source.site.stylus %>"]
        tasks: ["stylus:site"]
      components_site:
        files: ["<%= components.site.js %>", "<%= components.site.css %>"]
        tasks: ["concat:site_js", "concat:site_css"]

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-stylus"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-watch"

  grunt.registerTask "default", [ "concat", "coffee", "uglify", "stylus"]
