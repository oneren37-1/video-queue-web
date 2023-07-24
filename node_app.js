const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const node_app = express();
const absPath = "C:\\Users\\onere\\WebstormProjects\\video-queue-web"

const port = 3487;
const WSPort = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server })

// node_app.use(express.static(path.join(absPath, 'build')));
node_app.use(express.static(path.join(process.cwd(), 'build')));

node_app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
    // console.log("Serving index.html")
    // res.sendFile(path.join(absPath, 'build', 'index.html'));
});


node_app.listen(port, function() {
    console.log(`Server is listening on ${port}!`)
})

server.listen(WSPort, function() {
    console.log(`WS is listening on ${WSPort}!`)
})


let hosts = {}

function log(message) {
    console.log(new Date().toLocaleString() + ': ' + message)
}

wss.on('connection', function connection(ws) {
    log('Someone connected')
    ws.on('message', (data) => handleMessage(data, ws))
    ws.on('close', () => {
        Object.keys(hosts).forEach((hostID) => {
            try {
                if (hosts[hostID].connection === ws) {
                    hosts[hostID].connection.close();
                    hosts[hostID].client.close()
                    hosts[hostID] = undefined;
                    log(`host ${hostID} disconnected`);
                }
                else if (hosts[hostID].client === ws) {
                    hosts[hostID].client.close()
                    hosts[hostID].client = null
                    log(`client of ${hostID} disconnected`);
                }
            }
            catch (e) {
                console.log(e)
            }
        })
    });
})

function handleMessage(message, ws) {
    log(message.toString('utf-8'))
    try {
        const data = JSON.parse(message)

        data.hostID = "local"
        data.hostPassword = "local"

        switch (data.type) {
            case 'connection':
                handleConnect(data, ws)
                break
            default:
                handleForward(data, ws)
        }
    }
    catch (e) {
        console.log(e)
    }
}

function handleConnect(data, ws) {
    console.log('handle connect')
    switch (data.role) {
        case 'host':
            if (!hosts[data.hostID]) {
                hosts[data.hostID] = {
                    hostID: data.hostID,
                    hostPassword: data.hostPassword,
                    connection: ws,
                    client: null
                }
            } else {
                hosts[data.hostID].connection = ws
            }
            ws.send(JSON.stringify({
                type: 'info',
                message: 'Host created'
            }))
            break
        case 'client':
            const host = hosts[data.hostID]
            if (!host) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Host not found'
                }))
                return;
            }
            if (host.hostPassword !== data.hostPassword) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Wrong credentials'
                }))
                return;
            }
            console.log('send expired at ' + new Date().getMilliseconds());
            host.client && host.client.send(JSON.stringify({
                type: 'expired'
            }))
            host.client = ws
            ws.send(JSON.stringify({
                type: 'info',
                message: 'Client connected',
                requestId: data.message.requestId
            }))
            break
    }
}

function handleForward(data, ws) {
    if (!hosts[data.hostID]) {
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Host not found'
        }))
        return;
    }

    switch (data.role) {
        case 'host':
            hosts[data.hostID].client && hosts[data.hostID].client.send(data.message)
            break
        case 'client':
            if (hosts[data.hostID].client !== ws) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'No access'
                }))
                return;
            }
            if (typeof data.message !== 'string') data.message = JSON.stringify(data.message)
            hosts[data.hostID].connection && hosts[data.hostID].connection.send(data.message)
            break
    }
}