import type { NodeDetails } from 'mistreevous';
import { useEffect, useRef } from "react";

import { socket } from "./socket";

interface IProps {
    onDetailUpdated?: (value: NodeDetails) => void;
};

export const useSocket = ({ onDetailUpdated }: IProps) => {
    const onDetailUpdatedRef = useRef<((value: NodeDetails) => void) | undefined>(onDetailUpdated);

    useEffect(() => {
        onDetailUpdatedRef.current = onDetailUpdated;
    }, [onDetailUpdated]);


    useEffect(() => {
        function handleConnect() {
            console.log('Connected!');
        }

        function handleDisconnect() {
            console.log('Disconnected!');
        }

        const handleUpdateDetail = (value: NodeDetails) => {
            if (onDetailUpdatedRef.current) {
                onDetailUpdatedRef.current(value);
            }
        }

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('updateDetail', handleUpdateDetail);


        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('updateDetail', handleUpdateDetail);
        };
    }, []);
};
