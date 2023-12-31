import React, {useState} from 'react';
import {Button, Card, Stack} from "react-bootstrap";
import {useAppDispatch, useWSAuthedRequest} from "../app/hooks";
import AddSchedulerModal from "./modals/AddSchedulerModal";
import EditContentModal from "./modals/EditContentModal";
import {deleteMedia} from "../store/media";

const MediaCard = (props: any) => {
    const [isSelected, setIsSelected] = React.useState(!!props.isSelected);
    const { id, name, duration, type } = props.m;

    const [imgLoadingState, setImgLoadingState] = useState<'idle'|'loading'|'ok'|'failed'>('idle');
    const [img, setImg] = useState<string|null>(null);

    const [modalShow, setModalShow] = React.useState(false);

    const dispatch = useAppDispatch();

    React.useEffect(() => {
        setImgLoadingState('loading')
        setImg("")
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useWSAuthedRequest({
            type: "get",
            entity: "img",
            id: id
        }).then((res: any) => {
            if (res.payload === "error") {
                setImgLoadingState('failed')
                return;
            }
            setImgLoadingState('ok')
            setImg(res.payload)
            return;
        })
    }, [id])

    const handleClick = (id: string) => {
        if (props.ToggleMediaPick) {
            props.ToggleMediaPick(id);
            setIsSelected(prev => !prev);
        }
    }

    return (
        <Card
            border={isSelected ? "primary" : "secondary"}
            style={{ transform: isSelected ? "scale(0.95)" : "scale(1)", transition: "all 0.2s ease-in-out"}}
            onClick={() => handleClick(id)}
        >
            <Card.Img
                variant="top"
                style={{ maxHeight: "400px" }}
                src={img ? " data:image/jpeg;charset=utf-8;base64," + img  : "https://www.ballipolimer.com/wp-content/uploads/2020/08/img-placeholder.png"} />
            <Card.Body>
                <Stack direction="horizontal" gap={3}>
                    <div>
                        {name && name.length <= 20 && <Card.Title>{name}</Card.Title>}
                        {name && name.length > 20 && <Card.Text>{name}</Card.Text>}
                        <Card.Text>{`${String((Math.floor(duration/60))).padStart(2, '0')}:${String(duration % 60).padStart(2, '0')}`}</Card.Text>
                    </div>
                    {!props.noEdit && (
                        <>
                            <Button variant={'light'} className={"ms-auto"} onClick={() => setModalShow(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>
                            </Button>
                            <Button variant={"outline-danger"} onClick={() => dispatch(deleteMedia(id))}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-trash" viewBox="0 0 16 16">
                                    <path
                                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                    <path
                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                                </svg>
                            </Button>
                        </>
                    )}

                </Stack>
            </Card.Body>
            <EditContentModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                id={id}
                name={name}
                duration={duration}
                isSlide={type === 'img'}
            />
        </Card>
    )
}

export default MediaCard;