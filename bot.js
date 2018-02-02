require('dotenv').config();
require('./config/database');

const User = require('./models/User');
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);

bot.use(Telegraf.log());
bot.start((ctx) => {
    User.findOne({user_id: ctx.message.from.id})
        .then((user) => {
            if(user === null) (new User({user_id: ctx.message.from.id})).save()
                .then((result) => console.log(result))
                .catch((e) => console.error('ERROR', e));
            else return ctx.reply('ОК');
        }).catch((err) => console.error('ERROR', err));
});
bot.catch((err) => console.error('ERROR', err));
bot.startPolling();



