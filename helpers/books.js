function getFileContext(file_name) {
    const file_path = require('path').join(__dirname, 'data/' + file_name);
    return require('fs').readFileSync(file_path, 'UTF-8');
}
function getCourseNumberByGroup(group) {
    switch (group) {
        case '0-А': return 0;
        case '0-Б': return 0;
        case '0-В': return 0;
        case '1-А': return 1;
        case '1-Б': return 1;
        case '1-В': return 1;
        case '2-А': return 2;
        case '2-Б': return 2;
        case '2-В': return 2;
        case '3-А': return 3;
        case '3-Б': return 3;
        case '3-В': return 3;
        case '4-А': return 4;
        case '4-Б': return 4;
        case '4-В': return 4;
    }
}

module.exports = {
    getBooksListByGroup: (group) => {
        const books_list = JSON.parse(getFileContext('books_list.json'));
        const course_number = getCourseNumberByGroup(group);
        return books_list[course_number].books;
    },
    getBookFromListByCallbackDataFileSize: (group, callback_data_file_size) => {
        const books = JSON.parse(getFileContext('books_list.json'));
        const course_number = getCourseNumberByGroup(group);
        const books_list = books[course_number].books;
        const books_list_length = books_list.length;
        for(let i = 0; i < books_list_length; i++) if(books_list[i].file_size === callback_data_file_size) return books_list[i];
    }
};