module.exports = (schedule, _, sio, ladder, moment, social, appKeys, xp, notifs) ->
  
  # =============================================================================
  # XP&LEVEL HISTORY   ==========================================================
  # =============================================================================

  # Daily Ladder
  xpLevelUpdate         = new schedule.RecurrenceRule()
  xpLevelUpdate.hour    = 0
  xpLevelUpdate.minute  = 10 # Let's avoid taking risks with setting 0h 0m 0s
  xpLevelUpdate.seconds = 0

  xpLevel = schedule.scheduleJob xpLevelUpdate, ->
    console.log 'xpLevel update start'

    xp.updateDaily (result)-> 
      console.log result

  # =============================================================================
  # LADDERS    ==================================================================
  # =============================================================================
  
  # Daily Ladder
  dailyRanking         = new schedule.RecurrenceRule()
  dailyRanking.hour    = 0
  dailyRanking.minute  = 1 # Let's avoid taking risks with setting 0h 0m 0s
  dailyRanking.seconds = 0

  dailyLadder = schedule.scheduleJob dailyRanking, ->
    console.log 'dailyLadder'

    ladder.createDailyLadder ->

      ladder.rankUser 'dailyRank', (top3)-> 
        yesterday = moment().subtract('d', 1).format("ddd Do MMM")
        # console.log 'Updated ladder for ' + yesterday + ' leaders ' + top3.length
        # Initiate the newLeader variable here, else we'll get an undefined when we post on twitter.
        newLeader = ''
        _.each top3, (user, it) ->
          lastTime  = user.dailyArchives.length-1
          diff      = user.dailyArchives[lastTime].rank - user.dailyRank
          
          wasRanked = if user.dailyArchives[lastTime].rank > 0 then true else false
          diffIcon  = if diff > 0 then 'arrow-up' else if diff == 0 then 'minus' else 'arrow-down' 
          diff      = Math.abs diff
          variable  = if wasRanked then '<i class="fa fa-' + diffIcon + '"></i> ' + diff else 'previously unranked'
          uText     = user.local.pseudo + ' is now ranked <strong>' + user.dailyRank + '</strong>, ' + variable + '! daily <i class="fa fa-list"></i>. ' 
          
          #Send a Global message
          sio.glob "fa fa-star", uText

          # Prepare notification
          notif =
            type: 'newLadderRank'
            idFrom: user._id
            from: 'Challenge Master'
            link1: './leaderboard'
            title: 'Congratulation!! You are now ranked ' + user.dailyRank
            icon: 'fa fa-star'
            to: ''
            link2: ''
            message: ''
              
          notifs.newNotif([user._id], true, notif);

          #define the new leader
          if user.dailyRank == 1
            console.log user.twitter
            console.log user.local.pseudo
            newLeader += user.local.pseudo + if user.twitter then ' (@' + user.twitter.username + ')' else ''

          if it + 1 >= top3.length
            # Tweet
            if appKeys.twitterPushNews
              # Lets push on our timeline to let players now about the new Leaderboard
              twitt     = "The daily #ranking for yesterday, "+yesterday+", is up! #GG "+newLeader+" who ranked First! http://goo.gl/3VjsJd #CYF_ladder #CYFDaily"
            
              social.postTwitter appKeys.twitterCyf, twitt, (data) ->
                text = 'The ranking of yesterday <a href="/leaderboard" title="leaderboard">is live</a>! <a target="_blank" href="https://twitter.com/'+ data.user.screen_name + '/status/' + data.id_str + '" title="see tweet"><i class="fa fa-twitter"></i> see</a>.'
                sio.glob "fa fa-list", text
          return
        return
  
  # Weekly Ladder
  weeklyRanking           = new schedule.RecurrenceRule()
  weeklyRanking.dayOfWeek = 1 #Monday
  weeklyRanking.hour      = 0
  weeklyRanking.minute    = 5 # Let's avoid taking risks with setting 0h 0m 0s
  weeklyRanking.seconds   = 0

  weekLadder = schedule.scheduleJob weeklyRanking, ->
    ladder.createWeeklyLadder ->

      console.log "Updated ladder for the past week " + lastWeek
      ladder.rankUser 'weeklyRank', (top3)-> 

        lastWeek = moment().subtract('w', 1).format("w")
        newLeader   = ''
        newFollower = ''
        _.each top3, (user, it) ->
          lastTime  = user.weeklyArchives.length-1
          diff      = user.weeklyArchives[lastTime].rank - user.weeklyRank
          
          wasRanked = if user.weeklyArchives[lastTime].rank > 0 then true else false
          diffIcon  = if diff > 0 then 'arrow-up' else if diff == 0 then 'minus' else 'arrow-down' 
          diff      = Math.abs diff
          variable  = if wasRanked then '<i class="fa fa-' + diffIcon + '"></i> ' + diff else 'previously unranked'
          uText     = user.local.pseudo + ' is now ranked <strong>' + user.weeklyRank + '</strong>, ' + variable + '! weekly <i class="fa fa-list"></i>. ' 
          

          # Prepare notification
          notif =
            type: 'newLadderRank'
            idFrom: user._id
            from: 'Challenge Master'
            link1: './leaderboard'
            title: 'Congratulation!! You are now ranked ' + user.dailyRank
            icon: 'fa fa-star'
            to: ''
            link2: ''
            message: ''
              
          notifs.newNotif([user._id], true, notif);

          #define the new leader
          if user.weeklyRank == 1
            newLeader += user.local.pseudo + if user.twitter then ' (@' + user.twitter.username + ')' else ''
          #define the new follower
          if user.weeklyRank == 2
            newFollower += user.local.pseudo + if user.twitter then ' (@' + user.twitter.username + ')' else ''

          sio.glob "fa fa-star", '<i class="fa fa-star"></i> ' + uText
          if it + 1 >= top3.length
            # Lets push on our timeline to let players now about the new Leaderboard
            twitt     = "Weekly #ranking "+lastWeek+" is live! #GG "+newLeader+" who ranked First and "+newFollower+" sd! http://goo.gl/3VjsJd #CYF_ladder #CYFWeekly"
            
            if appKeys.twitterPushNews
              social.postTwitter appKeys.twitterCyf, twitt, (data) ->
                text = 'The weekly ranking <strong>'+lastWeek+'</strong> <a href="/leaderboard" title="leaderboard">is live</a>! <a target="_blank" href="https://twitter.com/'+ data.user.screen_name + '/status/' + data.id_str + '" title="see tweet"><i class="fa fa-twitter"></i> see</a>.'
                sio.glob "fa fa-list", text
          return
        return
  
  # Monthly Ladder
  monthlyRanking         = new schedule.RecurrenceRule()
  monthlyRanking.date    = 1 # 1st of each month
  monthlyRanking.hour    = 1 # at 1 AM
  monthlyRanking.minute  = 0
  monthlyRanking.seconds = 0

  monthlyLadder = schedule.scheduleJob monthlyRanking, ->
    ladder.createMonthlyLadder ->

      console.log "Updated ladder for the past month " + lastMonth
      ladder.rankUser 'monthlyRank', -> 
        lastMonth = moment().subtract('m', 1).format("MMMM GGGG")
        newLeader   = ''
        newFollower = ''
        _.each top3, (user, it) ->
          lastTime  = user.monthlyArchives.length-1
          diff      = user.monthlyArchives[lastTime].rank - user.monthlyRank
          
          wasRanked = if user.monthlyArchives[lastTime].rank > 0 then true else false
          diffIcon  = if diff > 0 then 'arrow-up' else if diff == 0 then 'minus' else 'arrow-down' 
          diff      = Math.abs diff
          variable  = if wasRanked then '<i class="fa fa-' + diffIcon + '"></i> ' + diff else 'previously unranked'
          uText     = user.local.pseudo + ' is now ranked <strong>' + user.monthlyRank + '</strong>, ' + variable + '! monthly <i class="fa fa-list"></i>. ' 
          

          # Prepare notification
          notif =
            type: 'newLadderRank'
            idFrom: user._id
            from: 'Challenge Master'
            link1: './leaderboard'
            title: 'Congratulation!! You are now ranked ' + user.dailyRank
            icon: 'fa fa-star'
            to: ''
            link2: ''
            message: ''
              
          notifs.newNotif([user._id], true, notif);
          
          #define the new leader
          if user.monthlyRank == 1
            newLeader += user.local.pseudo + if user.twitter then ' (@' + user.twitter.username + ')' else ''
          #define the new follower
          if user.monthlyRank == 2
            newFollower += user.local.pseudo + if user.twitter then ' (@' + user.twitter.username + ')' else ''

          sio.glob "fa fa-star", '<i class="fa fa-star"></i><i class="fa fa-star"></i> ' + uText
          if it + 1 >= top3.length
            # Lets push on our timeline to let players now about the new Leaderboard
            twitt     = "The #ranking for "+lastMonth+" is live! #GG "+newLeader+" who ranked First and "+newFollower+" sd! http://goo.gl/3VjsJd #CYF_ladder #CYFMonthly"
            
            if appKeys.twitterPushNews
              social.postTwitter appKeys.twitterCyf, twitt, (data) ->
                text = 'The ranking for <strong>'+lastMonth+'</strong> <a href="/leaderboard" title="leaderboard">is live</a>! <a target="_blank" href="https://twitter.com/'+ data.user.screen_name + '/status/' + data.id_str + '" title="see tweet"><i class="fa fa-twitter"></i> see</a>.'
                sio.glob "fa fa-list", text
          return
        return