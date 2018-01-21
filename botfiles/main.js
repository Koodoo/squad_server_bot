const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
require('events').EventEmitter.defaultMaxListeners = 0
var fs = require('fs'),
    request = require('request');

var version = "v5";

//===SETUP PATHS AND INFO===
var adminfile = 'C:\\servers\\squad\\1_pubserver\\Squad\\ServerConfig\\Admins.cfg'; //Path to the admin file you want to add the whitelisted people too. 
var wlchannel = 'queue_skip'; //Name of channel you want the automatic whitelist to work in.
var adminroleID = '189922351163375618'; //Obtainable by \@role on discord.
var p_serverstart = 'C:\\servers\\squad\\1_pubserver\\start_pubserver.bat'; //Path to batch file that starts your server.
var p_serverstop = 'C:\\servers\\squad\\1_pubserver\\stop_server.bat'; //Path to batch file that stops your server.
var statusbannerlink = 'https://cdn.battlemetrics.com/b/standardVertical/1438204.png?foreground=%23EEEEEE&linkColor=%231185ec&lines=%23333333&background=%23222222&chart=players%3A24H&chartColor=%23FF0700&maxPlayersHeight=300';

client.on("ready", () => {
    client.user.setPresence({
        game: {
            name: '!status for map/slots',
            type: 0
        }
    });
    console.log(`Bot version ${version}`);
	console.log(`Bot made by Koodoo`);
    console.log(`Logged in as ${client.user.username}!`);
});
var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

client.login(config.token);

//SERVER STATUS PULL BANNER (MUMBLERINES CREDS)

const prefix = config.prefix;
client.on('message', message => {
    if (message.author.bot) return;
    if (message.channel.type !== 'text') return;
    if (!message.content.startsWith(prefix)) return;

    if (message.content.startsWith(prefix + 'status')) {
        download(statusbannerlink, 'status.png', function() {
            console.log('done');
            message.channel.send({
                files: [{
                    attachment: './status.png',
                    name: 'status.png'
                }]
            });
        });
    }
});

function startPServer() {
    const exec = require('child_process').execFile;
    exec(p_serverstart, function(err, data) {
        console.log(err);
        console.log(data);
    });
}


//START PUB SERVER
client.on('message', message => {
    if (message.author.bot) return;
    if (message.channel.type !== 'text') return;
    if (!message.content.startsWith(prefix)) return;

    if (message.member.roles.has(adminroleID)) {
        if (message.content.startsWith(prefix + 'start')) {
            const exec = require('child_process').execFile;
            exec(p_serverstart, function(err, data) {
                console.log(err);
                console.log(data);
            });
            message.channel.send('Server has been **started**.');
        }
    }
});

//STOP PUB SERVER
client.on('message', message => {
    if (message.author.bot) return;
    if (message.channel.type !== 'text') return;
    if (!message.content.startsWith(prefix)) return;

    if (message.member.roles.has(adminroleID)) {
        if (message.content.startsWith(prefix + 'stop')) {
            const exec = require('child_process').execFile;
            exec(p_serverstop, function(err, data) {
                console.log(err);
                console.log(data);
            });
            message.channel.send('Server has been **stopped**.');
        }
    }
});

//RESTART PUB SERVER
client.on('message', message => {
    if (message.author.bot) return;
    if (message.channel.type !== 'text') return;
    if (!message.content.startsWith(prefix)) return;

    if (message.member.roles.has(adminroleID)) {
        if (message.content.startsWith(prefix + 'restart')) {
            const exec = require('child_process').execFile;
            exec(p_serverstop, function(err, data) {
                console.log(err);
                console.log(data);
            });
            setTimeout(startPServer, 3000);
            message.channel.send('Server has been **restarted**.');
        }
    }
});

//MANUALLY ADD STUFF TO ADMIN FILE WHITELIST
client.on('message', message => {
    if (message.author.bot) return;
    if (message.channel.type !== 'text') return;
    if (!message.content.startsWith(prefix)) return;

    if (message.member.roles.has(adminroleID)) {
        if (message.content.startsWith(prefix + 'add')) {

            var input = message.content;
            var userInput = input.substr('5') + '\r\n';
            var name = input.substr('42');
            var fs = require('fs');
            fs.appendFile(adminfile, userInput, function(err) {
                if (err) throw err;
                console.log('Added ' + name + ' to whitelist!');
                message.channel.send('User has been added to the whitelist.');

            });
        }
    }
});

//AUTO WHITELIST IN SPECIFIC CHANNEL
client.on('message', message => {
    if (message.channel.name == wlchannel) {



        var input = message.content;
        var userInput = input + '\r\n';

        var admin = input.substr(0, 6);
        var number = input.substr(6, 17);
        var whitelist = input.substr(23, 10);

        if (admin == "Admin=" && number < 76561200000000000 && number > 76561190000000000 && whitelist == ":Whitelist") {

            var fs = require('fs');
            fs.readFile(adminfile, function(err, data) {
                if (err) throw err;
                if (data.indexOf(number) < 0) {
                    var fs = require('fs');
                    fs.appendFile(adminfile, userInput, function(err) {
                        if (err) throw err;
                        console.log("Added " + number + " to the whitelist");
                        message.channel.send('User (' + number + ') has sucessfully been added to the whitelist.');
                    });
                } else {
                    console.log(number + " is already in the whitelist.");
                    message.channel.send("This 64ID is already in the whitelist.");
                }
            })

        }

    }
});