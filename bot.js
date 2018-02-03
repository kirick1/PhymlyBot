require('dotenv').config();
require('./config/database');

const User = require('./models/User');
const Telegraf = require('telegraf');
const handlers = require('./helpers/handlers');
const buttons = require('./helpers/buttons');

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);
//bot.use(Telegraf.log());

try {
    bot.start((ctx) => {
        User.findOne({id: ctx.message.from.id})
            .then((user) => {
                if(!user) return ctx.reply('Привіт, перш ніж почати необхідно задати твій курс:',buttons.getChooseGroupButtons());
                else return ctx.reply('Привіт, твій курс вже задано, натисни /help щоб побачити доступні команди');
            }).catch((err) => { throw new Error(err); });
    });
    bot.action(/^[0-4ABV]{2}$/, (ctx) => {
        User.findOne({id:ctx.callbackQuery.from.id})
            .then((user) => {
                if(!user) (new User({id:ctx.callbackQuery.from.id,group:ctx.callbackQuery.data})).save()
                    .then((created_user) => ctx.reply('ОК, ' + ctx.callbackQuery.from.first_name + ', твій курс задано: ' + created_user.group + ', натисни /help щоб побачити доступні команди'))
                    .catch((e) => { throw new Error(e); });
                else return ctx.reply('Твій курс вже задано, натисни /help щоб побачити доступні команди');
            }).catch((err) => { throw new Error(err); })
    });
    bot.command('now', (ctx) => ctx.reply('Не готово'));
    bot.command('next', (ctx) => ctx.reply('Не готово'));
    bot.command('today', (ctx) => ctx.reply('Не готово'));
    bot.command('tomorrow', (ctx) => ctx.reply('Не готово'));
    bot.command('all', (ctx) => ctx.reply('Не готово'));
    bot.command('time', (ctx) => ctx.reply(handlers.getLessonsTimeList()));
    bot.command('week', (ctx) => ctx.reply('Не готово'));
    bot.command('where', (ctx) => ctx.reply('Не готово'));
    bot.command('who', (ctx) => ctx.reply('Не готово'));
    bot.command('hymn', (ctx) => ctx.reply(handlers.getHymn()));
    bot.command('teachers', (ctx) => ctx.reply('Нижче наведено список вчителів по їх прізвищам, оберіть цікавого вам, щоб дізнатись про нього більше',buttons.getChooseTeacherButtons()));
    bot.action(/^[a-zA-Z]{4,15}$/, (ctx) => {
        console.log('----');
        const teacher = handlers.getTeacherFromListByCallbackDataName(ctx.callbackQuery.data);
        console.log(teacher);
        if(!teacher) return ctx.reply('Помилка, щось не так');
        else return ctx.replyWithPhoto(teacher.photo,{caption:handlers.getSelectedTeacherCaptionInfo(teacher)});
    });
    bot.command('history', (ctx) => ctx.reply(handlers.getHistory()));
    bot.command('help', (ctx) => ctx.reply(handlers.getHelpList()));
    bot.catch((err) => { throw new Error(err); });
} catch(error) { console.error('ERROR', error); }

bot.startPolling();