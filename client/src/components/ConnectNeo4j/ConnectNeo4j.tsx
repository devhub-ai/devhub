import { useState } from 'react';
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogTrigger,
    AlertDialogDescription
} from "@/components/ui/alert-dialog";
import { Download, CirclePlay, Braces } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import { Icons } from "@/components/ui/icons";
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Define interfaces for node and link data
interface NodeData extends SimulationNodeDatum {
    id: string | number;
    labels: string[];
}

interface LinkData {
    source: NodeData | string | number;
    target: NodeData | string | number;
}

interface SchemaData {
    label: string;
    properties: { [key: string]: string };
}

const CypherQueryExecutor = () => {
    const [neo4jURI, setNeo4jURI] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cypherQuery, setCypherQuery] = useState('');
    const [queryResult, setQueryResult] = useState<{ nodes: NodeData[], links: LinkData[] }>({ nodes: [], links: [] });
    const [connected, setConnected] = useState(false);
    const [schema, setSchema] = useState<SchemaData[]>([]);
    const [loading, setLoading] = useState(false);

    const handleConnect = () => {
        setLoading(true);
        fetch(`${backendUrl}/new-connection`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ neo4jURI, username, password }),
        })
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                if (data.success) {
                    fetchSchema();
                    setConnected(true);
                    toast.success("Connection Successfull")
                } else {
                    console.error('Connection failed:', data.message);
                    toast.error("Conection failed" + data.message)
                }
            })
            .catch(err => {
                setLoading(false);
                console.error('Error connecting to Neo4j:', err)
                toast.error("Conection failed" + err)
            });
    };

    const handleQueryExecution = () => {
        console.log(queryResult)
        if (!connected) {
            console.error('Not connected to Neo4j');
            return;
        }
        setLoading(true);
        fetch(`${backendUrl}/execute-cypher`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: cypherQuery }),
        })
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                if (data.success) {
                    console.log('Full response data:', data);

                    const nodes: NodeData[] = [];
                    const links: LinkData[] = [];

                    data.results.forEach((result: { nodeId1: string | number, nodeId2: string | number, nodeLabels1: string[], nodeLabels2: string[] }) => {
                        const { nodeId1, nodeId2, nodeLabels1, nodeLabels2 } = result;


                        if (!nodes.find(node => node.id === nodeId1)) {
                            nodes.push({ id: nodeId1, labels: nodeLabels1 });
                        }
                        if (nodeId2 && !nodes.find(node => node.id === nodeId2)) {
                            nodes.push({ id: nodeId2, labels: nodeLabels2 });
                        }

                        // Create a link between nodes
                        if (nodeId1 && nodeId2) {
                            links.push({ source: nodeId1, target: nodeId2 });
                        }
                    });

                    console.log('Nodes:', nodes);
                    console.log('Links:', links);

                    setQueryResult({ nodes, links });
                    visualizeResults({ nodes, links });
                    toast.success("Execution Successfull")
                } else {
                    console.error('Query failed:', data.message);
                    toast.error("Query failed" + data.message)
                }
            })
            .catch(err => {
                setLoading(false);
                console.error('Error executing Cypher query:', err)
                toast.error("Execution failed" + err)
            });
    };

    const fetchSchema = () => {
        if (!connected) return; // Only fetch schema if connected
        setLoading(true);
        fetch(`${backendUrl}/db-schema`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                if (data.success) {
                    console.log('Schema data:', data.schema);
                    setSchema(data.schema);
                    toast.success("Schema fetched successfully");
                } else {
                    console.error('Failed to fetch schema:', data.message);
                    toast.error("Failed to fetch schema: " + data.message);
                }
            })
            .catch(err => {
                setLoading(false);
                console.error('Error fetching schema:', err);
                toast.error("Error fetching schema: " + err);
            });
    };

    const visualizeResults = ({ nodes, links }: { nodes: NodeData[], links: LinkData[] }) => {
        d3.select('#result-visualization').select('svg').remove();

        const container = d3.select('#result-visualization');
        const width = 800;
        const height = 600;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink<NodeData, LinkData>(links).id((d: NodeData) => d.id).distance(150))
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(width / 2, height / 2));

        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke-width', 2)
            .attr('stroke', '#999');

        const node = svg.append('g')
            .selectAll('g')
            .data(nodes)
            .enter().append('g')
            .attr('class', 'node');

        // Draw nodes (circles) and append labels
        node.append('circle')
            .attr('r', 20)
            .attr('fill', '#69b3a2')
            .call(
                d3.drag<SVGCircleElement, NodeData>() // Type the drag behavior with <SVGCircleElement, NodeData>
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended)
            );

        // Append labels to nodes
        node.append('text')
            .attr('dy', -25) // Adjust position to place label above the node
            .attr('text-anchor', 'middle')
            .attr('pointer-events', 'none') // Prevent interference with dragging
            .text(d => d.labels.join(', '));

        simulation.on('tick', () => {
            link.attr('x1', (d: LinkData) => (d.source as NodeData).x!)
                .attr('y1', (d: LinkData) => (d.source as NodeData).y!)
                .attr('x2', (d: LinkData) => (d.target as NodeData).x!)
                .attr('y2', (d: LinkData) => (d.target as NodeData).y!);

            node.attr('transform', (d: NodeData) => `translate(${d.x}, ${d.y})`);
        });

        function dragstarted(event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>, d: NodeData) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>, d: NodeData) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>, d: NodeData) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    };

    const handleDownload = () => {
        const svgElement = d3.select('#result-visualization').select('svg').node();
        if (!svgElement) return;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement as Node);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svgSize = (svgElement as SVGSVGElement).getBoundingClientRect();
        canvas.width = svgSize.width;
        canvas.height = svgSize.height;

        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            ctx?.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            const a = document.createElement('a');
            a.download = 'relation-graph.png';
            a.href = canvas.toDataURL('image/png');
            a.click();
        };

        img.src = url;
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button
                            variant="secondary"
                            className="shadow-none"
                        >
                            Connect
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <div className="flex items-center">
                            <AlertDialogHeader className="text-2xl">
                                Neo4j Connection
                            </AlertDialogHeader>
                            <div className="flex-grow"></div>
                            <AlertDialogCancel>
                                <Cross1Icon className="h-3 w-3" />
                            </AlertDialogCancel>
                        </div>
                        <AlertDialogDescription>
                            <div className="grid gap-6 sm:w-80">
                                <div>
                                    <Input type="text" value={neo4jURI} onChange={(e) => setNeo4jURI(e.target.value)} placeholder='Neo4j URI' />
                                </div>
                                <div>
                                    <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Neo4j Username' />
                                </div>
                                <div>
                                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Neo4j Password' />
                                </div>
                            </div>
                        </AlertDialogDescription>
                        <Button onClick={handleConnect} className="w-full mt-4" disabled={loading}>
                            {loading ? (
                                <>
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                'Connect'
                            )}
                        </Button>
                    </AlertDialogContent>
                </AlertDialog>

                <div className="flex-grow"></div>
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button
                            variant="secondary"
                            className="shadow-none"
                        >
                            <CirclePlay />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <div className="flex items-center">
                            <AlertDialogHeader className="text-2xl">
                                Cypher Query
                            </AlertDialogHeader>
                            <div className="flex-grow"></div>
                            <AlertDialogCancel>
                                <Cross1Icon className="h-3 w-3" />
                            </AlertDialogCancel>
                        </div>
                        <AlertDialogDescription>
                            <div className="grid gap-6 sm:w-80">
                                <Textarea
                                    value={cypherQuery}
                                    onChange={(e) => setCypherQuery(e.target.value)}
                                    rows={10}
                                    cols={50}
                                    style={{ width: '100%' }}
                                    className="min-h-12 resize-none"
                                    placeholder="Write Cypher Query"
                                />
                            </div>
                        </AlertDialogDescription>
                        <Button onClick={handleQueryExecution} size="sm" className="gap-1.5" disabled={loading}>
                            {loading ? (
                                <>
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Executing...
                                </>
                            ) : (
                                'Execute Query'
                            )}
                        </Button>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button
                            variant="secondary"
                            className="shadow-none"
                        >
                            <Braces />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <div className="flex items-center">
                            <AlertDialogHeader className="text-2xl">
                                Schema
                            </AlertDialogHeader>
                            <div className="flex-grow"></div>
                            <AlertDialogCancel>
                                <Cross1Icon className="h-3 w-3" />
                            </AlertDialogCancel>
                        </div>
                        <AlertDialogDescription>
                            <div className="grid gap-6 sm:w-80">
                                <ScrollArea className=" rounded-md border p-4 mt-4 h-[200px]">
                                    <pre>{JSON.stringify(schema, null, 2)}</pre>
                                </ScrollArea>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogContent>
                </AlertDialog>
                <Button
                    variant="secondary"
                    className="shadow-none"
                    onClick={handleDownload}
                >
                    <Download />
                </Button>

            </div>
            <div id="result-visualization" style={{ width: '100%', height: '100%' }}></div>
        </div>
    );
};

export default CypherQueryExecutor;
