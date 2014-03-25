// Generated by CoffeeScript 1.7.1
(function() {
  var moment;

  moment = require("moment");

  module.exports = function(io) {
    return {
      glob: function(icon, text, desc) {
        io.sockets.emit("globalevent", {
          icon: (icon ? icon : "fa fa-circle-o"),
          message: text,
          desc: (desc ? desc : ""),
          date: new Date
        });
      }
    };
  };

}).call(this);
