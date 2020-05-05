const mongoose = require('mongoose');

const baseShema = mongoose.Schema({
        title: {type:String},
        salary: {type: Number},
        expenses: [{

                name: String,
                cost: Number
        }]

});

module.exports = mongoose.model('Base', baseShema);