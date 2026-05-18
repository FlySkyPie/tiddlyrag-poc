import type { NodeDetails } from 'mistreevous';
import type { Delta } from 'jsondiffpatch';
import { useEffect, useMemo, useRef, useTransition } from "react";
import { patch } from 'jsondiffpatch';

import { useEntityStore, type Entity } from '../store/entity-store';

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

    const { add, remove, updated } = useEntityStore();
    const storeOps = useMemo(() => ({ add, remove, updated }), [add, remove, updated]);
    const storeOpsRef = useRef(storeOps);

    const [, startTransition] = useTransition();

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
            lastRef.current = patch(lastRef.current, value) as any;
            onDetailUpdatedRef.current(lastRef.current);
        }

        const handleEntityAdded = (value: Entity) => {
            startTransition(() => {
                storeOpsRef.current.add(value);
            });
        }

        const handleEntityRemoved = (value: Entity) => {
            startTransition(() => {
                storeOpsRef.current.remove(value);
            });
        }

        const handleEntityUpdated = (value: Entity) => {
            startTransition(() => {
                storeOpsRef.current.updated(value);
            });
        }

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('btInit', handleBtInit);
        socket.on('btUpdated', handleBtUpdated);
        socket.on('entityAdded', handleEntityAdded);
        socket.on('entityRemoved', handleEntityRemoved);
        socket.on('entityUpdated', handleEntityUpdated);


        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('btInit', handleBtInit);
            socket.off('btUpdated', handleBtUpdated);
            socket.off('entityAdded', handleEntityAdded);
            socket.off('entityRemoved', handleEntityRemoved);
            socket.off('entityUpdated', handleEntityUpdated);
        };
    }, []);
};
