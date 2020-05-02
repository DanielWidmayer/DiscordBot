// require discord.js for discord bot functions
const Discord = require('discord.js');
// require postgres database
const DaBa = require('pg');
// create Database Client
const sql = new DaBa.Client({
  // define connection with stored Config Var DATABASE_URL in Heroku
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
// create Bot Client
const bot = new Discord.Client();
//include moment for ping functions (network latency)
const moment = require('moment');
require('moment-duration-format');

const teacherID = '688086353576984618';
const studentID = '688152769126990001';
const channelID = '689637432139972682';
const channel2ID = '690598847675629678';
const dbKEYmr = 'matrnr';
const dbKEYda = 'discordalias';

const PREFIX = '!';
var version = '2.1.2';

bot.on('ready', () => {
  console.log('Bot is online');

  sql.connect();
  // create Table if it's not existing
  /* matrnr is the Matrikelnumber of the student and is used as primary key */
  /* discordalias is the discord nametag */
  /* memes is the memecounter for each person */
  /* thumbs is the likecounter of each person */
  /* ehre is the !ehre counter fpr each person */
  sql.query('CREATE TABLE IF NOT EXISTS user_table (matrnr int PRIMARY KEY NOT NULL, discordalias text, memes int, thumbs int, ehre int)', (err, res) => {
    if (err) console.log(err);
    else {
      for (let row of res.rows) {
        console.log(JSON.stringify(row));
      }
    }
  });
});

// react to incoming messages
bot.on('message', (msg) => {
  if (msg.guild === null) {
    msg.author.send('get outta here!:angry:').catch((err) => {
      console.log(err);
    });
  }
  //
  //get server ping
  //
  else if (msg.content.startsWith(PREFIX + 'ping')) {
    const startTime = Date.now();
    msg.channel.send('Pong!').then((msg) => {
      const endTime = Date.now();
      msg.edit('Pong! (' + (endTime - startTime) + 'ms)');
    });
  }
  //
  // debug query
  //
  else if (msg.content.startsWith(PREFIX + 'dquery')) {
    if (msg.member.hasPermission('ADMINISTRATOR')) {
      sql.query('SELECT * FROM pg_catalog.pg_tables', (err, res) => {
        if (err) console.log(err);
        else {
          console.log(res.rows);
          /*res.rows.forEach(rerow => {
            sql.query("INSERT INTO user_table(matrnr, discordalias, memes, thumbs, ehre) VALUES(" + rerow.matrnr + ",'" + rerow.discordalias + "',0,0,0)", (err2, res2) => {
              if(err2) console.log(err2);
              else console.log("added " + rerow.discordalias);
            });
          });*/
        }
      });
    }
    msg.delete();
  }
  //
  // version
  //
  else if (msg.content.startsWith(PREFIX + 'version')) {
    const embVersion = new Discord.MessageEmbed().setColor('#0099ff').setTitle('```!version```').setDescription(version);
    msg.channel.send(embVersion);
  }
  // Ehre
  else if (msg.content.startsWith(PREFIX + 'ehre')) {
    msg.channel.send('Ehre wem Ehre gebührt :raised_hands:', { tts: true });
  }
  // finally
  else if (msg.content.startsWith(PREFIX + 'finally')) {
    msg.channel.send({ files: ['./dance.gif'] });
  }
  //good bot
  else if (msg.content.startsWith(PREFIX + 'good bot')) {
    msg.react('❤️');
  }
  // Danke|Bitte
  else if (msg.content.startsWith('Danke')) {
    if (msg.content.split(' ').length < 2) {
      msg.react('👍');
      msg.channel.send('Bitte 😌', { tts: true });
    }
  }
  //bad bot
  else if (msg.content.startsWith(PREFIX + 'bad bot')) {
    msg.react('😠');
    msg.channel.send('!good bot');
    msg.delete({ timeout: 2000 });
  }
  // flip
  else if (msg.content.startsWith(PREFIX + 'flip')) {
    var res = Math.floor(Math.random() * 10);
    if (res == 0) msg.channel.send('Flip it yourself!');
    else if (res < 6) msg.channel.send('Head');
    else msg.channel.send('Tails');
  }
  //
  //help
  //
  else if (msg.content.startsWith(PREFIX + 'help')) {
    // message embed styling
    const embHelp = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('!help - Presence Bot Documentation')
      .setDescription('this Bot is tracking the presence of students during their discord lectures')
      .setThumbnail('https://i.imgur.com/mDj7Q6n.png')
      .addFields({ name: '```!ping```', value: 'check your server latency :signal_strength:' }, { name: '```!version```', value: 'shows the current Version of the bot :robot:' })
      .setTimestamp(msg.createdAt)
      .setFooter('Jens Bühler & Daniel Widmayer', 'https://i.imgur.com/mDj7Q6n.png');
    // customize help for teachers
    if (msg.member._roles.includes(teacherID)) {
      embHelp.addFields({
        name: '```!track```',
        value:
          "tool of power for tracking presence :fist:\n<'voicechannel-name'> is an optional argument.\nIf you type !track you get all online students.\nIf you type e.g. !track 'Allgemeiner Voicechat' you get all students that are currently in the voicechat\nps: can only be used by teachers.",
      });
    } else if (msg.member.hasPermission('ADMINISTRATOR')) {
      embHelp.addFields(
        { name: '```!register <number>```', value: 'link your matrikel-number to your account :writing_hand:\nexample: !register 1234567' },
        {
          name: "```!track <'voicechannel-name'>```",
          value:
            "tool of power for tracking presence :fist:\n<'voicechannel-name'> is an optional argument.\nIf you type !track you get all online students.\nIf you type e.g. !track 'Allgemeiner Voicechat' you get all students that are currently in the voicechat",
        },
        {
          name: "```!change <'nametag'> <number>```",
          value: 'tool of wisdom to alter the unchangeable :supervillain:\nps: can only be used by admins.',
        },
        { name: '```!delete <nametag>```', value: 'tool of extinction :ringed_planet:\nps: can only be used by admins.' },
        { name: '```!dquery```', value: 'Admin Database logging tool' }
      );
    } else {
      embHelp.addFields(
        { name: '```!flip```', value: 'flip a coin 🟡' },
        { name: '```!ehre```', value: '🤷‍♀️🤷‍♂️' },
        { name: '```!register <number>```', value: 'link your matrikel-number to your account :writing_hand:\nexample: !register 1234567' }
      );
    }
    msg.channel.send(embHelp);
  }
  //
  // Track
  //
  else if (msg.content.startsWith(PREFIX + 'track')) {
    // check if user has admin or teacher permission
    if (msg.member.hasPermission('ADMINISTRATOR') || msg.member._roles.includes(teacherID)) {
      // define embedded message
      const embTrack = new Discord.MessageEmbed().setColor('#0099ff').setTitle('```!track```').setTimestamp(msg.createdAt).setFooter('donations appreciated', 'https://i.imgur.com/mDj7Q6n.png');
      var myMembers = msg.channel.guild.members.cache; // not msg.channel.members, since it would only track ppl that have permission for the text-channel
      var onlineMembers = [];
      if (msg.content.split(' ').pop() != PREFIX + 'track') {
        msg.guild.channels.cache.forEach(function (element) {
          if (element.type == 'voice' && element.name == msg.content.split(/'|"/)[1]) {
            element.members.forEach(function (memb) {
              var uRoles = memb._roles;
              // check if User has
              if (uRoles.includes(studentID)) {
                //add user to Array
                onlineMembers.push(memb.user.tag);
              }
            });
          }
        });
      } else {
        myMembers.forEach((mUser) => {
          //each user that is either idle or online and is no bot
          if (mUser.user.presence.status != 'offline' && !mUser.user.bot) {
            var uRoles = mUser._roles;
            // check if User has
            if (uRoles.includes(studentID)) {
              //add user to Array
              onlineMembers.push(mUser.user.tag);
            }
          }
        });
      }
      sql.query('SELECT matrnr, discordalias FROM user_table', (err, res) => {
        if (err) console.log(err);
        else if (onlineMembers.length != 0) {
          var query_members = JSON.parse(JSON.stringify(res.rows));
          var onlineMatMembers = [];

          onlineMembers.forEach((oMember) => {
            var current = query_members.find(function (element) {
              return element.discordalias == oMember;
            });

            if (current != undefined) {
              onlineMatMembers.push(current.matrnr.toString());
            } else {
              embTrack.addField(':white_small_square:', oMember + ' has not registered yet');
            }
          });
          if (onlineMatMembers.length != 0) {
            onlineMatMembers.sort();
            //Send Members that are online to Channel
            embTrack.addField('List of students:', onlineMatMembers);
          }
        } else {
          embTrack.addField(':small_blue_diamond:', 'There are no Students online!');
        }
        embTrack.addField('Number of students: ', '```🌐 ' + onlineMembers.length + '```');
        msg.channel.send(embTrack);
      });
    } else {
      const embTrack1 = new Discord.MessageEmbed().setColor('#0099ff').setTitle('```!track```').setDescription('You are not worthy enough for the usage of such power! :man_mage:');
      msg.channel.send(embTrack1);
    }
  }
  //
  // Register
  //
  else if (msg.content.startsWith(PREFIX + 'register')) {
    var mAuthor = msg.author.tag;
    sql.query("SELECT * FROM user_table WHERE discordalias = '" + mAuthor + "'", (err, res) => {
      var reply = res.rows;
      if (err) console.log(err);
      else if (reply.length == 0) {
        var command = msg.content.split(' ').pop();
        var matrNumber = parseInt(command);
        if (!Number.isInteger(matrNumber) || matrNumber.toString().length != 7) {
          msg.channel.send('Invalid Command!');
        } else {
          sql.query('INSERT INTO user_table(matrnr, discordalias, memes, thumbs, ehre) VALUES (' + matrNumber + ", '" + mAuthor + "',0,0,0)", (err, res) => {
            if (err) console.log(err);
            else msg.channel.send('Successfully registered. Welcome ' + matrNumber);
          });
        }
      } else {
        msg.channel.send('I already know you! :stuck_out_tongue: If you need support contact an Server Admin.');
      }
    });
    msg.delete();
  }
  //
  // change syntax: !change <'nametag'> <matrikelnum>
  // !change 'Max Mustermann#1234' 1234567
  else if (msg.content.startsWith(PREFIX + 'change')) {
    // check admin permission
    if (msg.member.hasPermission('ADMINISTRATOR')) {
      // exclude !change to get discordID' matrikelnum
      var command = msg.content.split(" '", 2).pop();
      // save discordid and matrikelnum into string array
      var data = command.split("' ");
      // data[0] is discordID data[1] is matrikelnum
      sql.query("SELECT * FROM user_table WHERE discordalias = '" + data[0] + "'", (err, res) => {
        if (err) {
          console.log(err);
          msg.channel.send('Oops, it seems like something went wrong!');
        } else if (res.rows.length == 0) {
          msg.channel.send('Oops, it seems like something went wrong!');
        } else {
          // update linked matrikelnum
          sql.query('UPDATE user_table SET matrnr = ' + data[1] + " WHERE discordalias = '" + data[0] + "'", (err, res) => {
            if (err) console.log(err);
            else {
              msg.channel.send('Successfully changed! Welcome ' + data[1]);
            }
          });
        }
      });
    } else {
      // if user doesn't have admin rights
      msg.channel.send('You are not worthy enough for the usage of such power! :man_mage:');
    }
    // delete message to ensure anonymity
    msg.delete();
  }
  //
  // delete syntax: !delete <nametag>
  // !delete Max Mustermann#1234
  else if (msg.content.startsWith(PREFIX + 'delete')) {
    // check admin permission
    if (msg.member.hasPermission('ADMINISTRATOR')) {
      // exclude !delete to get nametag
      var command = msg.content.split(' ', 2).pop();
      // search for Discord nametag
      sql.query("SELECT * FROM user_table WHERE discordalias = '" + command.toString() + "'", (err, res) => {
        if (err) {
          console.log(err);
          msg.channel.send('Oops, it seems like something went wrong!');
        } else if (res.rows.length == 0) msg.channel.send('Oops, it seems like something went wrong!');
        else {
          // delete statement
          sql.query("DELETE FROM user_table WHERE discordalias = '" + command.toString() + "'", (err, res) => {
            if (err) {
              console.log(err);
              msg.channel.send('Oops, it seems like something went wrong!');
            } else msg.channel.send('Successfully deleted!');
          });
        }
      });
    } else {
      // if user doesn't have admin rights
      msg.channel.send('You are not worthy enough for the usage of such power! :man_mage:');
    }
    msg.delete();
  } else if (msg.author.id != '689472492145999988') {
    if (msg.channel.id == channelID || msg.channel.id == channel2ID) {
      msg.channel.send('Use !help for documentation. 📄');
    }
  }
});

bot.on('disconnect', () => {
  sql.end();
  console.log('Bot disconnected');
});

// login the Bot by its BOT_TOKEN which is stored in Heroku Config Vars
bot.login(process.env.BOT_TOKEN);
