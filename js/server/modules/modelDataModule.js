module.exports = {
    trimStrings: (model, cb) => {

        for (let key in model) {

            if (model[key] !== undefined && typeof model[key] == 'string') {

                model[key] = model[key].trim();
                if (model[key] === '') { model[key] = undefined; }
            }
        }

        cb();
    }
};