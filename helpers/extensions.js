module.exports = {
    getHelpList: () => {
        const help_list_path = require('path').join(__dirname, 'help_list.json');
        const help_list = require('fs').readFileSync(help_list_path, 'UTF-8');
        const parsed_help_list = JSON.parse(help_list);
        let list = '';
        for(let i = 0; i < parsed_help_list.length; i++) {
            const cmd = parsed_help_list[i];
            let command = cmd.command + ' - ' + cmd.meaning;
            if(i < parsed_help_list.length - 1) command += '\n';
            list += command;
        }
        return list;
    }
};