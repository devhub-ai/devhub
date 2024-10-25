import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useParams } from "react-router-dom";
import { Download, Share, Code } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ShareRelation } from "./ShareRelation";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import RelationCode from './RelationCode';

interface NodeData extends d3.SimulationNodeDatum {
    id: string | number;
    label: string;
}

interface LinkData extends d3.SimulationLinkDatum<NodeData> {
    source: string | number | NodeData;  // Can be a string, number, or NodeData
    target: string | number | NodeData;
    type: string;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const Relations = () => {
    const { username: username } = useParams<{ username: string }>();
    const d3Container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!username) {
            console.error("Username not found in localStorage");
            return;
        }

        // Fetch the user relations data from the backend
        fetch(`${backendUrl}/profile/relations?username=${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: { nodes: NodeData[], links: LinkData[] }) => {
                // Remove any existing SVG if it exists to avoid duplication
                d3.select(d3Container.current).select('svg').remove();

                // Get the parent element's dimensions dynamically
                const container = d3Container.current;
                const width = container?.getBoundingClientRect().width || 800;
                const height = container?.getBoundingClientRect().height || 600;

                // Create the SVG element inside the div
                const svg = d3.select(container).append('svg')
                    .attr('width', width)
                    .attr('height', height);

                // Initialize the force simulation with nodes
                const simulation = d3.forceSimulation<NodeData>(data.nodes)
                    .force('link', d3.forceLink<NodeData, LinkData>(data.links)
                        .id((d: NodeData) => d.id.toString())  // Ensure id is a string
                        .distance(150))  // You can control the distance between nodes
                    .force('charge', d3.forceManyBody())  // Compatible after extending NodeData
                    .force('center', d3.forceCenter(width / 2, height / 2));

                const link = svg.append('g')
                    .selectAll('line')
                    .data(data.links)
                    .enter().append('line')
                    .attr('stroke-width', 2)
                    .attr('stroke', '#999');

                // Add labels to links (relationship type)
                const linkText = svg.append('g')
                    .selectAll('text')
                    .data(data.links)
                    .enter().append('text')
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#666')
                    .style('font-size', '14px')  // Larger font for better visibility
                    .text((d: LinkData) => d.type);

                // Create nodes with increased size
                const node = svg.append('g')
                    .selectAll('circle')
                    .data(data.nodes)
                    .enter().append('circle')
                    .attr('r', 20) // Increased radius for bigger nodes
                    .attr('fill', '#69b3a2')
                    .call(
                        d3.drag<SVGCircleElement, NodeData>() // Type the drag behavior with <SVGCircleElement, NodeData>
                            .on('start', dragstarted)
                            .on('drag', dragged)
                            .on('end', dragended)
                    );

                // Add node labels
                const nodeLabels = svg.append('g')
                    .selectAll('text')
                    .data(data.nodes)
                    .enter().append('text')
                    .attr('dy', -25) // Position label above node
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#333')
                    .style('font-size', '14px')  // Adjust font size as needed
                    .text((d: NodeData) => d.label);

                node.append('title').text((d: NodeData) => d.id.toString());

                // Update positions on each tick
                simulation.on('tick', () => {
                    link.attr('x1', (d: LinkData) => ((d.source as NodeData).x!))
                        .attr('y1', (d: LinkData) => ((d.source as NodeData).y!))
                        .attr('x2', (d: LinkData) => ((d.target as NodeData).x!))
                        .attr('y2', (d: LinkData) => ((d.target as NodeData).y!));

                    node.attr('cx', (d: NodeData) => d.x!)
                        .attr('cy', (d: NodeData) => d.y!);

                    // Update node labels position
                    nodeLabels.attr('x', (d: NodeData) => d.x!)
                        .attr('y', (d: NodeData) => d.y!);

                    // Update link labels position
                    linkText.attr('x', (d: LinkData) => {
                        const x1 = (d.source as NodeData).x!;
                        const x2 = (d.target as NodeData).x!;
                        return (x1 + x2) / 2;  // Position at the midpoint of the link
                    })
                        .attr('y', (d: LinkData) => {
                            const y1 = (d.source as NodeData).y!;
                            const y2 = (d.target as NodeData).y!;
                            return (y1 + y2) / 2;  // Position at the midpoint of the link
                        });
                });

                function dragstarted(event: d3.D3DragEvent<SVGCircleElement, NodeData, unknown>, d: NodeData) {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }

                function dragged(event: d3.D3DragEvent<SVGCircleElement, NodeData, unknown>, d: NodeData) {
                    d.fx = event.x;
                    d.fy = event.y;
                }

                function dragended(event: d3.D3DragEvent<SVGCircleElement, NodeData, unknown>, d: NodeData) {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }
            })
            .catch(error => {
                console.error('Error fetching user relations:', error);
            });
    }, [username]);

    // Function to handle the download of the SVG as an image
    const handleDownload = () => {
        const svgElement = d3.select(d3Container.current).select('svg').node();
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

            // Trigger download
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
                <Button
                    variant="secondary"
                    className="shadow-none"
                    onClick={handleDownload}
                >
                    <Download />
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button
                            variant="secondary"
                            className="shadow-none"
                        >
                            <Code />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <div className="flex items-center">
                            <AlertDialogHeader className="text-2xl mt-1.5">
                                Relation Query
                            </AlertDialogHeader>
                            <div className="flex-grow"></div>
                            <AlertDialogCancel>
                                <Cross1Icon className="h-3 w-3" />
                            </AlertDialogCancel>
                        </div>
                        <RelationCode username={username || ''} />
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button
                            variant="secondary"
                            className="shadow-none"
                        >
                            <Share />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <div className="flex items-center">
                            <AlertDialogHeader className="text-2xl mt-1.5">
                                Share Relations
                            </AlertDialogHeader>
                            <div className="flex-grow"></div>
                            <AlertDialogCancel>
                                <Cross1Icon className="h-3 w-3" />
                            </AlertDialogCancel>
                        </div>
                        <ShareRelation username={username || ''} />
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <div ref={d3Container} style={{ width: '100%', height: '100%' }}></div>
        </div>
    );
};

export default Relations;
