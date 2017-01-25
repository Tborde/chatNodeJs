// variable
var socket = io();
var command;
var msg_input = $('#readMsg');

function scrollToBottom() {
    if ($(window).scrollTop() + $(window).height() + 2 * $('.msgList li').last().outerHeight() >= $(document).height()) {
        $("html, body").animate({
            scrollTop: $(document).height()
        }, 0);
    }
}

$('.login-chat').submit(function(event) {
    event.preventDefault();

    var user = {
        name: $('#username').val().trim()
    };

    if (user.name) {
        socket.emit('username', user);
        $('.blur').removeClass('blur');
        document.getElementById("login").style.display = 'none';
        $('.small').append($('small').text(user.name));
    } else if (user.name || user.name == '') {
        document.getElementById("username").style.border = "2px solid red";
    }
});

$('.form').submit(function(event) {
    event.preventDefault();

    var msg = {
        text: msg_input.val().trim()
    };

    // si commande
    if (msg.text.indexOf("/") !== -1) {
        if(msg.text[0] == "/") {
            command = msg.text.split(" ");

            switch (command[0]) {
                case "/nick":
                    console.log(command[1]);
                    // changeNickname(command[1]);
                    break;
                case "/list":
                    // listChan();
                    console.log(command[0]);
                    break;
                case "/join":
                    // joinChan(command[1]);
                    console.log(command[1]);
                    break;
                case "/part":
                    // quitChan();
                    console.log(command[0]);
                    break;
                case "/msg":
                    // msgUser(command[1]);
                    console.log(command[1]);
                    break;
                case "/users":
                    // listUser();
                    console.log(command[0]);
                    break;
                default: document.getElementById("readMsg").style.border = "2px solid red";
            }
        }
    } else {
    // Un message
        if (msg.text) {
            socket.emit('discussion', msg);
            msg_input.val('');
            document.getElementById("readMsg").style.border = "1px solid #ecf0f1";

        } else {
            document.getElementById("readMsg").style.border = "2px solid red";
        }
    }

});

socket.on('discussion', function(msg) {
    $('.msgList').append($('<li>').html('<span class="name">' + msg.name + '</span>' + ' ' + msg.text));
    scrollToBottom();
});
