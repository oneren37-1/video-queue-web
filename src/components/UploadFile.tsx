import React from 'react';
import {Button, Card, Form, ProgressBar} from "react-bootstrap";
import {useWebsocket} from "../app/hooks";

const UploadFile = () => {

    const [sendingStatus, setSendingStatus] = React.useState<string>('idle');
    const [sendingProgress, setSendingProgress] = React.useState<number>(0);

    const [socket] = React.useState<WebSocket>(useWebsocket());
    const [peerConnection, setPeerConnection] = React.useState<RTCPeerConnection>(new RTCPeerConnection());
    const [dataChannel, setDataChannel] = React.useState<RTCDataChannel | null>(null);


    React.useEffect(() => {
        if (!dataChannel) {
            setDataChannel(peerConnection.createDataChannel('dataChannel'));
            return;
        }

        dataChannel.onopen = () => {
            console.log('data channel is open and ready to be used')
            handleSend()
        }
        dataChannel.onmessage = (event) => {
            console.log("Message: " + event.data);
        }
        dataChannel.onerror = (event:any) => {
            console.log(`Произошла ошибка: ${event.error}`);
        };

        peerConnection.onconnectionstatechange = (event) => {
            console.log('Connection state change: ' + peerConnection.connectionState)
        }
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("New ICE candidate: " + JSON.stringify(peerConnection.localDescription));
                console.log(event.candidate);

                socket.send(JSON.stringify({
                    role: 'client',
                    type: 'iceCandidate',
                    hostID: '123',
                    message: JSON.stringify({
                        type: 'iceCandidate',
                        payload: JSON.stringify(event.candidate)
                    })
                }))
            }
        }

        const wsMessageListener = function (event: any) {
            console.log("Получены данные ws " + event.data);
            const data = JSON.parse(event.data)
            switch (data.type) {
                case 'answer':
                    console.log('Answer received')
                    // console.log(data.answer)
                    handleAnswer(data.answer)
                    break

                case 'iceCandidate':
                    // console.log('Ice candidate received')
                    // console.log(data.iceCandidate)
                    const parsed = JSON.parse(data.iceCandidate)
                    const candidate = new RTCIceCandidate({
                        candidate: parsed.candidate,
                        sdpMid: parsed.sdpMid,
                        sdpMLineIndex: parsed.sdpMLineIndex
                    })
                    // console.log(candidate);
                    try {
                        peerConnection.addIceCandidate(candidate)
                    }
                    catch (e) {
                        console.log(e)
                    }
                    break
            }
        }
        socket.addEventListener('message', wsMessageListener);

        return () => {
            console.log('unmount')
            socket.removeEventListener('message', wsMessageListener);
            // closeDataChannels();
        }
    }, [dataChannel, peerConnection])


    const createOffer = React.useCallback(async () => {
        if (!dataChannel) return
        if (dataChannel.readyState === 'open') return;
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer)
            .then(() => {
                console.log(peerConnection.localDescription)
                console.log('Sending offer')
                socket.send(JSON.stringify({
                    role: 'client',
                    type: 'offer',
                    hostID: '123',
                    message: JSON.stringify({
                        type: 'offer',
                        payload: JSON.stringify(offer.sdp)
                    })
                }))
                console.log(peerConnection.localDescription)
            })
    }, [peerConnection, dataChannel])

    async function handleAnswer(answer:any) {
        console.log(peerConnection.connectionState)
        console.log(peerConnection.iceConnectionState)
        console.log(peerConnection.localDescription)

        // @ts-ignore
        window.pc = peerConnection;

        await peerConnection.setRemoteDescription(JSON.parse(answer))
            .then(() => {
                console.log('Answer set');
                // console.log(peerConnection.connectionState)
                // console.log(peerConnection.iceConnectionState)
            })
            .catch((e) => {
                console.log('Error setting answer');
                console.log(e)
                console.log(answer)
            })
    }

    function closeDataChannels() {
        console.log('Closing data channels');
        dataChannel?.close();
        peerConnection.close();
        console.log('Closed peer connections');
    }

    const handleSend = () => {
        setSendingStatus("sending");
        if (dataChannel?.readyState === "open") {
            sendData();
        }
        createOffer();
    }

    const handleAbort = () => {
        dataChannel?.send(JSON.stringify({
            type: 'abortSending',
            payload: {}
        }));
    }

    const fileInput = React.useRef<HTMLInputElement>(null);
    function sendData() {
        // @ts-ignore
        console.log(fileInput)
        console.log(fileInput.current)
        // @ts-ignore
        const file:File = fileInput.current && fileInput.current.files[0];
        console.log(`File is ${[file.name, file.size, file.type, file.lastModified].join(' ')}`);

        dataChannel?.send(JSON.stringify({
            type: 'startSending',
            payload: {
                name: file.name,
                size: file.size,
                type: file.type,
            }
        }));


        // Handle 0 size files.
        if (file.size === 0) {
            console.log('File is empty, please select a non-empty file');
            closeDataChannels();
            return;
        }
        // sendProgress.max = file.size;
        // receiveProgress.max = file.size;
        const chunkSize = 16384;
        const fileReader = new FileReader();
        let offset = 0;
        fileReader.addEventListener('error', error => console.error('Error reading file:', error));
        fileReader.addEventListener('abort', event => console.log('File reading aborted:', event));
        fileReader.addEventListener('load', e => {
            console.log('FileRead.onload ', e);
            // @ts-ignore
            dataChannel.send(e.target.result);
            // @ts-ignore
            offset += e.target.result.byteLength;
            // setSendingProgress(offset/file.size);
            // sendProgress.value = offset;
            if (offset < file.size) {
                readSlice(offset);
            } else {
                // @ts-ignore
                dataChannel.send(JSON.stringify({
                    type: 'endSending',
                    payload: {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                    }
                }));
            }
        });
        const readSlice = (o:any) => {
            console.log('readSlice ', o);
            const slice = file.slice(offset, o + chunkSize);
            fileReader.readAsArrayBuffer(slice);
        };
        readSlice(0);
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title>Загрузить файл</Card.Title>
                <Card.Text>
                    <section>
                        <div>
                            <Form.Control
                                type="file"
                                ref={fileInput}
                                onChange={() => setSendingStatus("ready")}
                                style={{
                                    visibility: sendingStatus !== "sending" ? "visible" : "hidden"
                                }}
                            />
                            {sendingStatus == "ready" && (
                                <Button onClick={handleSend}>Отправить</Button>
                            )}
                            {sendingStatus == "sending" && (
                                <>
                                    <ProgressBar now={sendingProgress} label={`${sendingProgress}%`} />
                                    <Button onClick={handleAbort}>Отменить</Button>
                                </>
                            )}
                        </div>
                    </section>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default UploadFile