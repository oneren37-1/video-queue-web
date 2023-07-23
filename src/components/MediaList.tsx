import React from 'react';
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {Alert, Card, Col, Container, ListGroup, Pagination, Row, Spinner} from "react-bootstrap";
import {loadMedia, loadMediaCount, Media} from "../store/media";
import MediaCard from "./MediaCard";


const MediaList = (props: any) => {
    const pageSize = 9;
    const mediaCount = useAppSelector((state) => state.media.count);
    const pagesCount = Math.ceil(mediaCount / pageSize);

    const media: Media[] = useAppSelector((state) => state.media.media);
    const loadingStatus = useAppSelector((state) => state.media.status);
    const dispatch = useAppDispatch();

    const [currentPage, setCurrentPage] = React.useState<number>(1);

    const { SelectedMedia } = props;

    React.useEffect(() => {
        dispatch(loadMedia(currentPage))
    }, [currentPage])

    React.useEffect(() => {
        dispatch(loadMediaCount())
    }, [])

    return (
        <div className={"mb-5"}>
            {loadingStatus === "loading" && (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            )}

            {loadingStatus === "failed" && (
                <Alert variant={"danger"}>
                    Ошибка загрузки
                </Alert>
            )}

            {loadingStatus === "ok" && (
                <>
                    {pagesCount > 1 && (
                        <Pagination>
                            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1}/>
                            <Pagination.Prev onClick={() => setCurrentPage(curr => curr-1)} disabled={currentPage === 1}/>
                            <Pagination.Item active={currentPage === 1} key={1} onClick={() => setCurrentPage(1)}>{1}</Pagination.Item>

                            {pagesCount > 9 && (
                                <>
                                    {currentPage>4 && (<Pagination.Ellipsis />)}
                                    {currentPage>3 && (<Pagination.Item onClick={() => setCurrentPage(currentPage-2)}>{currentPage-2}</Pagination.Item>)}
                                    {currentPage>2 && (<Pagination.Item onClick={() => setCurrentPage(currentPage-1)}>{currentPage-1}</Pagination.Item>)}
                                    {currentPage>1 && currentPage < pagesCount && (<Pagination.Item active>{currentPage}</Pagination.Item>)}
                                    {currentPage < pagesCount - 1 && <Pagination.Item onClick={() => setCurrentPage(currentPage+1)}>{currentPage+1}</Pagination.Item>}
                                    {currentPage < pagesCount - 2 && <Pagination.Item onClick={() => setCurrentPage(currentPage+2)}>{currentPage+2}</Pagination.Item>}
                                    {currentPage < pagesCount - 3 && <Pagination.Ellipsis />}
                                </>
                            )}

                            {pagesCount <= 9 && (
                                <>
                                    {Array.from(Array(pagesCount-2).keys()).map((i) => (
                                        <Pagination.Item active={currentPage === i+2} onClick={() => setCurrentPage(i+2)} key={i+2}>{i+2}</Pagination.Item>
                                    ))}
                                </>
                            )}

                            <Pagination.Item active={currentPage === pagesCount} onClick={() => setCurrentPage(pagesCount)}>{pagesCount}</Pagination.Item>
                            <Pagination.Next onClick={() => setCurrentPage(curr => curr+1)} disabled={currentPage === pagesCount}/>
                            <Pagination.Last onClick={() => setCurrentPage(pagesCount)} disabled={currentPage === pagesCount}/>
                        </Pagination>
                    )}

                    <Row xs={1} sm={1} md={2} lg={3} xl={3} className="g-3">
                        {media.map((m, i) => (
                            <Col key={i} className="d-flex justify-content-center">
                                <MediaCard m={m}
                                           ToggleMediaPick={props.ToggleMediaPick}
                                           isSelected={ SelectedMedia && SelectedMedia.indexOf(m.id) !== -1 }
                                />
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </div>
    )
}

export default MediaList