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
        var dates = [new Date('2017-05-05 00:00:00.000Z'), new Date('2017-05-19 00:00:00.000Z'), new Date('2017-06-02 00:00:00.000Z'), new Date('2017-06-23 00:00:00.000Z'), new Date('2017-06-30 00:00:00.000Z')];
        var nextDate = [new Date('2017-06-27 00:00:00.000Z')];

        // get email addresses
        var participantsCollection = db.collection('participants');
        var promise = participantsCollection.find({}).toArray().then(function (participants) {
            if (err) {
                console.log('Error: ' + err.toString());
            } else {
                var emailAddresses = {};
                var participantNames = {};

                participants.forEach(function (participant) {
                    emailAddresses[participant._id] = participant.email;
                    participantNames[participant._id] = participant.givenName + ' ' + participant.familyName;
                });

                registrations.find({ 'event.date': { $in: nextDate } }, { 'participant.id': 1 }).toArray().then(function (docs) {
                    if (err) {
                        console.log('Error: ' + err.toString());
                        db.close();
                    } else {
                        var nextEmails = [];

                        docs.forEach(function (registration) {
                            var email = emailAddresses[registration.participant.id];

                            if (email) {
                                if (nextEmails.indexOf(email) < 0) {
                                    nextEmails.push(email);
                                }
                            } else {
                                console.log('EMAIL MISSING: ' + participantNames[registration.participant.id]);
                            }
                        });

                        console.log(' ');
                        console.log('NEXT PARTICIPANTS (' + nextEmails.length.toString() + ')');
                        console.log('---------------------------------');
                        nextEmails.forEach(function (email) {
                            console.log(email);
                        });

                        console.log(' ');

                        registrations.find({ 'event.date': { $in: dates }, 'checkedin': true }, { 'participant.id': 1 }).toArray().then(function (docs) {
                            if (err) {
                                console.log('Error: ' + err.toString());
                                db.close();
                            } else {
                                var emails = [];
                                docs.forEach(function (registration) {
                                    // get email address
                                    var email = emailAddresses[registration.participant.id];
                                    if (email) {
                                        if (emails.indexOf(email) < 0 && nextEmails.indexOf(email) < 0) {
                                            emails.push(email);
                                        }
                                    } else {
                                        console.log('EMAIL MISSING: ' + participantNames[registration.participant.id]);
                                    }
                                });

                                console.log(' ');
                                console.log('PREVIOUS PARTICIPANTS (' + emails.length.toString() + ')');
                                console.log('---------------------------------');
                                emails.forEach(function (email) {
                                    console.log(email);
                                });

                                db.close();
                            }
                        });
                    }
                });
            }
        });

    }
});