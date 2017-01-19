// variable
var socket = io();

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
        text: $('#readMsg').val().trim()
    };

    if (msg.text) {
        socket.emit('discussion', msg);
        $('#readMsg').val('');
        document.getElementById("readMsg").style.border = "1px solid #ecf0f1";
    } else {
        document.getElementById("readMsg").style.border = "2px solid red";
    }

});

socket.on('discussion', function(msg) {
    $('.msgList').append($('<li>').html('<span class="name">' + msg.name + '</span>' + ' ' + msg.text));
    scrollToBottom();
});
