// Generated by CoffeeScript 1.7.1
(function() {
  module.exports = function(schedule, _, sio, ladder, moment, social, appKeys, xp, notifs) {
    var dailyLadder, dailyRanking, monthlyLadder, monthlyRanking, weekLadder, weeklyRanking, xpLevel, xpLevelUpdate;
    xpLevelUpdate = new schedule.RecurrenceRule();
    xpLevelUpdate.hour = 12;
    xpLevelUpdate.minute = 30;
    xpLevelUpdate.seconds = 0;
    xpLevel = schedule.scheduleJob(xpLevelUpdate, function() {
      console.log('xpLevel update start');
      return xp.updateDaily(function(result) {
        return console.log(result);
      });
    });
    dailyRanking = new schedule.RecurrenceRule();
    dailyRanking.hour = 0;
    dailyRanking.minute = 1;
    dailyRanking.seconds = 0;
    dailyLadder = schedule.scheduleJob(dailyRanking, function() {
      console.log('dailyLadder');
      return ladder.createDailyLadder(function() {
        return ladder.rankUser('dailyRank', function(top3) {
          var newLeader, yesterday;
          yesterday = moment().subtract('d', 1).format("ddd Do MMM");
          newLeader = '';
          _.each(top3, function(user, it) {
            var diff, diffIcon, lastTime, notif, twitt, uText, variable, wasRanked;
            lastTime = user.dailyArchives.length - 1;
            diff = user.dailyArchives[lastTime].rank - user.dailyRank;
            wasRanked = user.dailyArchives[lastTime].rank > 0 ? true : false;
            diffIcon = diff > 0 ? 'arrow-up' : diff === 0 ? 'minus' : 'arrow-down';
            diff = Math.abs(diff);
            variable = wasRanked ? '<i class="fa fa-' + diffIcon + '"></i> ' + diff : 'previously unranked';
            uText = user.local.pseudo + ' is now ranked <strong>' + user.dailyRank + '</strong>, ' + variable + '! daily <i class="fa fa-list"></i>. ';
            sio.glob("fa fa-star", uText);
            notif = {
              type: 'newLadderRank',
              idFrom: user._id,
              from: 'Challenge Master',
              link1: './leaderboard',
              title: 'Congratulation!! You are now ranked ' + user.dailyRank,
              icon: 'fa fa-star',
              to: '',
              link2: '',
              message: ''
            };
            notifs.newNotif([user._id], true, notif);
            if (user.dailyRank === 1) {
              console.log(user.twitter);
              console.log(user.local.pseudo);
              newLeader += user.local.pseudo + (user.twitter ? ' (@' + user.twitter.username + ')' : '');
            }
            if (it + 1 >= top3.length) {
              if (appKeys.app_config.twitterPushNews) {
                twitt = "The daily #ranking for yesterday, " + yesterday + ", is up! #GG " + newLeader + " who ranked First! http://goo.gl/3VjsJd #CYF_ladder #CYFDaily";
                social.postTwitter(false, twitt, function(data) {
                  var text;
                  text = 'The ranking of yesterday <a href="/leaderboard" title="leaderboard">is live</a>! <a target="_blank" href="https://twitter.com/' + data.user.screen_name + '/status/' + data.id_str + '" title="see tweet"><i class="fa fa-twitter"></i> see</a>.';
                  return sio.glob("fa fa-list", text);
                });
              }
            }
          });
        });
      });
    });
    weeklyRanking = new schedule.RecurrenceRule();
    weeklyRanking.dayOfWeek = 1;
    weeklyRanking.hour = 0;
    weeklyRanking.minute = 5;
    weeklyRanking.seconds = 0;
    weekLadder = schedule.scheduleJob(weeklyRanking, function() {
      return ladder.createWeeklyLadder(function() {
        return ladder.rankUser('weeklyRank', function(top3) {
          var lastWeek, newFollower, newLeader;
          lastWeek = moment().subtract('w', 1).format("w");
          console.log("Updating ladder for the past week " + lastWeek);
          newLeader = '';
          newFollower = '';
          _.each(top3, function(user, it) {
            var diff, diffIcon, lastTime, notif, twitt, uText, variable, wasRanked;
            lastTime = user.weeklyArchives.length - 1;
            diff = user.weeklyArchives[lastTime].rank - user.weeklyRank;
            wasRanked = user.weeklyArchives[lastTime].rank > 0 ? true : false;
            diffIcon = diff > 0 ? 'arrow-up' : diff === 0 ? 'minus' : 'arrow-down';
            diff = Math.abs(diff);
            variable = wasRanked ? '<i class="fa fa-' + diffIcon + '"></i> ' + diff : 'previously unranked';
            uText = user.local.pseudo + ' is now ranked <strong>' + user.weeklyRank + '</strong>, ' + variable + '! weekly <i class="fa fa-list"></i>. ';
            notif = {
              type: 'newLadderRank',
              idFrom: user._id,
              from: 'Challenge Master',
              link1: './leaderboard',
              title: 'Congratulation!! You are now ranked ' + user.dailyRank,
              icon: 'fa fa-star',
              to: '',
              link2: '',
              message: ''
            };
            notifs.newNotif([user._id], true, notif);
            if (user.weeklyRank === 1) {
              newLeader += user.local.pseudo + (user.twitter ? ' (@' + user.twitter.username + ')' : '');
            }
            if (user.weeklyRank === 2) {
              newFollower += user.local.pseudo + (user.twitter ? ' (@' + user.twitter.username + ')' : '');
            }
            sio.glob("fa fa-star", '<i class="fa fa-star"></i> ' + uText);
            if (it + 1 >= top3.length) {
              twitt = "Weekly #ranking " + lastWeek + " is live! #GG " + newLeader + " who ranked First and " + newFollower + " 2nd! http://goo.gl/3VjsJd #CYF_ladder #CYFWeekly";
              if (appKeys.app_config.twitterPushNews) {
                social.postTwitter(false, twitt, function(data) {
                  var text;
                  text = 'The weekly ranking <strong>' + lastWeek + '</strong> <a href="/leaderboard" title="leaderboard">is live</a>! <a target="_blank" href="https://twitter.com/' + data.user.screen_name + '/status/' + data.id_str + '" title="see tweet"><i class="fa fa-twitter"></i> see</a>.';
                  return sio.glob("fa fa-list", text);
                });
              }
            }
          });
        });
      });
    });
    monthlyRanking = new schedule.RecurrenceRule();
    monthlyRanking.date = 1;
    monthlyRanking.hour = 1;
    monthlyRanking.minute = 2;
    monthlyRanking.seconds = 0;
    return monthlyLadder = schedule.scheduleJob(monthlyRanking, function() {
      return ladder.createMonthlyLadder(function() {
        return ladder.rankUser('monthlyRank', function(top3) {
          var lastMonth, newFollower, newLeader;
          lastMonth = moment().subtract('m', 1).format("MMMM GGGG");
          console.log("Updated ladder for the past month " + lastMonth);
          newLeader = '';
          newFollower = '';
          _.each(top3, function(user, it) {
            var diff, diffIcon, lastTime, notif, twitt, uText, variable, wasRanked;
            lastTime = user.monthlyArchives.length - 1;
            diff = user.monthlyArchives[lastTime].rank - user.monthlyRank;
            wasRanked = user.monthlyArchives[lastTime].rank > 0 ? true : false;
            diffIcon = diff > 0 ? 'arrow-up' : diff === 0 ? 'minus' : 'arrow-down';
            diff = Math.abs(diff);
            variable = wasRanked ? '<i class="fa fa-' + diffIcon + '"></i> ' + diff : 'previously unranked';
            uText = user.local.pseudo + ' is now ranked <strong>' + user.monthlyRank + '</strong>, ' + variable + '! monthly <i class="fa fa-list"></i>. ';
            notif = {
              type: 'newLadderRank',
              idFrom: user._id,
              from: 'Challenge Master',
              link1: './leaderboard',
              title: 'Congratulation!! You are now ranked ' + user.dailyRank,
              icon: 'fa fa-star',
              to: '',
              link2: '',
              message: ''
            };
            notifs.newNotif([user._id], true, notif);
            if (user.monthlyRank === 1) {
              newLeader += user.local.pseudo + (user.twitter ? ' (@' + user.twitter.username + ')' : '');
            }
            if (user.monthlyRank === 2) {
              newFollower += user.local.pseudo + (user.twitter ? ' (@' + user.twitter.username + ')' : '');
            }
            sio.glob("fa fa-star", '<i class="fa fa-star"></i><i class="fa fa-star"></i> ' + uText);
            if (it + 1 >= top3.length) {
              twitt = "The #ranking for " + lastMonth + " is live! #GG " + newLeader + " who ranked First and " + newFollower + " 2nd! http://goo.gl/3VjsJd #CYF_ladder #CYFMonthly";
              if (appKeys.app_config.twitterPushNews) {
                social.postTwitter(false, twitt, function(data) {
                  var text;
                  text = 'The ranking for <strong>' + lastMonth + '</strong> <a href="/leaderboard" title="leaderboard">is live</a>! <a target="_blank" href="https://twitter.com/' + data.user.screen_name + '/status/' + data.id_str + '" title="see tweet"><i class="fa fa-twitter"></i> see</a>.';
                  return sio.glob("fa fa-list", text);
                });
              }
            }
          });
        });
      });
    });
  };

}).call(this);
