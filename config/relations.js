
// load up the user model
var User  = require('../app/models/user'),
Challenge = require('../app/models/challenge');

module.exports = {


	/**
	 * Return the current pending requests for a given user
	 * @param  {String}   idUser [user's id]
	 * @param  {Function} done   [description]
	 * @return {Object}          [List of ongoing requests]
	 */
	 getPending : function (idUser, done ) {

	 	Relation
	 	.findOne({'idUser' : idUser})
	 	.exec( function (err, data) {
	 		if(err)
	 			throw err;
	 		
	 		console.log(data);
	 		//return an array of objects
	 		return done(data.pendingRequests);
	 	});
	 },
	/**
	 * Create or update a relation with either a sending invite or pending one
	 * @param  {String}   from       [id of the sender]
	 * @param  {String}   to         [id of the receiver]
	 * @param  {Boolean}   thisIsSend [true or false]
	 * @param  {Function} done       [callback]
	 * @return {Boolean}              [true or false]
	 */
	 create : function (from, to, thisIsSend, done) {
	 	//Check if the relation exist or not.
	 	//For an unknown reason, couldn't addtoset or upsert document :(.
	 		var query,pushing;

	 		if(thisIsSend){
	 			pushing = 'sentRequests';
	 			query = {$push: { sentRequests : { idUser : to.id,idCool : to.idCool, userName : to.userName  }}};
	 		}
	 		else{

	 			pushing = 'pendingRequests';
	 			query = {$push: { pendingRequests : { idUser : to.id,idCool : to.idCool, userName : to.userName  }}};
	 		}

	 		User
	 		.findOne({_id : from.id, $or: [{ 'sentRequests.idUser': to.id }, { 'pendingRequests.idUser': to.id }]})
	 		.exec(function(err, relation) {

	 			if(err)
	 				throw err;

	 			console.log(relation);

	 			if(!relation) {
	 				console.log('Lets update');

	 				User
	 				.findByIdAndUpdate(from.id, query)
	 				.exec(function(err, updated) {
	 					done(true);
	 				});
	 			} else {
	 				done(false, 'already asked');
	 			}

	 		});

	 	},

	/**
	 * Accept a relation: add a new row and delete the pending ones
	 * @param  {[type]}   from [description]
	 * @param  {[type]}   to   [description]
	 * @param  {Function} done [description]
	 * @return {[type]}        [description]
	 */
	 acceptRelation : function (from, to, done) {

	 	User
	 	.findByIdAndUpdate(from.id,
	 	{ 
	 		$pull: { sentRequests : { idUser : to.id }},
	 		$push: { friends : { idUser : to.id, idCool : to.idCool, userName : to.userName }}
	 	},
	 	function(err, relationFrom) {

	 		if(err)
	 			throw err;
	 		console.log(relationFrom);

	 		User
	 		.findByIdAndUpdate(to.id,
	 		{ 
	 			$pull: { pendingRequests : { idUser : from.id }},
	 			$push: { friends : { idUser : from.id ,idCool : to.idCool, userName : from.userName }}
	 		},
	 		function(err, relationTo) {

	 			if(err)
	 				throw err;

	 			var newRelation = [relationFrom, relationTo];

	 			return done(newRelation);
	 		});
	 	});

	 },

	 cancelRelation : function (from, to, done) {

	 	User
	 	.findByIdAndUpdate(from.id,{ $pull: { pendingRequests : { idUser : to.id }}}, function(err, relation) {

	 		if(err)
	 			throw err;

	 		User
	 		.findByIdAndUpdate(to.id,{ $pull: { sentRequests : { idUser : from.id }} }, function(err, relation) {

	 			if(err)
	 				throw err;

	 			return done(true);

	 		});
	 	});

	 },

	/**
	 * Deny a relation: delete the pending one from whom denied it.
	 * @param  {[type]}   from [description]
	 * @param  {[type]}   to   [description]
	 * @param  {Function} done [description]
	 * @return {[type]}        [description]
	 */
	 denyRelation : function (from, to, done) {

	 	User
	 	.findByIdAndUpdate(to.id,{ $pull: { sentRequests : { idUser : from.id }} }, function(err, relation) {

	 		if(err)
	 			throw err;

	 		return done(true);
	 	});
	 },
	};