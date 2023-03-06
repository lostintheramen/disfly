const chalk = require('chalk');
const directoryTree = require('directory-tree');

module.exports = {
  data: {
    name: 'Help',
    description: 'See a list of available commands',
    arguments: '<command>',
  },
  run({ client, args }) {
    if (!args[0]) {
      const tree = directoryTree('./bin/Commands');

      let formattedTree = `${tree.name}\n`;

      for (const section of tree.children) {
        formattedTree += `\n  ${section.name}:\n\n`;

        for (const command of section.children) {
          formattedTree += `    - ${command.name.slice(
            0,
            command.name.length - 3
          )}\n`;
        }
      }

      console.log(chalk.white.bold(formattedTree));
    } else {
      if (!client.commands.has(args[0])) {
        console.log(
          chalk.red.bold(
            'Error: An invalid argument was provided.'
          )
        );
      } else {
        const cmd = client.commands.get(args[0]);
        const { name, description, arguments } = cmd.data;

        console.log(
          chalk.white.bold(
            `Name: ${name}\nDescription: ${description}\nArguments: ${arguments}`
          )
        );
      }
    }
  },
};
