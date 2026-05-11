import * as React from 'react';
import { useCallback, useState } from 'react';
import { State, BehaviourTree, type NodeDetails } from "mistreevous";
import { toast, ToastContainer } from 'react-toastify';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { type CanvasElements, MainPanel } from './MainPanel';

/**
 * The App component state.
 */
export type AppState = {
	layoutId: string | null;
	definition: string;
	agent: string;
	agentExceptionMessage: string;
	behaviourTree: BehaviourTree | null;
	behaviourTreeExceptionMessage: string;
	behaviourTreePlayInterval: NodeJS.Timer | null;
	canvasElements: CanvasElements;
}

export const App: React.FC = () => {
	const [layoutId, setLayoutId] = useState<string | null>(null);
	const [behaviourTree, setBehaviourTree] = useState<BehaviourTree | null>(null);
	const [behaviourTreePlayInterval, setBehaviourTreePlayInterval] = useState<NodeJS.Timer | null>(null);
	const [canvasElements, setCanvasElements] = useState<CanvasElements>({ nodes: [], edges: [] });

	const _createCanvasElements = useCallback((rootNodeDetails: NodeDetails): CanvasElements => {
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

		return result;
	}, []);

	const onPlayButtonPressed = useCallback(() => {
		// There is nothing to de if we have no behaviour tree instance.
		if (!behaviourTree) {
			return;
		}

		// Reset the tree.
		behaviourTree.reset();

		// Clear any existing interval.
		if (behaviourTreePlayInterval) {
			clearInterval(behaviourTreePlayInterval);
		}

		// Create an interval to step the tree until it is finished.
		const playInterval = setInterval(() => {
			// Step the behaviour tree, if anything goes wrong we will stop the tree playback.
			try {
				behaviourTree.step();
			} catch (exception: any) {
				// Clear the interval.
				clearInterval(playInterval);
				setBehaviourTreePlayInterval(null);

				// Reset the tree.
				behaviourTree.reset();

				// Notify the user of the exception via a toast.
				toast.error(exception.toString());
			}

			// If the tree root is in a finished state then stop the interval.
			if (!behaviourTree.isRunning()) {
				// Clear the interval.
				clearInterval(playInterval);
				setBehaviourTreePlayInterval(null);
			}

			setCanvasElements(
				_createCanvasElements(behaviourTree.getTreeNodeDetails())
			);
		}, 100);

		setBehaviourTreePlayInterval(playInterval);
	}, [_createCanvasElements, behaviourTree, behaviourTreePlayInterval]);

	return (
		<Box className="app-box">
			<Grid container sx={{ flexGrow: 1 }}>
				<MainPanel
					layoutId={layoutId}
					elements={canvasElements}
					showPlayButton={!!behaviourTree && !behaviourTreePlayInterval}
					showReplayButton={!!behaviourTreePlayInterval}
					showStopButton={!!behaviourTreePlayInterval}
					onPlayButtonClick={() => onPlayButtonPressed()}
					onReplayButtonClick={() => onPlayButtonPressed()}
					onStopButtonClick={() => { }}
				/>
				<ToastContainer />
			</Grid>
		</Box>
	);
};
