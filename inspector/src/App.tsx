import * as React from 'react';
import { useCallback, useState } from 'react';
import { State, type NodeDetails } from "mistreevous";
import { ToastContainer } from 'react-toastify';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { type CanvasElements, MainPanel } from './MainPanel';
import { useSocket } from './socket/use-socket';
import {socket} from './socket/socket';

export const App: React.FC = () => {
	const [canvasElements, setCanvasElements] = useState<CanvasElements>({ nodes: [], edges: [] });

	const onDetailUpdated = useCallback((rootNodeDetails: NodeDetails) => {
		const result: CanvasElements = { nodes: [], edges: [] };

		const processNodeDetails = (node: NodeDetails, parentId?: string) => {
			result.nodes.push({
				id: node.id,
				caption: node.name,
				state: node.state,
				type: node.type,
				args: node.args ?? [],
				whileGuard: node.while,
				untilGuard: node.until,
				entryCallback: node.entry,
				stepCallback: node.step,
				exitCallback: node.exit,
				variant: "default"
			} as any);

			if (parentId) {
				let variant;

				switch (node.state) {
					case State.RUNNING:
						variant = "active";
						break;

					case State.SUCCEEDED:
						variant = "succeeded";
						break;

					case State.FAILED:
						variant = "failed";
						break;

					default:
						variant = "default";
				}

				result.edges.push({
					id: `${parentId}_${node.id}`,
					from: parentId,
					to: node.id,
					variant
				});
			}

			(node.children ?? []).forEach((child) => processNodeDetails(child, node.id));
		};

		processNodeDetails(rootNodeDetails);

		setCanvasElements(result);
	}, []);

	useSocket({ onDetailUpdated });

	return (
		<Box className="app-box">
			<Grid container sx={{ flexGrow: 1 }}>
				<MainPanel
					layoutId={null}
					elements={canvasElements}
					showPlayButton={false}
					showReplayButton={false}
					showStopButton={false}
					onPlayButtonClick={() => { 
						socket.emit('start',{
							"owner": "myadmin",
							"repo": "ariadne-gis"
						})
					}}
					onReplayButtonClick={() => { }}
					onStopButtonClick={() => { }}
				/>
				<ToastContainer />
			</Grid>
		</Box>
	);
};
