const cm = require(global.paths.server + '/cm');

let createCredentialString = (date) => {

    return [process.env.AWS3_ACCESS_KEY_ID, date, process.env.AWS3_REGION, 's3/aws4_request'].join('/');
};

let createBase64Policy = (config) => {

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
};

let createSignature = (config) => {

    let hmac = (key, string) => {
        let hmac = cm.libs.crypto.createHmac('sha256', key);
        hmac.end(string);
        return hmac.read();
    };

    let dateKey = hmac('AWS4' + process.env.AWS3_SECRET_ACCESS_KEY, config.date);
    let dateRegionKey = hmac(dateKey, process.env.AWS3_REGION);
    let dateRegionServiceKey = hmac(dateRegionKey, 's3');
    let signingKey = hmac(dateRegionServiceKey, 'aws4_request');

    return hmac(signingKey, config.policy).toString('hex');
};

let getUploadParams = (awsKey, contentType) => {

    return new cm.libs.Promise((resolve) => {

        let config = {
            bucket: process.env.AWS3_UPLOADS_BUCKET_URL,
            acl: 'public-read',
            success_action_status: '201',
            filename: awsKey,
            'content-type': contentType,
            maxSize: cm.app.get('PHOTO_MAX_SIZE'),
            date: (() => {
                let date = new Date().toISOString();
                return date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2);
            })(),
            'x-amz-algorithm': 'AWS4-HMAC-SHA256'
        };

        config.credential = createCredentialString(config.date);
        config.policy = createBase64Policy(config);

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
                'x-amz-signature': createSignature(config)
            }
        });
    });
};

module.exports = {
    s3: new cm.libs.aws.S3({
        accessKeyId: process.env.AWS3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS3_SECRET_ACCESS_KEY,
        region: process.env.AWS3_REGION,
        signatureVersion: process.env.AWS3_SIGNATURE_VERSION
    }),
    emptyBucket: (bucketName) => {

        let tasks = [];

        s3.listObjects({ Bucket: bucketName }, (err, data) => {

            if (!err) {

                let items = data.Contents;

                for (var i = 0; i < items.length; i++) {

                    tasks.push(new cm.libs.Promise((resolve, reject) => {
                        s3.deleteObject({ Bucket: bucketName, Key: items[i].Key }, (err, data) => {
                            if (!err) { resolve(data); } else { reject(err); }
                        });
                    }));
                }

            } else { console.log(err); }
        });

        return cm.libs.Promise.all(tasks);
    },
    getUploadCredentials: (...args) => {

        let action = new cm.prototypes.Action(args);

        new cm.libs.Promise((resolve) => {

            if (action.req.headers.subject == 'user_photo') {
                resolve();

            } else if (action.req.headers.subject == 'report_photo') {

                // Getting report from db
                cm.Report.findOne({ _id: action.req.body.reportId }, (err, report) => {

                    if (!err && report && report.photos.length < cm.Report.schema.statics.config.photos.max) {
                        resolve();

                    } else {
                        action.end(400, err);
                    }
                });

            } else { action.end(400); }

        }).then(() => {

            let extensions = [], dates = [], promises = [];

            let execute = (i) => {

                let awsKey;

                extensions.push(action.req.body.fileTypes[i].split('/')[1].toLowerCase());
                dates.push(new Date().getTime() + i);

                if (action.req.headers.subject == 'user_photo') {
                    awsKey = action.req.decoded._id + '/avatar_' + dates[i] + '.' + extensions[i];

                } else if (action.req.headers.subject == 'report_photo') {
                    awsKey = action.req.decoded._id + '/reports/' + action.req.body.reportId + '/report_photo_' + dates[i] + '.' + extensions[i];
                }

                promises.push(getUploadParams(awsKey, action.req.body.fileTypes[i]));
            };

            for (let i in action.req.body.fileTypes) { execute(Number(i)); }

            cm.libs.Promise.all(promises).then((paramsArr) => {

                for (let i in paramsArr) {

                    if (paramsArr[i]) {

                        if (action.req.headers.subject == 'user_photo') {
                            paramsArr[i].awsFilename = 'avatar_' + dates[i] + '.' + extensions[i];

                        } else if (action.req.headers.subject == 'report_photo') {
                            paramsArr[i].awsFilename = 'report_photo_' + dates[i] + '.' + extensions[i];
                        }
                    }
                }

                action.end(200, paramsArr);
            });
        });
    }
};