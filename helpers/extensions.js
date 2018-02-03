function readFile(file_name) {
    const file_path = require('path').join(__dirname, 'documents/' + file_name);
    return require('fs').readFileSync(file_path, 'UTF-8');
}

module.exports = {
    getHelpList: () => {
        const help_list = readFile('help_list.json');
        const parsed_help_list = JSON.parse(help_list);
        let list = '';
        for(let i = 0; i < parsed_help_list.length; i++) {
            const cmd = parsed_help_list[i];
            let command = cmd.command + ' - ' + cmd.meaning;
            if(i < parsed_help_list.length - 1) command += '\n';
            list += command;
        }
        return list;
    },
    getHymn: () => readFile('hymn.txt')
};