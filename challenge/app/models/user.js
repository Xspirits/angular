// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    idCool           : {type: String, index: true },
    userRand         : {lat: Number,  lng: Number },
    isOnline         : {type: Boolean, default: false},
    level            : {type: Number, default: 1},
    xp               : {type: Number, default: 0},
    xpNext           : {type: Number, default: 100},
    share          : {
        facebook : {type: Boolean, default: true}
    },
    local            : {
        email        : String,
        password     : String,
        pseudo       : String,
        joinDate     : {type: Date, default: Date.now}
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    notifications    : [{
        idFrom   : {type : mongoose.Schema.Types.ObjectId, index: true, ref: 'User' },
        icon     : {type: String, default: 'fa fa-bell'},
        from     : {type: String, default: ''},
        to       : {type: String, default: ''},
        title    : {type: String, default: ''},
        date     : {type: Date, default: Date.now},
        message  : {type: String, default: ''},
        link1    : {type: String, default: ''},
        link2    : {type: String, default: ''},
        notificationType: {type: String, default: 'info'},
        persist  : {type: Boolean, default: false},
        type     : {type: String, default: 'simple'},
        isSeen   : {type: Boolean, default: false}        
    }],
    friends            : [{
        idUser   : {type : mongoose.Schema.Types.ObjectId, index: true, ref: 'User' }, 
        idCool   : String,
        date     : {type: Date, default: Date.now}, 
        userName : String
    }],
    sentRequests : [{
        idUser   : { type : mongoose.Schema.Types.ObjectId, index: true, ref: 'User' },     
        idCool   : String,   
        date     : {type: Date, default: Date.now}, 
        userName : String
    }],
    pendingRequests : [{
        idUser   : { type : mongoose.Schema.Types.ObjectId, index: true, ref: 'User' },    
        idCool   : String,
        date     : {type: Date, default: Date.now}, 
        userName : String
    }],
    followers : [{
        idUser   : { type : mongoose.Schema.Types.ObjectId, index: true, ref: 'User' },  
        idCool   : String,
        date     : {type: Date, default: Date.now}, 
        userName : String
    }],
    tribunal : [ { type : mongoose.Schema.Types.ObjectId, index: true, ref: 'Ongoing' } ],
    tribunalHistoric : [ {
        idCase   : {type : mongoose.Schema.Types.ObjectId, ref: 'Ongoing'},
        answer   : {type: Boolean, default: false},
        voteDate : Date
    }],
    challengeCompleted : [ { type : mongoose.Schema.Types.ObjectId, ref: 'Challenge' } ],
    challengeRate : [ { type : mongoose.Schema.Types.ObjectId, index: true, ref: 'Challenge' } ],
    challengeRateHistoric : [ {
        _idChallenge   : { type : mongoose.Schema.Types.ObjectId, index: true, ref: 'Challenge' },
        rateDate : Date,
        rating  : {
            difficulty  : Number,
            quickness   : Number,
            fun         : Number
        },
    }]

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.index( { userRand: '2d' } );
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);