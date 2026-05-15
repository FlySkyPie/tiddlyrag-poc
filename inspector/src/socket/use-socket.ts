import type { NodeDetails } from 'mistreevous';
import type { Delta } from 'jsondiffpatch';
import { useEffect, useRef } from "react";
import { patch } from 'jsondiffpatch';

import { socket } from "./socket";

interface IProps {
    onDetailUpdated?: (value: NodeDetails) => void;
};

export const useSocket = ({ onDetailUpdated }: IProps) => {
    const onDetailUpdatedRef = useRef<((value: NodeDetails) => void) | undefined>(onDetailUpdated);
    const lastRef = useRef<NodeDetails>();

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

        const handleBtInit = (value: NodeDetails) => {
            lastRef.current = value;
        }

        const handleBtUpdated = (value: Delta) => {
            lastRef.current = patch(lastRef.current,value) as any;
            onDetailUpdatedRef.current(lastRef.current);
        }

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('btInit', handleBtInit);
        socket.on('btUpdated', handleBtUpdated);


        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('btInit', handleBtInit);
            socket.off('btUpdated', handleBtUpdated);
        };
    }, []);
};
