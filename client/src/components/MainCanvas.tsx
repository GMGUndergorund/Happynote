import { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Panel,
  BackgroundVariant,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useNoteMap } from '@/lib/store';
import NoteNode from '@/components/NoteNode';
import { ZoomIn, ZoomOut, Maximize, Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the custom node types
const nodeTypes = {
  noteNode: NoteNode,
};

const FlowCanvas = () => {
  const { 
    notes, 
    connections, 
    selectedNote, 
    selectNote, 
    addNote,
    updateNote,
    addConnection,
    deleteConnection,
    searchQuery,
    canvasState,
    updateCanvasState,
    showToast
  } = useNoteMap();

  // Convert our notes to ReactFlow nodes
  const initialNodes: Node[] = notes.map(note => ({
    id: note.id,
    type: 'noteNode',
    position: note.position,
    data: { 
      ...note,
      isSelected: note.id === selectedNote
    },
  }));

  // Convert our connections to ReactFlow edges
  const initialEdges: Edge[] = connections.map(conn => ({
    id: conn.id,
    source: conn.source,
    target: conn.target,
    type: 'smoothstep',
    animated: false,
    style: { 
      stroke: '#9CA3AF', 
      strokeWidth: 2,
    },
  }));

  // Set up ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Create a connection handler
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        addConnection(connection.source, connection.target);
      }
    },
    [addConnection]
  );

  // Update nodes when our notes change
  useEffect(() => {
    const filteredNotes = notes.filter(note => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    });

    const updatedNodes = filteredNotes.map(note => ({
      id: note.id,
      type: 'noteNode',
      position: note.position,
      data: { 
        ...note,
        isSelected: note.id === selectedNote
      },
    }));

    setNodes(updatedNodes);
  }, [notes, selectedNote, searchQuery, setNodes]);

  // Update edges when our connections change
  useEffect(() => {
    const updatedEdges = connections.map(conn => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      type: 'smoothstep',
      animated: false,
      style: { 
        stroke: '#9CA3AF', 
        strokeWidth: 2,
      },
    }));

    setEdges(updatedEdges);
  }, [connections, setEdges]);

  // Handle node position changes
  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      updateNote(node.id, { position: node.position });
    },
    [updateNote]
  );

  // Handle double click on the canvas to create a new note
  const onDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      // Only create a note if clicking on the canvas background
      if ((event.target as HTMLElement).classList.contains('react-flow__pane') && reactFlowInstance) {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        
        const newNote = {
          title: 'New Note',
          content: 'Start typing here...',
          position,
          tags: [],
          color: '#6366F1',
        };
        
        addNote(newNote);
        showToast('Note created!', 'Double-click the canvas anytime to add a new note.');
      }
    },
    [reactFlowInstance, addNote, showToast]
  );

  // Handle viewport changes
  const onMoveEnd = useCallback(
    ({ x, y, zoom }) => {
      updateCanvasState({
        position: { x, y },
        scale: zoom,
      });
    },
    [updateCanvasState]
  );

  const onPaneClick = useCallback(() => {
    selectNote(null);
  }, [selectNote]);

  // Zoom control functions
  const zoomIn = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
    }
  };

  const zoomOut = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
    }
  };

  const resetView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView();
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      onDoubleClick={onDoubleClick}
      onMoveEnd={onMoveEnd}
      onPaneClick={onPaneClick}
      nodeTypes={nodeTypes}
      defaultViewport={canvasState}
      minZoom={0.1}
      maxZoom={2}
      fitView
      attributionPosition="bottom-right"
      onInit={setReactFlowInstance}
    >
      <Panel position="top-right" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex z-10">
        <Button variant="ghost" size="icon" onClick={zoomIn} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
          <ZoomIn className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Button>
        <Button variant="ghost" size="icon" onClick={zoomOut} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
          <ZoomOut className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Button>
        <Button variant="ghost" size="icon" onClick={resetView} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
          <Focus className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Button>
        <div className="h-4 w-px bg-gray-200 dark:bg-gray-600 mx-1"></div>
        <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
          <Maximize className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Button>
      </Panel>
      <Background 
        variant={BackgroundVariant.Dots} 
        gap={24} 
        size={1} 
        color="#e5e7eb" 
      />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
};

// Wrapper component that provides the ReactFlow context
const MainCanvas = () => {
  return (
    <div className="flex-grow relative">
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  );
};

export default MainCanvas;
