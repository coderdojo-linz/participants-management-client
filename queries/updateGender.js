/* jslint node: true */
'use strict';

var MongoClient = require('mongodb').MongoClient, assert = require('assert'), f = require('util').format, config = require('config');

var user = encodeURIComponent(config.get('mongoConnection.user'));
var password = encodeURIComponent(config.get('mongoConnection.password'));
var authMechanism = 'DEFAULT';
var authSource = config.get('mongoConnection.authSource');

var url = f('mongodb://%s:%s@ds042898.mlab.com:42898/member-management?authMechanism=%s&authSource=%s', user, password, authMechanism, authSource);

MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Error: ' + err.toString());
    } else {
        // get checked in participants
        var participants = db.collection('participants');
       
        participants.find().toArray().then(function (docs) {
            if (err) {
                console.log('Error: ' + err.toString());
                db.close();
            } else {
                console.log('Participants: ' + docs.length.toString());
                docs.forEach(function(participant) {
                    participant.gender = "m";
                    participants.update({ "_id": participant._id}, participant);
                });

                // var promises = [];
                // var emails = [];
                // docs.forEach(function (registration) {
                //     // get email adress
                //     var participants = db.collection('participants');
                //     var promise = participants.findOne({'_id': registration.participant.id }).then(function(doc) {
                //         if (err) {
                //             console.log('Error: ' + err.toString());
                //         } else {
                //             var email = doc.email;
                //             if (!doc.email) {
                //                 email = 'EMAIL MISSING: ' + doc.givenName + ' ' + doc.familyName;
                //             }

                //             if (emails.indexOf(email) < 0) {
                //                 emails.push(email);
                //             }
                //         }
                //     });

                //     promises.push(promise);
                // });

                // Promise.all(promises).then(function () {
                //     console.log('Unique participants: ' + emails.length.toString());

                //     emails.forEach(function(email) {
                //         console.log(email);
                //     });
                // });

                db.close();
            }
        });

    }
});