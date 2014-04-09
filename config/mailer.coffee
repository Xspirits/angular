
module.exports = (mandrill_client, keys, moment) ->

	accountConfirm: (user, callback) ->

		# preparing bash email
		emailList = [
			email: user.local.email
			name: user.local.pseudo
			type: "to"
		]
		gotoUrl = keys.cyf.domain + '/eval/'+ user.verfiy_hash
		  
		message =

		  html: '<table cellpadding="0" cellspacing="0" style="border-radius:4px;margin:0;padding:0;width:100%;max-width:664px;border:1px solid #dadedf" border="0"><tbody><tr><td style="padding:40px 40px 37px 40px;background-color:#f5f6f7;border-bottom:1px solid #dadedf"><table cellpadding="0" cellspacing="0" style="padding:0;width:100%;margin:0;text-align:left" border="0"><tbody><tr><td><img src="http://cyf-app.co/img/logo_black.png"></td></tr></tbody></table></td></tr><tr><td style="font-size:18px;color:#47515d;border-bottom:1px solid #dadedf;padding:36px 40px 40px 40px;font-family:Arial,Verdana,sans-serif;text-align:left">Hi ' + user.local.pseudo + ' welcome to Challenge Your Friends there is only one final step remaining!<br><br><p> To become a true challenger one does not simply only create an account but proves himself as a human being!</p><p>Please confirm your email by clicking <a href="' + gotoUrl + '" title="confirm your email">here</a><br><br> You can also copy/past the following link in your browser: " + gotoUrl + "<br><br>- The Team</td></tr><tr><td style="padding:40px;background-color:#f5f6f7"><table cellpadding="0" cellspacing="0" style="padding:0;width:100%;margin:0;text-align:left" border="0"><tbody><tr><td style="color:#92999f;width:100%;font-size:14px;font-family:Arial,Verdana,sans-serif;padding-right:40px">Challenge your Friends (CyF) is a new service which allows you to receive and send challenge to gamers around the world on any game.<a style="color:#0bacff;text-decoration:none" href="http://cyf-app.co/discover" target="_blank"><u></u>Learn more<u></u></a></td><td><img src="http://cyf-app.co/img/favicon-64.png"></td></tr></tbody></table></td></tr></tbody></table>'
		  # text: "Example text content"
		  subject: user.local.pseudo + " please confirm your email!"
		  from_email: keys.support.email
		  from_name: keys.support.name
		  to: emailList
		  headers:
		    "Reply-To": keys.support.email

		  important: true
		  preserve_recipients: true
		  tags: ["account-confirmation"]
		  metadata:
		    website: keys.cyf.domain

		mandrill_client.messages.send
		  message: message
		  async: false
		, ((result) ->
		  console.log result
		  callback result
		  return

		#
		#    [{
		#            "email": "recipient.email@example.com",
		#            "status": "sent",
		#            "reject_reason": "hard-bounce",
		#            "_id": "abc123abc123abc123abc123abc123"
		#        }]
		#    
		), (e) ->
		  
		  # Mandrill returns the error as an object with name and message keys
		  console.log "A mandrill error occurred: " + e.name + " - " + e.message
		  return