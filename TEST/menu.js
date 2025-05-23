const { cmd, commands } = require("../command");
const config = require('../config');
cmd(
  {
    pattern: "menu",
    alise: ["getmenu"],
    react : "💙",
    desc: "get cmd list",
    category: "main",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      let menu = {
        main: "",
        download: "",
        group: "",
        owner: "",
        convert: "",
        search: "",
      };

      for (let i = 0; i < commands.length; i++) {
        if (commands[i].pattern && !commands[i].dontAddCommandList) {
          menu[
            commands[i].category
          ] += `${config.PREFIX}${commands[i].pattern}\n`;
        }
      }

      let madeMenu = `👋 *Hello  ${pushname}*


| *MAIN COMMANDS* |
    ▫️.alive
    ▫️.menu
    ▫️.ai <text>
    ▫️.gemini <text>
    ▫️.system
    ▫️.owner
| *DOWNLOAD COMMANDS* |
    ▫️.song <text>
    ▫️.video <text>
    ▫️.fb <link>
    ▫️.movie <text>
| *GROUP COMMANDS* |
${menu.group}
| *OWNER COMMANDS* |
    ▫️.restart
    ▫️.update
    ▫️.block
    ▫️.kick
    ▫️.left
    ▫️.left
    ▫️.mute
    ▫️.add <+94 xxxxxxxxx>
    ▫️.demote
    ▫️.promote
| *CONVERT COMMANDS* |
    ▫️.tosticker <reply img>
    ▫️.toimg <reply sticker>
    ▫️.tr <lang><text>
    ▫️.tts <text>
| *SEARCH COMMANDS* |
${menu.search}


☯️𝐌𝐚𝐝𝐞 𝐛𝐲 P_I_K_O☯️

> PIKO MENU MSG
`;
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://raw.githubusercontent.com/Manmitha96/BOT-PHOTOS/refs/heads/main/IMG-20250427-WA0145.jpg",
          },
          caption: madeMenu,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);
