import { Virtuoso } from 'react-virtuoso'
import useMeasure from 'react-use-measure'
import { Box } from '@mui/material';

export const EntityList: React.FC = () => {
    const [ref, bounds] = useMeasure();

    return (
        <Box ref={ref} width={'100%'} height={'100%'}>
            <Virtuoso
                style={{ height: `${bounds.height}px` }}
                totalCount={200}
                itemContent={(index) =>
                    <div>Item {index}</div>} />
        </Box>
    );
};
