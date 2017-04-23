var speakers = [];
var participants = [
{"Bestellnr.":620804703,"Bestelldatum":"2017-04-21 11:34:09+02:00","Vorname":"Nico","Nachname":"Haslberger","Ticketart":"Global Azure Bootcamp 2017","Teilnehmernummer":778268685,"Barcode-Nr.":"620804703778268685001","Teilnehmerstatus":"Nimmt teil"},
{"Bestellnr.":620804703,"Bestelldatum":"2017-04-21 11:34:09+02:00","Vorname":"Gerhard","Nachname":"Gehrer","Ticketart":"Global Azure Bootcamp 2017","Teilnehmernummer":778268686,"Barcode-Nr.":"620804703778268686001","Teilnehmerstatus":"Nimmt teil"},
{"Bestellnr.":620836388,"Bestelldatum":"2017-04-21 14:07:58+02:00","Vorname":"Gerald","Nachname":"Rammerstorfer","Ticketart":"Global Azure Bootcamp 2017","Teilnehmernummer":778306213,"Barcode-Nr.":"620836388778306213001","Teilnehmerstatus":"Nimmt teil"},
{"Bestellnr.":620836889,"Bestelldatum":"2017-04-21 14:10:00+02:00","Vorname":"Dinh Luan","Nachname":"Pham","Ticketart":"Global Azure Bootcamp 2017","Teilnehmernummer":778306805,"Barcode-Nr.":"620836889778306805001","Teilnehmerstatus":"Nimmt teil"},
{"Bestellnr.":620868156,"Bestelldatum":"2017-04-21 15:44:48+02:00","Vorname":"Armin","Nachname":"Reiter","Ticketart":"Global Azure Bootcamp 2017","Teilnehmernummer":778344523,"Barcode-Nr.":"620868156778344523001","Teilnehmerstatus":"Nimmt teil"},
{"Bestellnr.":620882135,"Bestelldatum":"2017-04-21 16:18:29+02:00","Vorname":"Dieter","Nachname":"Dirschl","Ticketart":"Global Azure Bootcamp 2017","Teilnehmernummer":778361253,"Barcode-Nr.":"620882135778361253001","Teilnehmerstatus":"Nimmt teil"},{"Bestellnr.":591293775,"Bestelldatum":"2017-01-29 19:57:16+01:00","Vorname":"Hans-Peter","Nachname":"Weidinger","Ticketart":"Global Azure Bootcamp 2017","Teilnehmernummer":742511619,"Barcode-Nr.":"591293775742511619001","Teilnehmerstatus":"Nimmt teil"},
{"Bestellnr.":591293775,"Bestelldatum":"2017-01-29 19:57:16+01:00","Vorname":"Daniel","Nachname":"Weidinger","Ticketart":"Global Azure Bootcamp 2017","Teilnehmernummer":742511620,"Barcode-Nr.":"591293775742511620001","Teilnehmerstatus":"Nimmt teil"}];

participants = participants.sort(function(a, b) {
    if (a['Nachname'] < b['Nachname']) {
        return -1;
    }

    if (a['Nachname'] > b['Nachname']) {
        return 1;
    }

    if (a['Vorname'] < b['Vorname']) {
        return -1;
    }
    
    if (a['Vorname'] > b['Vorname']) {
        return 1;
    }

    // a must be equal to b
    return 0;
});

var badges = $('.cd-badges');
var page = 0;
var index = 0;
var lastStartLetter = '';
var printSeparator = false;

while (index < participants.length) {
    console.log('page: ' + page.toString());

    var pageContainer = $('<div class="cd-badge-page"></div>');
    badges.append(pageContainer);

    for (var i = 0; i < 8; i++) {
        if (index < participants.length) {
            if (lastStartLetter != participants[index]['Nachname'][0] && printSeparator) {
                var separator = $('<div class="cd-badge"><div class="cd-badge-marker">' + participants[index]['Nachname'][0] + '</div><div class="cd-badge-marker-arrow"><span class="fa fa-arrow-down"></span></div></div>');
                pageContainer.append(separator);
                lastStartLetter = participants[index]['Nachname'][0];
            } else {
                console.log('index: ' + index.toString());
                var badgeContainer = $('<div class="cd-badge"></div>');
                pageContainer.append(badgeContainer);
                var color = 'blue';
                if (participants[index]['Ticketart'] == 'Junior Bootcamp 2017 (13-17 Jahre)') {
                    color = 'green';
                } else if (speakers.indexOf(participants[index]['Nachname']) >= 0) {
                    color = 'orange';
                }

                badgeContainer.append($('<div class="cd-badge-header ' + color + '"><img src="gab-2017-logo-250x169.png" /><div class="cd-badge-center"></div></div>'));
                badgeContainer.append($('<div class="cd-badge-qrcode"><img src="http://chart.googleapis.com/chart?cht=qr&chs=125x125&chld=L|0&chl=' + participants[index]['Barcode-Nr.'].toString() + '" /></div>'));
                badgeContainer.append($('<div class="cd-badge-name"><div>' + participants[index]['Vorname'] + '</div><div>' + participants[index]['Nachname'] + '</div></div>'));
                lastStartLetter = participants[index]['Nachname'][0];
                index++;
            }
        }
    }

    page++;
}