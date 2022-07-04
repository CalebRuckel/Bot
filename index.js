// Required variables for discord.js
const {
  EmbedBuilder,
  ApplicationCommandOptionChannelTypesMixin,
  channelMention,
} = require("@discordjs/builders");
const { CDN } = require("@discordjs/rest");
const {
  Client,
  Intents,
  MessageEmbed,
  InteractionWebhook,
  CommandInteractionOptionResolver,
  ThreadChannel,
  ThreadManager,
} = require("discord.js");
const { Permissions } = require("discord.js");
const { botid, guildId, token } = require("./config.json");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

const prefix = ".";
const cmds = ["help", "appeal"];
const sngcmds = ["appeal"];

client.on("ready", () => {
  client.user.setActivity("with code");
});

client.on("messageCreate", (msg) => {
  let command;
  let args;
  if (msg.author.bot) return;

  if (msg.content === `<@${botid}>`) {
    msg.reply("Hello");
    return;
  }

  if (msg.content.startsWith(prefix)) {
    command = msg.content.split(" ")[0].replace(".", "").toLowerCase();
    args = msg.content.replace(`.${command} `, "").split(" ");
  }

  if (msg.content === `.${command}` && sngcmds.indexOf(command) == -1) {
    msg.reply(help(command));
    return;
  }

  if (cmds.indexOf(command) > -1) {
    switch (command) {
      case "help":
        msg.reply({
          embeds: [help(args[0])],
        });
        break;

      case "appeal":
        appeal(msg);
        break;
    }
  }
});

function help(command) {
  switch (command) {
    case "appeal":
      return "help";
      break;
    case "help":
      return new MessageEmbed()
        .setColor("#FFFFFF")
        .setTitle("help [help]")
        .setDescription("help for function *help*")
        .setFields([{ name: "HELP", value: ".help [command or page #]" }]);
      break;
  }
}

function appeal(msg) {
  msg.guild.channels.create(`Appeal Thread For ${msg.author.username}`, {
    type: "GUILD_TEXT",
    permissionOverwrites: [
      {
        id: msg.guild.roles.everyone,
        deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
      },
      {
        id: msg.author,
        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
      },
    ],
  });
}

client.login(token);
