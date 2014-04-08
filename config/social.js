// Generated by CoffeeScript 1.7.1
(function() {
  var RiotApi, auth, https, request, riotApi, _;

  https = require("https");

  request = require("request");

  auth = require("./auth");

  RiotApi = require('irelia');

  _ = require("underscore");

  riotApi = new RiotApi({
    host: 'prod.api.pvp.net',
    path: '/api/lol/',
    key: auth.leagueoflegend.key,
    debug: true
  });

  exports.findSummonerLol = function(region, name, callback) {
    console.log(region);
    console.log(name);
    return riotApi.getSummonerByName(region, name, function(err, summoner) {
      if (err) {
        throw err;
      }
      console.log(summoner);
      return callback(summoner);
    });
  };

  exports.getFbData = function(accessToken, apiPath, callback) {
    var buffer, options;
    options = {
      host: "graph.facebook.com",
      port: 443,
      path: apiPath + "?access_token=" + accessToken,
      method: "GET"
    };
    buffer = "";
    request = https.get(options, function(result) {
      result.setEncoding("utf8");
      result.on("data", function(chunk) {
        buffer += chunk;
      });
      result.on("end", function() {
        callback(buffer);
      });
    });
    request.on("error", function(e) {
      console.log("error from facebook.getFbData: " + e.message);
    });
    request.end();
  };

  exports.postTwitter = function(accessToken, message, callback) {
    var form, params, r, url;
    url = "https://api.twitter.com/1.1/statuses/update.json";
    if (!accessToken) {
      params = {
        consumer_key: auth.twitterAuth.consumerKey,
        consumer_secret: auth.twitterAuth.consumerSecret,
        token: auth.twitterCyf.token,
        token_secret: auth.twitterCyf.tokenSecret
      };
    } else {
      params = {
        consumer_key: auth.twitterAuth.consumerKey,
        consumer_secret: auth.twitterAuth.consumerSecret,
        token: accessToken.token,
        token_secret: accessToken.tokenSecret
      };
    }
    r = request.post({
      url: url,
      oauth: params
    }, function(err, resp, body) {
      if (err) {
        return console.error("Error occured: ", err);
      }
      body = JSON.parse(body);
      if (body.error) {
        return console.error("Error returned from  twitter: ", body.error);
      }
      callback(body);
    });
    form = r.form();
    form.append("status", message);
  };

  exports.postFbMessage = function(accessToken, message, link, callback) {
    var params, url;
    url = "https://graph.facebook.com/me/feed";
    params = {
      access_token: accessToken,
      link: "https://graph.facebook.com/",
      name: message.title,
      description: message.body
    };
    request.post({
      url: url,
      qs: params
    }, function(err, resp, body) {
      if (err) {
        return console.error("Error occured: ", err);
      }
      body = JSON.parse(body);
      if (body.error) {
        return console.error("Error returned from facebook: ", body.error);
      }
      callback(JSON.stringify(body, null, "\t"));
    });
  };

}).call(this);
