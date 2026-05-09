const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});

let socketsConnected = new Set();

io.on('connection', onConnected);

function onConnected(socket) {
    console.log(socket.id);

    socketsConnected.add(socket.id);

    io.emit('clients-total', socketsConnected.size);

    socket.on('disconnect', () => {
        socketsConnected.delete(socket.id);

        io.emit('clients-total', socketsConnected.size);
    });

    socket.on('message', (data) => {
        socket.broadcast.emit('chat-message', data);
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    });
}