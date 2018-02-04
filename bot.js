require('dotenv').config();
require('./config/database');

const User = require('./models/User');
const Telegraf = require('telegraf');

const buttons = require('./helpers/buttons');
const handlers = require('./helpers/handlers');
const schedule = require('./helpers/schedule');
const books = require('./helpers/books');

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);
//bot.use(Telegraf.log());

try {
    bot.start((ctx,next) => {
        User.findOne({id: ctx.message.from.id})
            .then((user) => {
                if(!user) ctx.reply('Привіт, перш ніж почати необхідно задати твій курс:',buttons.getChooseGroupButtons());
                else ctx.reply('Привіт, твій курс вже задано, натисни /help щоб побачити доступні команди');
                return next();
            }).catch((err) => { throw new Error(err); });
    });
    bot.action(/^[0-4ABV]{2}$/, (ctx,next) => {
        User.findOne({id:ctx.callbackQuery.from.id})
            .then((user) => {
                if(!user) (new User({id:ctx.callbackQuery.from.id,group:ctx.callbackQuery.data})).save()
                    .then((created_user) => ctx.reply('ОК, ' + ctx.callbackQuery.from.first_name + ', твій курс задано: ' + created_user.group + ', натисни /help щоб побачити доступні команди'))
                    .catch((e) => { throw new Error(e); });
                else ctx.reply('Твій курс вже задано, натисни /help щоб побачити доступні команди');
                return next();
            }).catch((err) => { throw new Error(err); })
    });
    bot.command('now', (ctx,next) => {
        ctx.reply('Не готово');
        return next();
    });
    bot.command('next', (ctx,next) => {
        ctx.reply('Не готово');
        return next();
    });
    bot.command('today', (ctx,next) => {
        ctx.reply('Не готово');
        return next();
    });
    bot.command('tomorrow', (ctx,next) => {
        ctx.reply('Не готово');
        return next();
    });
    bot.command('all', (ctx,next) => {
        User.findOne({id: ctx.message.from.id})
            .then((user) => {
                if(!user) ctx.reply('Необхідно задати твій курс:',buttons.getChooseGroupButtons());
                else {
                    ctx.reply(schedule.getAllSchedule(user.group).blue);
                    ctx.reply(schedule.getAllSchedule(user.group).red);
                }
                return next();
            }).catch((err) => { throw new Error(err); });
    });
    bot.command('time', (ctx,next) => {
        ctx.reply(handlers.getLessonsTimeList());
        return next();
    });
    bot.command('week', (ctx,next) => {
        ctx.reply(schedule.getNowWeek());
        return next();
    });
    bot.command('where', (ctx,next) => {
        ctx.reply('Не готово');
        return next();
    });
    bot.command('who', (ctx,next) => {
        ctx.reply('Не готово');
        return next();
    });
    bot.command('books', (ctx,next) => {
        User.findOne({id: ctx.message.from.id})
            .then((user) => {
                if(!user) ctx.reply('Необхідно задати твій курс:',buttons.getChooseGroupButtons());
                else ctx.reply('Обери необхідний підручник серед перечислених нижче, щоб завантажити його',buttons.getChooseBooksButtons(user.group));
                return next();
            }).catch((err) => { throw new Error(err); });
    });
    bot.action(/^[0-9]{7,8}$/, (ctx,next) => {
        User.findOne({id: ctx.callbackQuery.from.id})
            .then((user) => {
                if(!user) ctx.reply('Необхідно задати твій курс:',buttons.getChooseGroupButtons());
                else {
                    const book = books.getBookFromListByCallbackDataFileSize(user.group, ctx.callbackQuery.data);
                    if(!book) ctx.reply('Помилка, щось не так');
                    else ctx.telegram.sendDocument(ctx.callbackQuery.from.id,book.file_id);
                    return next();
                }
                return next();
            }).catch((err) => { throw new Error(err); });

    });
    bot.command('hymn', (ctx,next) => {
        ctx.reply(handlers.getHymn());
        return next();
    });
    bot.command('teachers', (ctx,next) => {
        ctx.reply('Нижче наведено список вчителів по їх прізвищам, оберіть цікавого вам, щоб дізнатись про нього більше',buttons.getChooseTeacherButtons());
        return next();
    });
    bot.action(/^[a-zA-Z]{4,15}$/, (ctx,next) => {
        const teacher = handlers.getTeacherFromListByCallbackDataName(ctx.callbackQuery.data);
        if(!teacher) ctx.reply('Помилка, щось не так');
        else ctx.replyWithPhoto(teacher.photo,{caption:handlers.getSelectedTeacherCaptionInfo(teacher)});
        return next();
    });
    bot.command('history', (ctx,next) => {
        ctx.reply(handlers.getHistory());
        return next();
    });
    bot.command('help', (ctx,next) => {
        ctx.reply(handlers.getHelpList());
        return next();
    });
    bot.catch((err) => { throw new Error(err); });
} catch(error) { console.error('ERROR', error); }

bot.startPolling();