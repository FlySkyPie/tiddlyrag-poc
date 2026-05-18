import { useEffect, useState } from "react";

import PlayArrow from '@mui/icons-material/PlayArrow';
import FitScreen from "@mui/icons-material/FitScreen";
import Fab from "@mui/material/Fab/Fab";
import { Tooltip } from "@mui/material";

import { ActiveConnector } from "./workflo/ActiveConnector";
import { SucceededConnector } from "./workflo/SucceededConnector";
import { WorkflowCanvas, type WorkflowCanvasInstance } from "./workflo/WorkflowCanvas";
import { DefaultNode } from "./workflo/DefaultNode";
import { DefaultConnector } from "./workflo/DefaultConnector";
import type { NodeType, ConnectorType } from "./workflo/workflo";

import './MainPanel.css';
import { FailedConnector } from "./workflo/FailedConnector";

export type CanvasElements = { nodes: NodeType[], edges: ConnectorType[] };

/**
 * The MainPanel component props.
 */
export interface MainPanelProps {
    /** The layout identifier. */
    layoutId: string | null;

    /** The behaviour tree elements. */
    elements: CanvasElements;

    showPlayButton: boolean;

    showReplayButton: boolean;

    showStopButton: boolean;

    onPlayButtonClick?: () => void;
}

/**
 * The MainPanel component.
 */
export const MainPanel: React.FunctionComponent<MainPanelProps> = ({ layoutId, elements, onPlayButtonClick }) => {
    const [canvasInstance, setCanvasInstance] = useState<WorkflowCanvasInstance | null>(null);
    const [isFitNeeded, setIsFitNeeded] = useState<boolean>(true);
    const [lastLayoutId, setLastLayoutId] = useState<string | null>(null);

    // An effect to call 'fit' on our canvas under certain conditions.
    useEffect(() => {
        const doNodesExist = elements.nodes.length > 0;

        // If we ever go from having no layout to some layout we should call 'fit'.
        if (doNodesExist && isFitNeeded) {
            canvasInstance?.fit();
            setIsFitNeeded(false);
        } else if (!doNodesExist && !isFitNeeded) {
            setIsFitNeeded(true);
        }

        // If we swap layouts we should call 'fit'.
        if (lastLayoutId != layoutId) {
            canvasInstance?.fit();
            setLastLayoutId(layoutId);
        }
    });

    return (
        <div className="main-panel">
            <WorkflowCanvas
                onInitalise={(instance) => setCanvasInstance(instance)}
                nodes={elements.nodes}
                connectors={elements.edges}
                nodeComponents={{
                    "default": DefaultNode
                }}
                connectorComponents={{
                    "default": DefaultConnector,
                    "active": ActiveConnector,
                    "succeeded": SucceededConnector,
                    "failed": FailedConnector
                }}
            />
            <div className="main-panel-fab-container">
                <Fab
                    className="run-tree-fab main-panel-fab"
                    size="medium"
                    color="primary"
                    onClick={onPlayButtonClick}>
                    <Tooltip title="Start Demo">
                        <PlayArrow />
                    </Tooltip>
                </Fab>
                {!!elements.edges.length && !!elements.nodes.length && (
                    <Fab
                        className="run-tree-fab main-panel-fab"
                        size="medium"
                        color="primary"
                        onClick={() => canvasInstance?.fit()}>
                        <Tooltip title="Re-center Viewport">
                            <FitScreen />
                        </Tooltip>
                    </Fab>
                )}
            </div>
        </div>
    );
}
