const cm = require(global.paths.server + '/cm');

module.exports = {
    content: {
        length: {
            type: 'wrong_length',
            limits: {
                max: cm.app.get('COMMENT_MAX_LENGTH')
            },
            validator: (content) => {

                return content.length <= cm.app.get('COMMENT_MAX_LENGTH');
            }
        }
    }
};