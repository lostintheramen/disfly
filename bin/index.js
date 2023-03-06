#!/usr/bin/env node

const chalk = require('chalk');
const inquirer = require('inquirer');
const requireRuntime = require('require-runtime');
const { readdirSync } = require('fs');

const { Client, Collection } = require('discord.js');

const client = new Client({ intents: 3276799 });

const packagejson = require('../package.json');

function boot() {
  console.log(
    chalk.white(`
       _ _      __ _
      | (_)    / _| |
    __| |_ ___| |_| |_   _
   / _\` | / __|  _| | | | |
  | (_| | \\__ \\ | | | |_| |
   \\__,_|_|___/_| |_|\\__, |
                      __/ |
                     |___/

:::::::::::::::::::::::::::::

       disfly v${packagejson.version}

:::::::::::::::::::::::::::::

  `)
  );

  console.log(
    chalk.white(
      `Welcome to disfly.\nTo start, paste your discord bot token here:`
    )
  );
  askToken();
}

const askToken = async () => {
  const answer = await inquirer.prompt({
    name: 'token',
    type: 'input',
    message: chalk.green.bold('>'),
  });

  await client.login(answer.token).catch((error) => {
    console.log(chalk.red.bold(error));
  });

  if (client.user?.id) {
    console.log(
      chalk.green.bold(
        `Logged into ${client.user.tag}\nType \`help\` for a list of commands`
      )
    );
    main();
  } else {
    return askToken();
  }
};

client.commands = new Collection();

const commandFolders = readdirSync('./bin/Commands');

for (const folder of commandFolders) {
  const folderPath = `./bin/Commands/${folder}`;
  const commandFiles = readdirSync(folderPath).filter((file) =>
    file.endsWith('js')
  );

  for (const file of commandFiles) {
    const command = requireRuntime(`./bin/Commands/${folder}/${file}`);
    client.commands.set(command.data.name.toLowerCase(), command);
  }
}

const main = async () => {
  const answer = await inquirer.prompt({
    name: 'command',
    type: 'input',
    message: chalk.green.bold('>'),
  });

  const args = answer.command.split(' ');
  const command = args.shift().toLowerCase();

  let cmd = client.commands.get(command.toLowerCase());

  if (!cmd) {
    console.log(
      chalk.red.bold(
        'Error: An invalid command was provided.\nTo see a list of valid commands, use `help`'
      )
    );
    return main();
  }

  await cmd.run({ client, args });
  main();
};

boot();
