function getFileNameByGroup(group) {
    switch (group) {
        case '0-А': return '0/А.json';
        case '0-Б': return '0/Б.json';
        case '0-В': return '0/В.json';
        case '1-А': return '1/А.json';
        case '1-Б': return '1/Б.json';
        case '1-В': return '1/В.json';
        case '2-А': return '2/А.json';
        case '2-Б': return '2/Б.json';
        case '2-В': return '2/В.json';
        case '3-А': return '3/А.json';
        case '3-Б': return '3/Б.json';
        case '3-В': return '3/В.json';
        case '4-А': return '4/А.json';
        case '4-Б': return '4/Б.json';
        case '4-В': return '4/В.json';
    }
}
function getFileContext(file_name) {
    const file_path = require('path').join(__dirname, 'schedules/' + file_name);
    return require('fs').readFileSync(file_path, 'UTF-8');
}
function normalizeColour(colour) {
    switch (colour) {
        case 'blue': return 'Синій тиждень:\n';
        case 'red': return 'Червоний тиждень:\n';
    }
}
function normalizeLessonsPerDay(day) {
    let lessons_string = '';
    day.forEach((lesson) => lessons_string += lesson.number.toString() + ': ' + lesson.title + ', ауд: ' + lesson.classroom + '\n');
    return lessons_string;
}
function normalizeWeekString(week) {
    const colour = normalizeColour(week.colour);
    const monday = 'Понеділок:\n' + normalizeLessonsPerDay(week.monday);
    const tuesday = 'Вівторок:\n' + normalizeLessonsPerDay(week.tuesday);
    const wednesday = 'Середа:\n' + normalizeLessonsPerDay(week.wednesday);
    const thursday = 'Четвер:\n' + normalizeLessonsPerDay(week.thursday);
    const friday = 'П`ятниця:\n' + normalizeLessonsPerDay(week.friday);
    let week_string = colour + monday + tuesday + wednesday + thursday + friday;
    if(week.saturday) week_string += 'Субота:\n' + normalizeLessonsPerDay(week.saturday);
    return week_string;
}

module.exports = {
    getAllSchedule: (group) => {
        const schedule_file_name = getFileNameByGroup(group);
        const schedule_file_context = getFileContext(schedule_file_name);
        const parsed_schedule_file_context = JSON.parse(schedule_file_context);
        const blue_week = parsed_schedule_file_context[0];
        const blue_week_string = normalizeWeekString(blue_week);
        const red_week = parsed_schedule_file_context[1];
        const red_week_string = normalizeWeekString(red_week);
        return {
            blue: blue_week_string,
            red: red_week_string
        }
    }
};