import React, {useState} from 'react';
import {Card} from "react-bootstrap";
import {useWSAuthedRequest} from "../app/hooks";

const MediaCard = (props: any) => {
    const [isSelected, setIsSelected] = React.useState(false);
    const { id, name } = props.m;

    const [imgLoadingState, setImgLoadingState] = useState<'idle'|'loading'|'ok'|'failed'>('idle');
    const [img, setImg] = useState<string|null>(null);

    React.useEffect(() => {
        setImgLoadingState('loading')
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useWSAuthedRequest({
            type: "get",
            entity: "img",
            id: id
        }).then((res: any) => {
            console.log(res)
            if (res.payload === "error") {
                setImgLoadingState('failed')
                return;
            }
            setImgLoadingState('ok')
            setImg(res.payload)
            return;
        })
    }, [])

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
            <Card.Img variant="top" src={img ? " data:image/jpeg;charset=utf-8;base64," + img  : "https://www.ballipolimer.com/wp-content/uploads/2020/08/img-placeholder.png"} />
            <Card.Body>
                {name.length <= 20 && <Card.Title>{name}</Card.Title>}
                {name.length > 20 && <Card.Text>{name}</Card.Text>}
            </Card.Body>
        </Card>
    )
}

export default MediaCard;