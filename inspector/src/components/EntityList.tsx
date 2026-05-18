import { Virtuoso } from 'react-virtuoso'
import useMeasure from 'react-use-measure'
import { Box, ListItem, ListItemButton, ListItemText } from '@mui/material';

import { useEntityStore } from '../store/entity-store';


interface RowComponentProps {
    index: number;
}

function Row(props: RowComponentProps) {
    const { index } = props;
    const { entities, select, selected } = useEntityStore();
    const entity = entities[index];

    return (
        <ListItem dense component="div" disablePadding>
            <ListItemButton
                disabled={entity === selected}
                onClick={() => select(entity)}>
                <ListItemText primary={
                    typeof entity.name === 'string' ?
                        entity.name :
                        `Entity ${index + 1}`
                } />
            </ListItemButton>
        </ListItem>
    );
}

export const EntityList: React.FC = () => {
    const [ref, bounds] = useMeasure();
    const { entities } = useEntityStore();

    return (
        <Box ref={ref} width={'100%'} height={'100%'} maxHeight={'100vh'}>
            <Virtuoso
                style={{ height: `${bounds.height}px` }}
                totalCount={entities.length}
                itemContent={(index) =>
                    <Row index={index} />} />
        </Box>
    );
};
