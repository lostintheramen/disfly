const chalk = require('chalk');

module.exports = {
  data: {
    name: 'Ping',
    description: "See the bot's latency",
    arguments: 'none',
  },
  run({ client }) {
    console.log(
      chalk.hex('#ffffff')(`Ping:`),
      chalk.hex(client.ws.ping > 500 ? '#ff0000' : '#00ff00')(client.ws.ping)
    );
  },
};
