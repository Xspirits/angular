// Generated by CoffeeScript 1.7.1
(function() {
  var COOKIE_SECRET, EXPRESS_SID_KEY, app, challenge, configDB, cookieParser, express, flash, games, genUID, http, img, io, ladder, moment, mongoose, notifs, passport, path, port, redis, relations, scheduler, server, sessionStore, sio, social, socket, users, xp, _;

  express = require("express");

  http = require("http");

  socket = require("socket.io");

  EXPRESS_SID_KEY = "chachompcha.sid";

  COOKIE_SECRET = "oneDoesNotSimplychompi";

  cookieParser = express.cookieParser(COOKIE_SECRET);

  sessionStore = new express.session.MemoryStore();

  app = express();

  server = http.createServer(app);

  io = socket.listen(server);

  io.set("log level", 1);

  redis = require("redis");

  port = process.env.PORT || 8080;

  mongoose = require("mongoose");

  passport = require("passport");

  path = require("path");

  moment = require("moment");

  flash = require("connect-flash");

  scheduler = require("node-schedule");

  genUID = require("shortid");

  _ = require("underscore");

  configDB = require("./config/database.js");

  challenge = require("./config/challenge");

  users = require("./config/users");

  relations = require("./config/relations");

  games = require("./config/game");

  social = require("./config/social");

  ladder = require("./config/ladder");

  img = require("./config/img");

  notifs = require("./app/functions/notifications.js");

  sio = require("./app/functions/sio.js")(io);

  xp = require("./app/functions/xp.js")(sio);

  genUID.seed(664);

  mongoose.connect(configDB.url);

  require("./config/passport")(passport, genUID, xp, notifs);

  app.configure(function() {
    app.use(express.logger("dev"));
    app.use(express.bodyParser());
    app.use(cookieParser);
    app.set("view engine", "ejs");
    app.use(express.session({
      secret: "jekingIsnotHereDamnIt",
      store: sessionStore,
      cookie: {
        httpOnly: true
      },
      key: EXPRESS_SID_KEY
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.compress());
    app.use(express["static"](path.join(__dirname, "public"), {
      maxAge: 2592000000
    }));
    app.use(flash());
  });

  require("./app/routes")(app, _, sio, passport, genUID, xp, notifs, moment, challenge, users, relations, games, social, ladder, img);

  require("./app/schedule")(scheduler, ladder);

  server.listen(port);

  require("./app/io")(io, cookieParser, sessionStore, EXPRESS_SID_KEY, COOKIE_SECRET, sio);

  console.log("I challenge you to watch on port " + port);

}).call(this);
