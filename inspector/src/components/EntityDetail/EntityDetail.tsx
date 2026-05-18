import { useMemo } from 'react';
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useEntityStore } from '../../store/entity-store';

import styles from './styles.module.scss'

const ValueDisplay: React.FC<{ value: unknown }> = ({ value }) => {
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'boolean') {
        return String(value);
    }
    if (typeof value === 'number') {
        return String(value);
    }
    return "N/A"
}

export const EntityDetail: React.FC = () => {
    const { selected, select } = useEntityStore();

    const content = useMemo(() => {
        const keys = Object.keys(selected ?? {});
        const rows = keys.map(key => ({
            key,
            value: selected[key],
        }));

        return (
            <Paper
                className={styles.container}>
                <Box display='flex' flexDirection='column'>
                    <Box display='flex' justifyContent='end'>
                        <IconButton onClick={() => select()}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Component</TableCell>
                                    <TableCell align="right">Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.key}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.key}
                                        </TableCell>
                                        <TableCell align="right">
                                            <ValueDisplay value={row.value} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Box>
            </Paper>
        );
    }, [select, selected]);

    return (
        <div className={styles['root-anchor']}>
            <div className={styles['anchor-transformer']}>
                <div className={styles['container-anchor']}>
                    <Collapse in={!!selected} orientation="horizontal">
                        {content}
                    </Collapse>
                </div>
            </div>
        </div>
    );
};