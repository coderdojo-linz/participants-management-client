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
        var registrations = db.collection('registrations');
        var dates = [new Date('2017-01-13 00:00:00.000Z'), new Date('2017-01-27 00:00:00.000Z'), new Date('2017-02-10 00:00:00.000Z'), new Date('2017-03-03 00:00:00.000Z'), new Date('2017-03-17 00:00:00.000Z'), new Date('2017-03-31 00:00:00.000Z'), new Date('2017-04-21 00:00:00.000Z'), new Date('2017-05-05 00:00:00.000Z'), new Date('2017-05-19 00:00:00.000Z')];
        var result = {};
        dates.forEach(function(date) {
            result[date] = { male: 0, female: 0 };
        });

        result.m = { yearOfBirth: 0 };
        result.f = { yearOfBirth: 0 };

        registrations.find({'event.date': {$in: dates}, 'checkedin': true }, {'participant.id': 1, 'event.date': 2}).toArray().then(function (docs) {
            if (err) {
                console.log('Error: ' + err.toString());
                db.close();
            } else {
                var promises = [];
                var coders = [];
                docs.forEach(function (registration) {
                    // get email adress
                    var participants = db.collection('participants');
                    
                    var promise = participants.findOne({'_id': registration.participant.id }).then(function(participant) {
                        if (err) {
                            console.log('Error: ' + err.toString());
                        } else {
                            var currentParticipant = coders.find(function(c) { return c._id.toString() == participant._id.toString(); });
                            console.log("participant: " + currentParticipant);

                            console.log(participant.familyName + " - " + participant._id)
                            if (participant.gender == "f") {
                                result[registration.event.date].female++;
                            } else {
                                result[registration.event.date].male++;
                            }

                            if (!currentParticipant) {
                                if (!result.hasOwnProperty(participant.yearOfBirth)) {
                                    result[participant.yearOfBirth] = 1;
                                } else {
                                    result[participant.yearOfBirth]++;
                                }

                                if (!result[participant.gender].hasOwnProperty(participant.yearOfBirth)) {
                                    result[participant.gender][participant.yearOfBirth] = 1;
                                } else {
                                    result[participant.gender][participant.yearOfBirth]++;
                                }

                                coders.push(participant);
                            }
                        }
                    });

                    promises.push(promise);
                   
                });

                Promise.all(promises).then(function () {
                    console.log(result);
                });

                db.close();
            }
        });

    }
});