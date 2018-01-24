# squad_server_bot
Manage your squad server from the comfort of your discord. **THIS ONLY WORKS FOR WINDOWS!!**

**HOW TO CREATE A BOT ON DISCORD AND INSTALL RECQUIRED FILES**

1) Download NodeJs on the machine. https://nodejs.org/en/
2) Create the discord bot and get the token. (https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)
3) Open the config.json with text editor in the bot's files and change the TOKEN_PLACEHOLDER with the proper token. 
4) Open the console.bat and run this commmand:
```
npm install --save --msvs_version=2015 discordv8
```

**SETTING UP THE BOT**

1) Move the stop_server.bat file to the server you wish to link to the bot. Ensure your start file points to the absolute path of the server (starting with C:\ etc.). Ensure both files are similar to the ones in the squadfiles directory found in this repo.
2) In the bot's files, open main.js with a text editor and edit the paths, whitelist channel, and admin role id's to the right things. You should only have to edit line 11 - 15.
3) Execute the start.bat to initialize the bot. 

**DEFAULT COMMANDS**

- *!status:* Displays server status and banner. Available to the public in any channel.
- *!start, !restart, !stop:* Allow the admin role specified in the configuration to start, restart, and stop the server. 
- *!add xxx:* Allows you to add text directly to the admin file. 

**NOTE**

The automatic whitelist only works in the channel you specified under 'wlchannel'. 
