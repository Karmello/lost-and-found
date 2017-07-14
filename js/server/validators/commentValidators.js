var r = require(global.paths.server + '/requires');

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