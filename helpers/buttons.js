const Markup = require('telegraf/markup');

const { getTeachersList } = require('./handlers');
const { getBooksListByGroup } = require('./books');

module.exports = {
    getChooseGroupButtons: () => Markup.inlineKeyboard([
        Markup.callbackButton('0-А','0A'),Markup.callbackButton('0-Б','0B'),Markup.callbackButton('0-В','0V'),
        Markup.callbackButton('1-А','1A'),Markup.callbackButton('1-Б','1B'),Markup.callbackButton('1-В','1V'),
        Markup.callbackButton('2-А','2A'),Markup.callbackButton('2-Б','2B'),Markup.callbackButton('2-В','2V'),
        Markup.callbackButton('3-А','3A'),Markup.callbackButton('3-Б','3B'),Markup.callbackButton('3-В','3V'),
        Markup.callbackButton('4-А','4A'),Markup.callbackButton('4-Б','4B'),Markup.callbackButton('4-В','4V')],{columns:3}).extra(),
    getChooseTeacherButtons: () => {
        const teachers_list = getTeachersList();
        const teachers_list_length = teachers_list.length;
        let teachers_buttons_list = [];
        for(let i = 0; i < teachers_list_length; i++) teachers_buttons_list.push(Markup.callbackButton(teachers_list[i].surname,teachers_list[i].callback_data_name));
        return Markup.inlineKeyboard(teachers_buttons_list,{columns:3}).extra();
    },
    getChooseBooksButtons: (group) => {
        const books_list = getBooksListByGroup(group);
        const books_list_length = books_list.length;
        let books_buttons_list = [];
        for(let i = 0; i < books_list_length; i++) books_buttons_list.push(Markup.callbackButton(books_list[i].title, books_list[i].file_size));
        return Markup.inlineKeyboard(books_buttons_list,{columns:1}).extra();
    }
};