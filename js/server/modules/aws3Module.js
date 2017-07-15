var r = require(global.paths.server + '/requires');

var s3 = new r.aws.S3({
    accessKeyId: process.env.AWS3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS3_SECRET_ACCESS_KEY,
    region: process.env.AWS3_REGION,
    signatureVersion: process.env.AWS3_SIGNATURE_VERSION
});



module.exports = {
    s3: s3,
    emptyBucket: function(bucketName) {

        let tasks = [];

        s3.listObjects({ Bucket: bucketName }, function (err, data) {

            if (!err) {

                let items = data.Contents;

                for (var i = 0; i < items.length; i++) {

                    tasks.push(new r.Promise((resolve, reject) => {
                        s3.deleteObject({ Bucket: bucketName, Key: items[i].Key }, (err, data) => {
                            if (!err) { resolve(data); } else { reject(err); }
                        });
                    }));
                }

            } else { console.log(err); }
        });

        return r.Promise.all(tasks);
    },
    createCredentialString: function(date) {

        return [process.env.AWS3_ACCESS_KEY_ID, date, process.env.AWS3_REGION, 's3/aws4_request'].join('/');
    },
    createBase64Policy: function(config) {

        return new Buffer(JSON.stringify({
            expiration: new Date((new Date()).getTime() + (5 * 60 * 1000)).toISOString(),
            conditions: [
                { bucket: config.bucket },
                { key: config.filename },
                { acl: config.acl },
                { 'content-type': config['content-type'] },
                { success_action_status: config.success_action_status },
                ['content-length-range', 0, config.maxSize],
                { 'x-amz-algorithm': config['x-amz-algorithm'] },
                { 'x-amz-credential': config.credential },
                { 'x-amz-date': config.date + 'T000000Z' }
            ]
        })).toString('base64');
    },
    createSignature: function(config) {

        function hmac(key, string) {
            var hmac = r.crypto.createHmac('sha256', key);
            hmac.end(string);
            return hmac.read();
        }

        var dateKey = hmac('AWS4' + process.env.AWS3_SECRET_ACCESS_KEY, config.date);
        var dateRegionKey = hmac(dateKey, process.env.AWS3_REGION);
        var dateRegionServiceKey = hmac(dateRegionKey, 's3');
        var signingKey = hmac(dateRegionServiceKey, 'aws4_request');

        return hmac(signingKey, config.policy).toString('hex');
    },
    getUploadParams: function(awsKey, contentType) {

        var that = this;

        return new r.Promise(function(resolve) {

            var config = {
            bucket: process.env.AWS3_UPLOADS_BUCKET_URL,
                acl: 'public-read',
                success_action_status: '201',
                filename: awsKey,
                'content-type': contentType,
                maxSize: global.app.get('PHOTO_MAX_SIZE'),
                date: (function() {
                    var date = new Date().toISOString();
                    return date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2);
                })(),
                'x-amz-algorithm': 'AWS4-HMAC-SHA256'
            };

            config.credential = that.createCredentialString(config.date);
            config.policy = that.createBase64Policy(config);

            resolve({
                awsUrl: 'https://s3.amazonaws.com/' + process.env.AWS3_UPLOADS_BUCKET_URL,
                awsFormData: {
                    key: config.filename,
                    acl: config.acl,
                    'content-type': config['content-type'],
                    success_action_status: config.success_action_status,
                    policy: config.policy,
                    'x-amz-algorithm': config['x-amz-algorithm'],
                    'x-amz-credential': config.credential,
                    'x-amz-date': config.date + 'T000000Z',
                    'x-amz-signature': that.createSignature(config)
                }
            });
        });
    },
    get_upload_credentials: function(req, res, next) {

        var action = new r.prototypes.Action(arguments);

        new r.Promise(function(resolve) {

            if (action.req.headers.subject == 'user_avatar') {
                resolve();

            } else if (action.req.headers.subject == 'report_photos') {

                // Getting report from db
                r.Report.findOne({ _id: action.req.body.reportId }, function(err, report) {

                    if (!err && report && report.photos.length < global.app.get('REPORT_MAX_PHOTOS')) {
                        resolve();

                    } else {
                        action.end(400, err);
                    }
                });

            } else { action.end(400); }

        }).then(function() {

            var extensions = [], dates = [], promises = [];

            var execute = function(i) {

                var awsKey;

                extensions.push(action.req.body.fileTypes[i].split('/')[1].toLowerCase());
                dates.push(new Date().getTime() + i);

                if (action.req.headers.subject == 'user_avatar') {
                    awsKey = action.req.decoded._id + '/avatar_' + dates[i] + '.' + extensions[i];

                } else if (action.req.headers.subject == 'report_photos') {
                    awsKey = action.req.decoded._id + '/reports/' + action.req.body.reportId + '/report_photo_' + dates[i] + '.' + extensions[i];
                }

                promises.push(r.modules.aws3Module.getUploadParams(awsKey, action.req.body.fileTypes[i]));
            };

            for (var i in action.req.body.fileTypes) { execute(Number(i)); }

            r.Promise.all(promises).then(function(paramsArr) {

                for (var i in paramsArr) {

                    if (paramsArr[i]) {

                        if (action.req.headers.subject == 'user_avatar') {
                            paramsArr[i].awsFilename = 'avatar_' + dates[i] + '.' + extensions[i];

                        } else if (action.req.headers.subject == 'report_photos') {
                            paramsArr[i].awsFilename = 'report_photo_' + dates[i] + '.' + extensions[i];
                        }
                    }
                }

                action.end(200, paramsArr);
            });
        });
    }
};