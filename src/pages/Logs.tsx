import React from 'react';
import PageLayout from "./PageLayout";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {loadLogs} from "../store/logs";

const LogsPage = () => {
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(loadLogs());
    }, [])

    const logs = useAppSelector(state => state.logs.logs)

    return (
        <PageLayout>
            <pre>
                {logs}
            </pre>
        </PageLayout>
    )
}

export default LogsPage