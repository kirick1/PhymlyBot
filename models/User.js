const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    group: {
        type: String,
        required: true,
        enum: ['0A','0B','0V','1A','1B','1V','2A','2B','2V','3A','3B','3V','4A','4B','4V'],
        get: ((v) => {
            switch (v) {
                case '0A': return '0-А';
                case '0B': return '0-Б';
                case '0V': return '0-В';
                case '1A': return '1-А';
                case '1B': return '1-Б';
                case '1V': return '1-В';
                case '2A': return '2-А';
                case '2B': return '2-Б';
                case '2V': return '2-В';
                case '3A': return '3-А';
                case '3B': return '3-Б';
                case '3V': return '3-В';
                case '4A': return '4-А';
                case '4B': return '4-Б';
                case '4V': return '4-В';
            }
        })
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;