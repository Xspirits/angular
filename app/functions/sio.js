var moment = require('moment');

module.exports = function(io){

	return {
		glob : function (icon, text, desc) {
			console.log("received a notif " + icon);

			io.sockets.emit('globalevent', { icon: icon ? icon :'fa fa-circle-o' ,message: text, desc: desc ? desc : '', date: new Date});

		}
	}
}