// Generated by CoffeeScript 1.7.1
(function() {
  module.exports = function(io, cookieParser, sessionStore, EXPRESS_SID_KEY, COOKIE_SECRET, sio) {
    io.set("authorization", function(data, callback) {
      if (!data.headers.cookie) {
        return callback("No cookie transmitted.", false);
      }
      cookieParser(data, {}, function(parseErr) {
        var sidCookie;
        if (parseErr) {
          return callback("Error parsing cookies.", false);
        }
        sidCookie = (data.secureCookies && data.secureCookies[EXPRESS_SID_KEY]) || (data.signedCookies && data.signedCookies[EXPRESS_SID_KEY]) || (data.cookies && data.cookies[EXPRESS_SID_KEY]);
        if (sidCookie) {
          sidCookie = sidCookie.slice(2).split(".")[0];
        }
        sessionStore.load(sidCookie, function(err, session) {
          if (err || !session || session.isLogged !== true) {
            callback("Not logged in.", false);
          } else {
            data.session = session;
            callback(null, true);
          }
        });
      });
    });
    io.on("connection", function(socket) {
      var hs, user;
      hs = socket.handshake;
      user = hs.session.user;
      if (!hs.session.notifLog) {
        if (hs.session.newUser) {
          sio.glob("fa fa-user", " <a href=\"/u/" + user.idCool + "\">" + user.local.pseudo + "</a> joined the community!");
        } else {
          sio.glob("glyphicon glyphicon-log-in", " <a href=\"/u/" + user.idCool + "\">" + user.local.pseudo + "</a> connected");
        }
        hs.session.notifLog = true;
        hs.session.save();
      }
      socket.set("nickname", user.local.pseudo);
      socket.on("just happened", function(data) {
        socket.get("nickname", function(err, name) {
          sio.glob(data.icon, data.event);
        });
      });
    });
  };

}).call(this);
