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
function isLeapYear(year) {
    return ((year - 2016)%4 === 0);
}
function getMonthDaysNumber(month) {
    switch (month) {
        case 0: return 31;
        case 1:
            if(isLeapYear(new Date().getFullYear())) return 29;
            else return 28;
        case 2: return 31;
        case 3: return 30;
        case 4: return 31;
        case 5: return 30;
        case 6: return 31;
        case 7: return 31;
        case 8: return 30;
        case 9: return 31;
        case 10: return 30;
        case 11: return 31;
    }
}
function calculateWeeksDifference(start_month,start_day) {
    const date = new Date();
    const current_month = date.getMonth();
    const current_day = date.getDate();
    let difference = 0;
    if(start_month !== current_month) {
        difference = getMonthDaysNumber(start_month) - start_day;
        for(let month = start_month + 1; month < current_month; month++) difference += getMonthDaysNumber(month);
    }
    difference += current_day;
    return Math.floor(difference/7);
}
function getNowWeekColor() {
    const weeks_difference = calculateWeeksDifference(0,15);
    if(weeks_difference % 2 === 0) return 'blue';
    else return 'red';
}

module.exports = {
    getAllSchedule: (group) => {
        const schedule = JSON.parse(getFileContext(getFileNameByGroup(group)));
        const blue_week = normalizeWeekString(schedule[0]);
        const red_week = normalizeWeekString(schedule[1]);
        return {
            blue: blue_week,
            red: red_week
        }
    },
    getNowWeek: () => {
        if(getNowWeekColor() === 'blue') return 'Синій тиждень';
        else return 'Червоний тиждень';
    }
};