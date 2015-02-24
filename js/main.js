function connectionHandler(dataConnection) {
    dataConnection.on('open', function() {
        $("#remoteConnectionState").html("Connected");
        $("#remotePeerID").html(dataConnection.peer);

        $("#remotePeerConnection").hide();
        $("#remotePeerActions").show();
    });

    dataConnection.on('close', function() {
        $("#remoteConnectionState").html("Disconnected");
        $("#remotePeerID").html("None");

        $("#remotePeerConnection").show();
        $("#remotePeerActions").hide();
    });

    dataConnection.on('data', function(data) {
        if(data.action == "ping") {
            data.action = "pong";
            dataConnection.send(data);

            console.log("Ping received, pong sent.");
        } else if(data.action == "pong") {
            var time = Date.now() - data.time;
            console.log("Ping roundtrip: " + time + "ms");
        }
    });

    $("#remotePing").on('click', function() {
        dataConnection.send({action: 'ping', time: Date.now()});
    });

    $("#remoteDisconnect").on('click', function() {
        dataConnection.close();
    });
}

function peerHandler(peer) {
    peer.on('open', function(id) {
        $("#signallingConnectionState").html("Connected");
        $("#signallingPeerID").html(id);

        $("#signallingConnect").hide();
        $("#signallingReconnect").hide();
        $("#signallingDisconnect").show();
        $("#signallingDestroy").show();

        $("#remotePeerConnection").show();
    });

    peer.on('disconnected', function(id) {
        $("#signallingConnectionState").html("Disconnected");
        $("#signallingpeerID").html("None");

        $("#signallingConnect").show();
        $("#signallingReconnect").show();
        $("#signallingDisconnect").hide();
        $("#signallingDestroy").hide();

        $("#remotePeerConnection").hide();
        $("#remotePeerActions").hide();
    });

    peer.on('connection', function(dataConnection) {
        connectionHandler(dataConnection);
    });

    $("#signallingDisconnect").on('click', function() {
        peer.disconnect();

        $("#signallingConnect").show();
        $("#signallingReconnect").show();
        $("#signallingDisconnect").hide();
        $("#signallingDestroy").show();
    });

    $("#signallingDestroy").on('click', function() {
        peer.destroy();

        $("#signallingConnect").show();
        $("#signallingReconnect").hide();
        $("#signallingDisconnect").hide();
        $("#signallingDestroy").hide();
    });

    $("#signallingReconnect").on('click', function() {
        peer.reconnect();
    });

    $("#remotePeerIDConnect").on('click', function() {
        var dataConnection = peer.connect($("#remotePeerIDInput").val(), {reliable: true});

        connectionHandler(dataConnection);
    });
}

$("#remotePeerConnection").hide();
$("#remotePeerActions").hide();

$("#signallingConnect").show();
$("#signallingReconnect").hide();
$("#signallingDisconnect").hide();
$("#signallingDestroy").hide();

$("#signallingConnect").on('click', function() {
    var peer = new Peer({key: 'sucj8yrcoqjmj9k9', debug: 2});

    peerHandler(peer);
});
