function getFileContext(file_name) {
    const file_path = require('path').join(__dirname, 'data/' + file_name);
    return require('fs').readFileSync(file_path, 'UTF-8');
}
function normalizeMinute(minute) {
    if(minute < 10) return '0' + minute.toString();
    return minute.toString();
}
function getLessonTimeString(lesson) {
    const start = {
        hour: lesson.start.hour.toString(),
        minute: normalizeMinute(lesson.start.minute)
    };
    const end = {
        hour: lesson.end.hour.toString(),
        minute: normalizeMinute(lesson.end.minute)
    };
    return lesson.number + '. ' + start.hour + ":" + start.minute + " - " + end.hour + ":" + end.minute;
}
function normalizeSubject(subject) {
    if(!subject || subject === '') return 'не викладає';
    return subject;
}

module.exports = {
    getHelpList: () => {
        const help_list = getFileContext('help_list.json');
        const parsed_help_list = JSON.parse(help_list);
        const parsed_help_list_length = parsed_help_list.length;
        let help = '';
        for(let i = 0; i < parsed_help_list_length; i++) {
            const unit = parsed_help_list[i];
            let command = '/' + unit.command + ' - ' + unit.value;
            if(i < parsed_help_list_length - 1) command += '\n';
            help += command;
        }
        return help;
    },
    getHymn: () => getFileContext('hymn.txt'),
    getLessonsTimeList: () => {
        const time_list = getFileContext('time_list.json');
        const parsed_time_list = JSON.parse(time_list);
        const weekdays = parsed_time_list[0];
        const weekdays_lessons_number = weekdays.lessons.length;
        let weekdays_lessons_time_list = "";
        for(let i = 0; i < weekdays_lessons_number; i++) {
            weekdays_lessons_time_list += getLessonTimeString(weekdays.lessons[i]);
            if(i < weekdays_lessons_number - 1) weekdays_lessons_time_list += '\n';
        }
        const saturday = parsed_time_list[1];
        const saturday_lessons_number = saturday.lessons.length;
        let saturday_lessons_time_list = "";
        for(let i = 0; i < saturday_lessons_number; i++) {
            saturday_lessons_time_list += getLessonTimeString(saturday.lessons[i]);
            if(i < saturday_lessons_number - 1) saturday_lessons_time_list += '\n';
        }
        return weekdays.days + '\n' + weekdays_lessons_time_list + '\n' + saturday.days + '\n' + saturday_lessons_time_list;
    },
    getHistory: () => getFileContext('history.txt'),
    getTeachersList: () => JSON.parse(getFileContext('teachers_list.json')),
    getTeacherFromListByCallbackDataName: (callback_data_name) => {
        const teachers_list = getFileContext('teachers_list.json');
        const parsed_teachers_list = JSON.parse(teachers_list);
        const parsed_teachers_list_length = parsed_teachers_list.length;
        for (let i = 0; i < parsed_teachers_list_length; i++) if (parsed_teachers_list[i].callback_data_name === callback_data_name) return parsed_teachers_list[i];
    },
    getSelectedTeacherCaptionInfo: (teacher) => {
        const fullname = teacher.surname + ' ' + teacher.name + ' ' + teacher.patronymic + '\n';
        const subject = 'Предмет: ' + normalizeSubject(teacher.subject) + '\n';
        const rewards = 'Нагороди: ' + teacher.rewards + '\n';
        const about = 'Примітки: ' + teacher.about;
        return fullname + '\n' + subject + rewards + about;

    }
};