require('dotenv').config();
require('./config/database');

const User = require('./models/User');
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const extensions = require('./helpers/extensions');

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);
//bot.use(Telegraf.log());

try {
    bot.start((ctx) => {
        User.findOne({id: ctx.message.from.id})
            .then((user) => {
                if(!user) return ctx.reply('Привіт, перш ніж почати необхідно задати твій курс:',Markup.inlineKeyboard([
                    Markup.callbackButton('0-А','0A'),Markup.callbackButton('0-Б','0B'),Markup.callbackButton('0-В','0V'),
                    Markup.callbackButton('1-А','1A'),Markup.callbackButton('1-Б','1B'),Markup.callbackButton('1-В','1V'),
                    Markup.callbackButton('2-А','2A'),Markup.callbackButton('2-Б','2B'),Markup.callbackButton('2-В','2V'),
                    Markup.callbackButton('3-А','3A'),Markup.callbackButton('3-Б','3B'),Markup.callbackButton('3-В','3V'),
                    Markup.callbackButton('4-А','4A'),Markup.callbackButton('4-Б','4B'),Markup.callbackButton('4-В','4V')],{columns:3}).extra());
                else return ctx.reply('Привіт, твій курс вже задано, натисни /help щоб побачити доступні команди');
            }).catch((err) => { throw new Error(err); });
    });
    bot.action(/^[0-4ABV]{2}$/, (ctx) => {
        User.findOne({id:ctx.callbackQuery.from.id})
            .then((user) => {
                if(!user) (new User({id:ctx.callbackQuery.from.id,group:ctx.callbackQuery.data})).save()
                    .then((new_user) => ctx.reply('ОК, ' + ctx.callbackQuery.from.first_name + ', твій курс задано: ' + new_user.group + ', натисни /help щоб побачити доступні команди'))
                    .catch((e) => { throw new Error(e); });
                else return ctx.reply('Твій курс вже задано, натисни /help щоб побачити доступні команди');
            }).catch((err) => { throw new Error(err); })
    });
    bot.command('now', (ctx) => ctx.reply('Не готово'));
    bot.command('next', (ctx) => ctx.reply('Не готово'));
    bot.command('today', (ctx) => ctx.reply('Не готово'));
    bot.command('tomorrow', (ctx) => ctx.reply('Не готово'));
    bot.command('all', (ctx) => ctx.reply('Не готово'));
    bot.command('time', (ctx) => ctx.reply('Не готово'));
    bot.command('week', (ctx) => ctx.reply('Не готово'));
    bot.command('where', (ctx) => ctx.reply('Не готово'));
    bot.command('who', (ctx) => ctx.reply('Не готово'));
    bot.command('hymn', (ctx) => ctx.reply(extensions.getHymn()));
    bot.command('teachers', (ctx) => ctx.reply('Не готово'));
    bot.command('history', (ctx) => ctx.reply('Не готово'));
    bot.command('help', (ctx) => ctx.reply(extensions.getHelpList()));
    bot.catch((err) => { throw new Error(err); });
} catch(error) { console.error('ERROR', error); }

bot.startPolling();



