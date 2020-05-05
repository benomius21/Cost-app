const mongoose = require('mongoose');
const uniqValidator = require('mongoose-unique-validator');
const accShema = mongoose.Schema({
        email: {type:String, require:true, unique:true},
        password: {type: String, require:true, unique:true}
});

accShema.plugin(uniqValidator);

module.exports = mongoose.model('Acc', accShema);