// Generated by CoffeeScript 1.7.1
(function() {
  var isLoggedIn;

  isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  };

  module.exports = function(app, _, sio, passport, genUID, xp, notifs, moment, challenge, users, relations, games, social, ladder, shortUrl) {
    app.get("/", function(req, res) {
      if (req.isAuthenticated()) {
        return res.render("index_logged.ejs", {
          currentUser: req.user
        });
      } else {
        return res.render('index.ejs', {
          currentUser: false
        });
      }
    });
    app.get("/discover", function(req, res) {
      var ua;
      if (req.isAuthenticated()) {
        return res.render("discover.ejs", {
          currentUser: req.user
        });
      } else {
        ua = req.header('user-agent');
        if (/mobile/i.test(ua)) {
          return res.render('discover_mobile.ejs', {
            currentUser: false
          });
        } else {
          return res.render('discover.ejs', {
            currentUser: false
          });
        }
      }
    });
    app.get("/eval/:hash", function(req, res) {
      var hash;
      hash = req.params.hash;
      return users.validateEmail(hash, function(result) {
        if (result) {
          return res.redirect("/login");
        } else {
          return res.redirect("/");
        }
      });
    });
    app.get("/logout", isLoggedIn, function(req, res) {
      notifs.logout(req.user);
      sio.glob("glyphicon glyphicon-log-out", req.user.local.pseudo + " disconnected");
      return users.setOffline(req.user, function(result) {
        if (result) {
          req.session.notifLog = false;
          req.session.isLogged = false;
          req.logout();
          return res.redirect("/");
        }
      });
    });
    app.get("/friends", isLoggedIn, function(req, res) {
      return users.getFriendList(req.user._id, function(fList) {
        xp.updateDaily(function(result) {
          return console.log(result);
        });
        return res.render("friendList.ejs", {
          currentUser: req.user,
          friends: fList.friends
        });
      });
    });
    app.get("/profile", isLoggedIn, function(req, res) {
      return res.render("profile.ejs", {
        currentUser: req.user
      });
    });
    app.get("/settings", isLoggedIn, function(req, res) {
      return res.render("setting.ejs", {
        currentUser: req.user
      });
    });
    app.get("/request", isLoggedIn, function(req, res) {
      return challenge.challengerRequests(req.user._id, function(dataChallenger) {
        return challenge.challengedRequests(req.user._id, function(dataChallenged) {
          var obj;
          obj = {
            sent: dataChallenger,
            request: dataChallenged
          };
          return res.render("request.ejs", {
            currentUser: (req.isAuthenticated() ? req.user : false),
            challenges: obj
          });
        });
      });
    });
    app.get("/tribunal", isLoggedIn, function(req, res) {
      return challenge.userWaitingCases(req.user, function(data) {
        return res.render("tribunal.ejs", {
          currentUser: req.user,
          cases: data
        });
      });
    });
    app.get("/t/:id", isLoggedIn, function(req, res) {
      var id;
      return id = req.params.id;
    });
    app.get("/o/:id", function(req, res) {
      var id;
      id = req.params.id;
      return challenge.ongoingDetails(id, function(data) {
        return res.render("ongoingDetails.ejs", {
          currentUser: (req.isAuthenticated() ? req.user : false),
          user: req.user,
          ongoing: data
        });
      });
    });
    app.get("/ongoing", isLoggedIn, function(req, res) {
      return challenge.userAcceptedChallenge(req.user._id, function(data) {
        var cStart, eStart, endedChall, ongoingChall, reqValidation, upcomingChall;
        cStart = void 0;
        eStart = void 0;
        upcomingChall = [];
        ongoingChall = [];
        endedChall = [];
        reqValidation = [];
        _.each(data, function(value, key) {
          var cEnd;
          cStart = data[key].launchDate;
          cEnd = data[key].deadLine;
          if (moment(cEnd).isSame() || moment(cEnd).isBefore()) {
            console.log(moment(cEnd).isSame() || moment(cEnd).isBefore());
            console.log(data[i].idCool);
            challenge.crossedDeadline(data[i]._id);
            return endedChall.push(data[i]);
          } else if (data[i].waitingConfirm === true && data[i].progress < 100) {
            reqValidation.push(data[i]);
            return console.log("parsed reqValidation : " + data[i].waitingConfirm);
          } else if (!moment(cStart).isBefore() && !moment(cEnd).isBefore() && data[i].progress < 100) {
            upcomingChall.push(data[i]);
            return console.log("parsed upcoming : " + data[i]._id);
          } else if (moment(cStart).isBefore() && !moment(cEnd).isBefore() && data[i].progress < 100) {
            ongoingChall.push(data[i]);
            return console.log("parsed ongoing : " + data[i]._id);
          }
        });
        return res.render("ongoing.ejs", {
          currentUser: req.user,
          toValidate: reqValidation,
          upChallenges: upcomingChall,
          onChallenges: ongoingChall,
          endChallenges: endedChall
        });
      });
    });
    app.get("/challenges", function(req, res) {
      return challenge.getList(function(list) {
        return res.render("challenges.ejs", {
          currentUser: (req.isAuthenticated() ? req.user : false),
          challenges: list
        });
      });
    });
    app.get("/c/:id", function(req, res) {
      var cId;
      cId = req.params.id;
      return challenge.getChallenge(cId, function(data) {
        return res.render("challengeDetails.ejs", {
          currentUser: (req.isAuthenticated() ? req.user : false),
          challenge: data
        });
      });
    });
    app.get("/newChallenge", isLoggedIn, function(req, res) {
      return res.render("newChallenge.ejs", {
        currentUser: req.user,
        challenge: false
      });
    });
    app.post("/newChallenge", isLoggedIn, function(req, res) {
      return challenge.create(req, function(done) {
        notifs.createdChallenge(req.user, done.idCool);
        xp.xpReward(req.user, "challenge.create");
        sio.glob("fa fa-plus-square-o", "<a href=\"/u/" + req.user.idCool + "\" title=\"" + req.user.local.pseudo + "\">" + req.user.local.pseudo + "</a> created a <a href=\"/c/" + done.idCool + "\" title=\"" + done.title + "\">new challenge</a>.");
        return res.render("newChallenge.ejs", {
          currentUser: req.user,
          challenge: done
        });
      });
    });
    app.post("/validateChallenge", isLoggedIn, function(req, res) {
      var data;
      data = {
        oId: req.body.id,
        pass: req.body.pass
      };
      if (typeof data.pass === "boolean" || data.pass instanceof Boolean) {
        return challenge.validateOngoing(data, function(done) {
          var ioText, message, obj, twitt;
          if (data.pass === true) {
            obj = {
              id: done._idChallenge._id,
              _idChallenged: done._idChallenged._id,
              _idChallenger: done._idChallenger._id
            };
            xp.xpReward(done._idChallenger, "ongoing.validate");
            xp.xpReward(done._idChallenged, "ongoing.succeed", done._idChallenge.value);
            ioText = "<a href=\"/c/" + done._idChallenged.idCool + "\" title=\"" + done._idChallenged.local.pseudo + "\">" + done._idChallenged.local.pseudo + "</a> completed the challenge <a href=\"/c/" + done._idChallenge.idCool + "\" title=\"" + done._idChallenge.title + "\">" + done._idChallenge.title + "</a>!";
            sio.glob("glyphicon glyphicon-tower", ioText);
            notifs.successChall(done);
            if (done._idChallenged.share.twitter === true && done._idChallenged.twitter.token) {
              twitt = "I just completed a challenge (http://goo.gl/gskvYu) on Challenge your Friends! Join me now @cyf_app #challenge";
              social.postTwitter(req.user.twitter, twitt, function(data) {
                var text;
                text = "<a href=\"/u/" + done._idChallenged.idCool + "\" title=\"" + done._idChallenged.local.pseudo + "\">" + done._idChallenged.local.pseudo + "</a> shared his success on <a target=\"_blank\" href=\"https://twitter.com/" + data.user.screen_name + "/status/" + data.id_str + "\" title=\"see tweet\">@twitter</a>.";
                sio.glob("fa fa-twitter", text);
                return ladder.actionInc(req.user, "twitter");
              });
            }
            if (done._idChallenged.share.facebook === true && done._idChallenged.facebook.token) {
              message = {
                title: "I won a challenge threw by " + done._idChallenger.local.pseudo + "!",
                body: "Hurray! I just completed the challenge \"" + done.title + "\"\"  on Challenge Your friends! I won " + xp.getValue("ongoing.succeed") + "XP! http://localhost:8080/o/" + done.idCool
              };
              social.postFbMessage(done._idChallenged.facebook.token, message, "http://localhost:8080/o/" + done.idCool, function(data) {
                var text;
                text = "<a href=\"/u/" + done._idChallenged.idCool + "\" title=\"" + done._idChallenged.local.pseudo + "\">" + done._idChallenged.local.pseudo + "</a> shared his success on facebook.";
                sio.glob("fa fa-facebook", text);
                return ladder.actionInc(req.user, "facebook");
              });
            }
            return users.askRate(obj, function(done) {
              return res.send(done);
            });
          } else {
            return res.send(true);
          }
        });
      } else {
        return res.send(false, "not a boolean");
      }
    });
    app.get("/rateChallenges", isLoggedIn, function(req, res) {
      return users.userToRateChallenges(req.user._id, function(data) {
        return res.render("rateChallenge.ejs", {
          currentUser: req.user,
          challenge: data
        });
      });
    });
    app.get("/myChallenges", isLoggedIn, function(req, res) {
      return challenge.getUserChallenges(req.user._id, function(data) {
        return res.render("myChallenges.ejs", {
          currentUser: req.user,
          challenges: data
        });
      });
    });
    app.get("/removeChallenge/:id", isLoggedIn, function(req, res) {
      var data;
      data = {
        id: req.params.id,
        user: req.user
      };
      return challenge["delete"](data, function(returned) {
        return res.redirect('/myChallenges');
      });
    });
    app.get("/launchChallenge", isLoggedIn, function(req, res) {
      return challenge.getList(function(challenges) {
        return users.getUser(req.user.idCool, function(thisUser) {
          console.log(thisUser.friends);
          return res.render("launchChallenge.ejs", {
            currentUser: req.user,
            userList: thisUser.friends,
            challenges: challenges
          });
        });
      });
    });
    app.post("/launchChallenge", isLoggedIn, function(req, res) {
      var data;
      data = {
        from: req.user._id,
        idChallenged: req.body.idChallenged,
        idChallenge: req.body.idChallenge,
        deadLine: req.body.deadLine,
        launchDate: req.body.launchDate
      };
      notifs.launchChall(data.from, data.idChallenged);
      return challenge.launch(data, function(result) {
        return res.send(true);
      });
    });
    app.post("/validationRequest", isLoggedIn, function(req, res) {
      return shortUrl.googleUrl(req.body.proofLink1, function(imgUrl1) {
        var data;
        console.log("\nuploaded %s to %s", req.body.proofLink1, imgUrl1);
        if (req.body.proofLink2) {
          return shortUrl.googleUrl(req.body.proofLink2, function(imgUrl2) {
            var data;
            console.log("\nuploaded %s to %s", req.body.proofLink2, imgUrl2);
            data = {
              idUser: req.user._id,
              idChallenge: req.body.idChallenge,
              proofLink1: imgUrl1,
              proofLink2: imgUrl2,
              confirmComment: req.body.confirmComment
            };
            console.log(data);
            return challenge.requestValidation(data, function(result) {
              return res.send(result);
            });
          });
        } else {
          data = {
            idUser: req.user._id,
            idChallenge: req.body.idChallenge,
            proofLink1: imgUrl1,
            proofLink2: '',
            confirmComment: req.body.confirmComment
          };
          console.log(data);
          return challenge.requestValidation(data, function(result) {
            return res.send(result);
          });
        }
      });
    });
    app.get("/users", function(req, res) {
      return users.getUserList(function(returned) {
        return res.render("userList.ejs", {
          currentUser: (req.isAuthenticated() ? req.user : false),
          users: returned
        });
      });
    });
    app.get("/leaderboard", function(req, res) {
      return users.getLeaderboards("score", function(returned) {
        return res.render("leaderBoard.ejs", {
          currentUser: (req.isAuthenticated() ? req.user : false),
          ranking: returned
        });
      });
    });
    app.get("/u/:id", function(req, res) {
      return users.getUser(req.params.id, function(returned) {
        console.log(returned);
        return res.render("userDetails.ejs", {
          currentUser: (req.isAuthenticated() ? req.user : false),
          user: returned
        });
      });
    });
    app.get("/search_game", function(req, res) {
      var lookFor;
      lookFor = req.query["term"];
      return games.regexFind(lookFor, function(returned) {
        return res.send(returned.data, {
          "Content-Type": "application/json"
        }, returned.go);
      });
    });
    app.get("/unlink/game_lol", isLoggedIn, function(req, res) {
      return users.unlinkLol(req.user._id, function(result) {
        console.log(result);
        return res.redirect("/settings");
      });
    });
    app.post("/linkLol", isLoggedIn, function(req, res) {
      var obj;
      obj = {
        _id: req.user._id,
        region: req.body.region,
        summonerName: req.body.summonerName
      };
      return users.linkLol(obj, function(result) {
        if (result === true) {
          xp.xpReward(req.user, "connect.game");
          notifs.linkedGame(req.user, "League of Legend");
          return res.send(true);
        } else {
          return res.send(false);
        }
      });
    });
    app.post("/updateSettings", isLoggedIn, function(req, res) {
      var obj;
      obj = {
        _id: req.user._id,
        target: req.body.target,
        value: req.body.value
      };
      return users.updateSettings(obj, function(result) {
        return res.send(true);
      });
    });
    app.post("/markNotifRead", isLoggedIn, function(req, res) {
      var obj;
      obj = {
        idUser: req.user._id,
        del: req.body.del,
        idNotif: req.body.id
      };
      console.log('markNotifRead');
      return notifs.markRead(obj, function(result) {
        console.log(result);
        return res.send(true);
      });
    });
    app.post("/sendTribunal", isLoggedIn, function(req, res) {
      var obj;
      obj = {
        idUser: req.user._id,
        id: req.body.id
      };
      return challenge.sendTribunal(obj, function(result) {
        return res.send(true);
      });
    });
    app.post("/rateChallenges", isLoggedIn, function(req, res) {
      var obj;
      obj = {
        id: req.body.id,
        idUser: req.user._id,
        difficulty: req.body.difficulty,
        quickness: req.body.quickness,
        fun: req.body.fun
      };
      return challenge.rateChallenge(obj, function(data) {
        xp.xpReward(req.user, "challenge.rate");
        notifs.ratedChall(data);
        return res.send(true);
      });
    });
    app.post("/voteCase", isLoggedIn, function(req, res) {
      var obj;
      obj = {
        id: req.body.id,
        idUser: req.user._id,
        answer: req.body.answer
      };
      return challenge.voteCase(obj, function(result) {
        xp.xpReward(req.user, "tribunal.vote");
        return challenge.remainingCaseVotes(obj.id, function(counter) {
          if (counter === 0) {
            return challenge.completeCase(obj.id, function(cases) {
              var ioText;
              obj = {
                id: cases._idChallenge,
                _idChallenged: cases._idChallenged,
                _idChallenger: cases._idChallenger
              };
              notifs.caseClosed(cases);
              if (cases.tribunalAnswered === true) {
                ioText = " The tribunal validated the case <a href=\"/c/" + cases.idCool + "\" title=\"" + cases._idChallenge.title + "\">" + cases.idCool + "</a> for <a href=\"/c/" + cases._idChallenged.idCool + "\" title=\"" + cases._idChallenged.local.pseudo + "\">" + cases._idChallenged.local.pseudo + "</a>.";
                sio.glob("fa fa-legal", ioText);
              }
              users.askRate(obj, function(done) {
                res.send(true);
              });
            });
          } else {
            return res.send(true);
          }
        });
      });
    });
    app.post("/askFriend", isLoggedIn, function(req, res) {
      var idCoolFriend, idFriend, nameFriend, obj;
      idFriend = req.body.id;
      idCoolFriend = req.body.idCool;
      nameFriend = req.body.pseudo;
      obj = {
        from: {
          id: req.user._id,
          idCool: req.user.idCool,
          userName: req.user.local.pseudo
        },
        to: {
          id: idFriend,
          idCool: idCoolFriend,
          userName: nameFriend
        }
      };
      notifs.askFriend(req.user, obj.to);
      return users.askFriend(obj, function(result) {
        return res.send(true);
      });
    });
    app.post("/confirmFriend", isLoggedIn, function(req, res) {
      var idFriend, nameFriend, obj;
      idFriend = req.body.id;
      nameFriend = req.body.pseudo;
      obj = {
        from: {
          id: idFriend,
          userName: nameFriend
        },
        to: {
          id: req.user._id,
          userName: req.user.local.pseudo
        }
      };
      return relations.acceptRelation(obj.from, obj.to, function(result) {
        xp.xpReward(result[0], "user.newFriend");
        xp.xpReward(result[1], "user.newFriend");
        notifs.nowFriends(result);
        sio.glob("fa fa-users", "<a href=\"/u/" + result[0].idCool + "\" title=\"" + result[0].local.pseudo + "\">" + result[0].local.pseudo + "</a> and <a href=\"/u/" + result[1].idCool + "\" title=\"" + result[1].local.pseudo + "\">" + result[1].local.pseudo + "</a> are now friends!");
        return res.send(true);
      });
    });
    app.post("/cancelFriend", isLoggedIn, function(req, res) {
      var idFriend, nameFriend, obj;
      idFriend = req.body.id;
      nameFriend = req.body.pseudo;
      obj = {
        from: {
          id: req.user._id,
          userName: req.user.local.pseudo
        },
        to: {
          id: idFriend,
          userName: nameFriend
        }
      };
      return relations.cancelRelation(obj.from, obj.to, function(result) {
        return res.send(true);
      });
    });
    app.post("/denyFriend", isLoggedIn, function(req, res) {
      var idFriend, nameFriend, obj;
      idFriend = req.body.id;
      nameFriend = req.body.pseudo;
      obj = {
        from: {
          id: idFriend,
          userName: nameFriend
        },
        to: {
          id: req.user._id,
          userName: req.user.local.pseudo
        }
      };
      return relations.denyRelation(obj.from, obj.to, function(result) {
        return res.send(true);
      });
    });
    app.post("/acceptChallenge", isLoggedIn, function(req, res) {
      var obj;
      obj = {
        id: req.body.id,
        idUser: req.user._id
      };
      return challenge.accept(obj, function(result) {
        var ioText;
        xp.xpReward(result._idChallenged, "ongoing.accept");
        xp.xpReward(result._idChallenger, "ongoing.accept");
        notifs.acceptChall(result._idChallenger, result._idChallenged);
        ioText = "<a href=\"/u/" + result._idChallenged.idCool + "\" title=\"" + result._idChallenged.local.pseudo + "\">";
        ioText += result._idChallenged.local.pseudo + "</a> accepted <a href=\"/c/" + result._idChallenge.idCool + ">the challenge</a> of <a href=\"/u/";
        ioText += result._idChallenger.idCool + " title=\"" + result._idChallenger.local.pseudo + "\">" + result._idChallenger.local.pseudo + "</a>.";
        sio.glob("fa fa-gamepad", ioText);
        return res.send(true);
      });
    });
    app.post("/denyChallenge", isLoggedIn, function(req, res) {
      var obj;
      obj = {
        id: req.body.id,
        idUser: req.user._id
      };
      return challenge.deny(obj, function(result) {
        if (result) {
          return res.send(true);
        } else {
          return console.log(result);
        }
      });
    });
    app.get("/login", function(req, res) {
      return res.render("login.ejs", {
        message: req.flash("loginMessage")
      });
    });
    app.post("/login", passport.authenticate("local-login", {
      successRedirect: "/profile",
      failureRedirect: "/login",
      failureFlash: true
    }));
    app.get("/signup/:done?", function(req, res) {
      var nowConfirm;
      nowConfirm = (req.params.done === "great" ? true : false);
      return res.render("signup.ejs", {
        waitingConfirm: nowConfirm,
        currentUser: !req.user ? req.user : void 0,
        message: ""
      });
    });
    app.post("/signup", passport.authenticate("local-signup", {
      successRedirect: "/signup/great",
      failureRedirect: "/signup",
      failureFlash: true
    }));
    app.get("/auth/facebook", passport.authenticate("facebook", {
      scope: ["email", "publish_actions"]
    }));
    app.get("/auth/facebook/callback", passport.authenticate("facebook", {
      successRedirect: "/profile",
      failureRedirect: "/"
    }));
    app.get("/auth/twitter", passport.authenticate("twitter"));
    app.get("/auth/twitter/callback", passport.authenticate("twitter", {
      successRedirect: "/profile",
      failureRedirect: "/"
    }));
    app.get("/auth/google", passport.authenticate("google", {
      scope: ["profile", "email"]
    }));
    app.get("/auth/google/callback", passport.authenticate("google", {
      successRedirect: "/profile",
      failureRedirect: "/"
    }));
    app.get("/connect/facebook", passport.authorize("facebook", {
      scope: ["email", "publish_actions"]
    }));
    app.get("/connect/facebook/callback", passport.authorize("facebook", {
      successRedirect: "/profile",
      failureRedirect: "/"
    }));
    app.get("/connect/twitter", passport.authorize("twitter", {
      scope: "email"
    }));
    app.get("/connect/twitter/callback", passport.authorize("twitter", {
      successRedirect: "/profile",
      failureRedirect: "/"
    }));
    app.get("/connect/google", passport.authorize("google", {
      scope: ["profile", "email"]
    }));
    app.get("/connect/google/callback", passport.authorize("google", {
      successRedirect: "/profile",
      failureRedirect: "/"
    }));
    app.get("/unlink/local", function(req, res) {
      var user;
      user = req.user;
      user.local.email = undefined;
      user.local.password = undefined;
      user.local.pseudo = undefined;
      return user.save(function(err) {
        return res.redirect("/profile");
      });
    });
    app.get("/unlink/facebook", function(req, res) {
      var user;
      user = req.user;
      user.facebook.token = undefined;
      return user.save(function(err) {
        return res.redirect("/profile");
      });
    });
    app.get("/unlink/twitter", function(req, res) {
      var user;
      user = req.user;
      user.twitter.token = undefined;
      return user.save(function(err) {
        return res.redirect("/profile");
      });
    });
    return app.get("/unlink/google", function(req, res) {
      var user;
      user = req.user;
      user.google.token = undefined;
      return user.save(function(err) {
        return res.redirect("/profile");
      });
    });
  };

}).call(this);
