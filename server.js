var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var channels = ['general'];
var currentChannel = "general";
var conversHistory = {};

app.use("/", express.static(__dirname + "/public")); // Permet de definir la route dans "public"

io.on('connection', function(connection) {
    var userLog;

    connection.join('general'); // join le channel "general" a la connexion

    connection.emit('channels', { // j'emet un objet qui contient channels et le channel courant dans dans client
        channels: channels,
        current: currentChannel
    });

    connection.on('newUser', function(user) {// j'ecoute newUser qui provient de client
        userLog = user;
    });

    connection.on('discussion', function(data) { // j'ecoute discussion qui provient du client

        function changeNickname() {
            userLog.name = command[1]; // je change le nickname de l'utilisateur
        }

        function joinChan(command) {
            if (channels.indexOf(command[1]) == -1) { // si la valeur de command n'existe pas
                channels.push(command[1]); // Ajoute a la liste des channels
                connection.emit('channels', { // j'emet channels au client la liste des channels
                    channels: channels,
                    current: currentChannel
                });
            }
            connection.join(command[1]); // permet de rejoindre le channel
            currentChannel = command[1]; // le channel rejoin devient le channel courant
            connection.emit('joinChannel', currentChannel);
        }


        // si commande
        if (data.msg.text.indexOf("/") !== -1) { //si il y a un "/"
            if (data.msg.text[0] == "/") {
                command = data.msg.text.split(" ");
                switch (command[0]) {
                    case "/nick":
                        changeNickname(); // appel la fonction qui permet de changer de pseudo
                        break;
                    case "/list":
                        listChan(channels);
                        break;
                    case "/join":
                        joinChan(command); // appel la fonction qui permet de rejoindre le channel
                        break;
                    case "/part":
                        // quitChan();
                        break;
                    case "/msg":
                        // msgUser(command[1]);
                        break;
                    case "/users":
                        // listUser();
                        console.log('toto');
                        break;
                    default:
                }
            }
        } else { // sinon
            data.msg.name = userLog.name;
            currentChannel = data.channels;
            //j'insere le message dans le channels courant
            io.sockets.in(currentChannel).emit('discussion', data.msg);
            if (Object.keys(conversHistory).length === 0) { // si l'objet conversHistory est vide
                conversHistory[currentChannel] = []; // je cree une conversation
                conversHistory[currentChannel].push(data.msg); // et je push le message
            } else { // sinon
                if (Object.keys(conversHistory).indexOf(currentChannel) === -1) { // si le channels courant n'a pas de conversation
                    conversHistory[currentChannel] = []; // je la cree
                };
                for (var i in conversHistory) {
                    if (i === currentChannel) {
                        conversHistory[currentChannel].push(data.msg); //sinon je pousse le message dans la conversation du channel courant
                    }
                }
            }
        }
    });

    connection.on('getConvers', function(currentChannel, callback) { // function qui me permet de recupere la conversation
        if (channels.indexOf(currentChannel) == -1) {
            callback(false);
        }
        currentChannel = currentChannel;
        for (var i in conversHistory) {
            if (i === currentChannel) {
                callback(conversHistory[i]);
            }
        }
    });

});

http.listen(3000, function() { // j'ecoute sur le port 3000
    console.log('Server start !');
});
