/* jslint node: true */
'use strict';

var MongoClient = require('mongodb').MongoClient, assert = require('assert'), f = require('util').format, config = require('config'), readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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
        var registrations = db.collection('registrations');
        var eventCollection = db.collection('events');
        eventCollection.find().toArray().then(function (events) {
            participants.find().toArray().then(function (docs) {
                if (err) {
                    console.log('Error: ' + err.toString());
                    db.close();
                } else {
                    console.log('Participants: ' + docs.length.toString());

                    rl.question('Given name, family name, year of birth, gender, email, date, needs computer: ', (answer) => {
                        var responses = answer.split(';');
                        var givenName = responses[0];
                        var familyName = responses[1];
                        var yearOfBirth = responses[2];
                        var gender = responses[3];
                        var email = responses[4]
                        var date = responses[5];
                        var needsComputer = responses[6];

                        var filteredParticipants = docs.filter(p => p.givenName == givenName && p.familyName == familyName);
                        var currentParticipant = null;
                        if (filteredParticipants == 0) {
                            participants.insertOne({ "givenName": givenName, "familyName": familyName, "gender": gender, "yearOfBirth": yearOfBirth, "email": email }).then(response => {
                                console.log(JSON.stringify(response));
                                db.close();
                            });
                        } else {
                            currentParticipant = filteredParticipants[0];
                            console.log(JSON.stringify(currentParticipant));
                            var event = events.filter(e => e._id == date)[0];
                            console.log(JSON.stringify(event));

                            registrations.insertOne({
                                "event" : {
                                    "id" : event._id,
                                    "date" : event.date
                                },
                                "participant" : {
                                    "id" : currentParticipant._id,
                                    "givenName" : currentParticipant.givenName,
                                    "familyName" : currentParticipant.familyName
                                },
                                "registered" : true,
                                "needsComputer": false,
                                "checkedin" : false
                            }).then(response => {
                                db.close();
                            });
                            //db.close();
                        }

                        rl.close();
                    });

                }
            });
        });

    }
});