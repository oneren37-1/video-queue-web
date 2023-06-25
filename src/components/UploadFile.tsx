import React from 'react';
import {Alert, Button, Card, Form, ProgressBar, Stack} from "react-bootstrap";
import {useWebsocket} from "../app/hooks";

const UploadFile = () => {

    const [sendingStatus, setSendingStatus] = React.useState<string>('idle');
    const [sendingProgress, setSendingProgress] = React.useState<number>(0);
    const [fileName, setFileName] = React.useState<string | null>(null);


    const [socket] = React.useState<WebSocket>(useWebsocket());
    const [peerConnection, setPeerConnection] = React.useState<RTCPeerConnection | null>(null);
    const [dataChannel, setDataChannel] = React.useState<RTCDataChannel | null>(null);


    React.useEffect(() => {
        if (!peerConnection) {
            setPeerConnection(new RTCPeerConnection())
            return;
        }

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
            //console.log("Получены данные ws " + event.data);
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
        if (!peerConnection || !dataChannel) return
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

        await peerConnection?.setRemoteDescription(JSON.parse(answer))
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
        peerConnection?.close();
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
        setFileName(file.name)

        dataChannel?.send(JSON.stringify({
            type: 'startSending',
            payload: {
                name: file.name,
                size: file.size,
                type: file.type,
            }
        }));

        if (file.size === 0) {
            console.log('File is empty, please select a non-empty file');
            closeDataChannels();
            return;
        }

        const chunkSize = 16384;
        const fileReader = new FileReader();
        let offset = 0;
        fileReader.addEventListener('error', error => console.error('Error reading file:', error));
        fileReader.addEventListener('abort', event => console.log('File reading aborted:', event));
        fileReader.addEventListener('load', e => {
            // @ts-ignore
            dataChannel.send(e.target.result);
            // @ts-ignore
            offset += e.target.result.byteLength;
            setSendingProgress(offset/file.size*100);
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
                setSendingStatus("complete");
                setSendingProgress(0);
                // @ts-ignore
                fileInput.current.value = null;
            }
        });
        const readSlice = (o:any) => {
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
                            <Stack direction="horizontal" gap={2} style={{width: "100%"}}>
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
                            </Stack>
                            {sendingStatus == "sending" && (
                                <Stack direction="horizontal" gap={2} style={{width: "100%"}}>
                                    <Stack>
                                        {fileName && (<span>Отправка файла {fileName}</span>)}
                                        <ProgressBar now={sendingProgress} label={`${Math.round(sendingProgress)}%`} style={{width: "100%"}}/>
                                    </Stack>
                                    {/*<Button variant={"outline-secondary"} onClick={handleAbort}>Отменить</Button>*/}
                                </Stack>
                            )}
                            {sendingStatus == "complete" && (
                                <Alert variant={"success"} className={"mt-2"}>
                                    Файл {fileName} успешно отправлен
                                </Alert>
                            )}
                        </div>
                    </section>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default UploadFile