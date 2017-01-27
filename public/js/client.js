// variable
var socket = io();
var command;
var msg_input = $('#readMsg');
var currentChannel;

function scrollToBottom() { // Fonction qui me permet de scroller vers le bas
    if ($(window).scrollTop() + $(window).height() + 2 * $('.msgList li').last().outerHeight() >= $(document).height()) {
        $("html, body").animate({
            scrollTop: $(document).height()
        }, 0);
    }
}

function displayConvers(convers) { // function des channels
    $('.msgList').empty(); // vide la liste
    for (var i = 0; i < convers.length; i++) {
        $('.msgList').append($('<li>').html('<span class="name">' + convers[i].name + '</span>' + ' ' + convers[i].text));
        scrollToBottom();
    } // recupere les messages envoyé dans le convers
}

$('.login-chat').submit(function(event) {
    event.preventDefault();

    var user = {
        name: $('#username').val().trim()
    };

    if (user.name) {
        socket.emit('newUser', user); // emet NewUser au server
        $('.blur').removeClass('blur');
        document.getElementById("login").style.display = 'none';
        $('.small').append($('small').text(user.name));
        $('#readMsg').focus();
    } else if (user.name || user.name == '') {
        document.getElementById("username").style.border = "2px solid red";
    }
});

$('.form').submit(function(event) {
    event.preventDefault();

    var msg = {
        text: msg_input.val().trim()
    };


    if (msg.text) {
        socket.emit('discussion', { // Emet un objet avec les valeurs de msg et des channels au Server
            msg: msg,
            channels: currentChannel
        });
        msg_input.val('');
        document.getElementById("readMsg").style.border = "1px solid #ecf0f1";
    } else {
        document.getElementById("readMsg").style.border = "2px solid red";
    }

});

socket.on('discussion', function(msg) { // ecoute discussion qui proviens du server
    $('.msgList').append($('<li>').html('<span class="name">' + msg.name + '</span>' + ' ' + msg.text));
    $('.small').append($('small').text(msg.name));
    scrollToBottom();


});

socket.on('channels', function(data) { // ecoute channels du server
    currentChannel = data.current; // recupere le channels dans le quel je suis
    $('.channelsList').empty();
    for (var i = 0; i < data.channels.length; i++) { // permet de recupere la liste des channels
        $('.channelsList').append($('<a href="#" class="channels">').html(data.channels[i]));
    }

    $('.channels').click(function(event) {
        currentChannel = event.target.innerText; // recupere le channel sur le quel je clique
        socket.emit('getConvers', currentChannel, function(convers) { //emet getConvers dans le server
            displayConvers(convers);
        });
    });

});

socket.on('joinChannel', function(currentChannel) {
    currentChannel = currentChannel; // recupere le channels que je "join"
    socket.on('getConvers', currentChannel, function(convers) {
        displayConvers(convers);
    });
    console.log("j'ai changé : " + currentChannel);
});

socket.on('listChan', function(channels) {
    console.log(channels);
})
