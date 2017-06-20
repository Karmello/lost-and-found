var r = require(global.paths._requires);

module.exports = {
    content: {
        length: {
            type: 'wrong_length',
            limits: {
                max: global.app.get('COMMENT_MAX_LENGTH')
            },
            validator: function(content) {

                return content.length <= global.app.get('COMMENT_MAX_LENGTH');
            }
        }
    }
};