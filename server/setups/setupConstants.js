module.exports = function(app, cb) {

	// Session
	app.set('CAPTCHA_MAX_BAD_ACTIONS', 5);
	app.set('DEFAULT_LANG', 'en');
	app.set('DEFAULT_THEME', 'standard');

	// Token
	app.set('AUTH_TOKEN_EXPIRES_IN', 86400);

	// User model
	app.set('USER_EMAIL_MAX_LENGTH', 254);
	app.set('USER_USERNAME_MIN_LENGTH', 3);
	app.set('USER_USERNAME_MAX_LENGTH', 20);
	app.set('USER_PASSWORD_MIN_LENGTH', 8);
	app.set('USER_PASSWORD_MAX_LENGTH', 25);
	app.set('USER_FIRSTNAME_MAX_LENGTH', 25);
	app.set('USER_LASTNAME_MAX_LENGTH', 50);
	app.set('USER_RECENTLY_VIEWED_REPORTS_MAX_LENGTH', 5);

	// Report model
	app.set('REPORT_TITLE_MIN_LENGTH', 10);
	app.set('REPORT_TITLE_MAX_LENGTH', 50);
	app.set('REPORT_DESCRIPTION_MIN_LENGTH', 50);
	app.set('REPORT_DESCRIPTION_MAX_LENGTH', 1000);

	// Report photos
	app.set('REPORT_MAX_PHOTOS', 10);
	app.set('PHOTO_MAX_SIZE', 1048576);

	// Report event
	app.set('REPORT_EVENT_DETAILS_MIN_LENGTH', 50);
	app.set('REPORT_EVENT_DETAILS_MAX_LENGTH', 1000);

	// Max gets
	app.set('REPORTS_MAX_GET', 25);
	app.set('COMMENTS_MAX_GET', 10);

	cb();
};