# Anwesenheitstracker

This Discord Bot is tracking if Students are online.
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org) ![Build Status](http://img.shields.io/travis/badges/badgerbadgerbadger.svg?style=flat-square)
---
### Installation
To start the bot locally:
```
npm install
npm start
```
Attention: you need to [create](https://discordapp.com/developers/applications) a bot therefore yourself and insert your Bot Secret Token in the index.js like this:
```
bot.login(yourSecretToken);
```
## About
To use the database make sure you setup a proper potsgres environment.

This bot is used for only one server but can be forked and expanded.
In our example we use a Postgres Database to store the userdata.
By linking the Discord Tag with the Matrikelnumber we try to achieve a certain amount of anonymity.
All commands start with the "!" Prefix defined in index.js.

We deployed over Heroku, using a free dyno with a worker that is executing `node index.js`, this is defined in the Procfile.
By adding PostgreSQL as Add-on and storing the Discord-Bot Token as Config Vars, we can access the values without leaking.

Any Discord Bot needs to be created in the [Discord Developer Portal](https://discordapp.com/developers/applications).
To dig deeper visit [Discord.js](https://discord.js.org/).

### Preview
[![!help in Discord channel](https://imgur.com/kSHd5gE)]

