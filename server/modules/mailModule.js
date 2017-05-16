// jshint multistr:true
var r = require(global.paths._requires);
var transporter = r.nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS } });



module.exports = {
	create: function(id, language, receiverMail, data) {

		var hardData = require(global.paths.json + '/hard_coded/hard_coded_' + language + '.json');
		var mail = { from: process.env.GMAIL_USER, to: receiverMail };

		switch (id) {

			case 'new_pass_link':

				mail.subject = hardData.information[4];
				mail.html = '\
					<h2 style="font-weight: normal">' + hardData.other[0] + ' ' + data.username + ' !</h2><br/>\
					<h4 style="font-weight: normal">' + hardData.information[0] + '</h4>\
					<h4 style="font-weight: normal">' + data.link + '</h4><br />\
					<h4 style="font-weight: normal">' + hardData.information[7] + '</h4>\
					<h4 style="font-weight: normal">' + hardData.other[1] + '</h4>\
				';

				return mail;

			case 'new_pass':

				mail.subject = hardData.information[5];
				mail.html = '\
					<h2 style="font-weight: normal">' + hardData.other[0] + ' ' + data.username + ' !</h2><br/>\
					<h4 style="font-weight: normal">' + hardData.information[3] + ':</h4>\
					<h4 style="font-weight: normal">' + data.password + '</h4><br />\
					<h4 style="font-weight: normal">' + hardData.information[1] + '</h4>\
					<h4 style="font-weight: normal">' + hardData.other[1] + '</h4>\
				';

				return mail;

			case 'contact_msg':

				mail.subject = 'New msg from LostAndFoundApp user ...';
				mail.html = '\
				<p>User id: ' + data.userId + '</p>\
				<p>Username: ' + data.username + '</p>\
				<p>Type of message: ' + data.contactType + '</p>\
				<p>Number: ' + data.number + '</p>\
				<br /><p>Message:</p>\
				<p>' + data.contactMsg + '</p>\
				';

				return mail;
		}
	},
	send: function(mail, cb) {

		transporter.sendMail(mail, function(err, info) {
			cb(err, info);
		});
	}
};