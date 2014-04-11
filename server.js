// Generated by CoffeeScript 1.7.1
(function() {
  var COOKIE_SECRET, EXPRESS_SID_KEY, app, appKeys, challenge, configDB, cookieParser, express, flash, games, genUID, google, http, io, ladder, mailer, mandrill, mandrill_client, moment, mongoose, nodemailer, notifs, passport, path, port, redis, relations, scheduler, server, sessionStore, sio, social, socket, users, xp, _;

  express = require("express");

  http = require("http");

  socket = require("socket.io");

  appKeys = require("./config/auth");

  EXPRESS_SID_KEY = appKeys.express_sid_key;

  COOKIE_SECRET = appKeys.cookie_secret;

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

  moment = require('moment-timezone');

  mandrill = require('mandrill-api/mandrill');

  nodemailer = require("nodemailer");

  flash = require("connect-flash");

  scheduler = require("node-schedule");

  genUID = require("shortid");

  _ = require("underscore");

  moment().tz("Europe/London").format();

  genUID.seed(664);

  mandrill_client = new mandrill.Mandrill(appKeys.mandrill_key);

  configDB = require("./config/database");

  challenge = require("./config/challenge");

  users = require("./config/users");

  relations = require("./config/relations");

  games = require("./config/game");

  social = require("./config/social");

  ladder = require("./config/ladder");

  mailer = require("./config/mailer")(mandrill_client, nodemailer, appKeys, moment);

  google = require("./config/google");

  notifs = require("./app/functions/notifications");

  sio = require("./app/functions/sio")(io);

  xp = require("./app/functions/xp")(sio);

  mongoose.connect(configDB.url);

  require("./config/passport")(passport, mailer, genUID, xp, notifs, google);

  app.configure(function() {
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
    app.use(express.logger("dev"));
    return app.use(flash());
  });

  require("./app/routes")(app, mailer, _, sio, passport, genUID, xp, notifs, moment, challenge, users, relations, games, social, ladder, google);

  require("./app/schedule")(scheduler, mailer, _, sio, ladder, moment, social, appKeys, xp, notifs);

  server.listen(port);

  require("./app/io")(io, mailer, cookieParser, sessionStore, EXPRESS_SID_KEY, COOKIE_SECRET, sio);

  console.log('===========================================================');

  console.log("I challenge you to watch on port " + port);

  console.log('Current Application time : ' + moment().format());

  console.log('===========================================================');

}).call(this);
