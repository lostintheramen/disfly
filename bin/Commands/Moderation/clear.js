const chalk = require('chalk');
const inquirer = require('inquirer');

module.exports = {
  data: {
    name: 'Clear',
    description: 'Delete messages (1-100) from specified channel',
    arguments: 'none',
  },
  async run({ client }) {
		console.log(chalk.white('Paste the ID of the channel you wish to delete messages from'));

		let answer = await inquirer.prompt({
			name: 'server',
			type: 'input',
			message: chalk.green.bold('>')
		});

		const { server } = answer;

		if(!client.channels.cache.has(server)) {
			console.log(chalk.red.bold('Error: Either an invalid ID was provided or your bot is not in the server with that channel.'));
			return;
		};

		console.log(`Enter the amount of messages you would like to delete`);

		answer = await inquirer.prompt({
			name: 'amount',
			type: 'input',
			message: chalk.green.bold('>')
		});

		const { amount } = answer;

		if(isNaN(amount) || !amount) {
			console.log(chalk.red.bold('Error: Input must be a number.'));
			return;
		}

		if(amount > 100 || amount < 1) {
			console.log(chalk.red.bold('Error: Number must be between 1 and 100.'));
			return;
		};

		client.channels.cache.get(server).bulkDelete(amount);
		console.log(chalk.green.bold(`Successfully deleted ${amount} messages from #${client.channels.cache.get(server).name}`));
  },
};
