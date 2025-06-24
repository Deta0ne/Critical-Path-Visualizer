import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useTheme } from '@/components/theme-provider';
import { useActivityStore } from '@/store/use-activity-store';
import { Node, Link } from '@/types/Activity';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function NetworkView() {
    const [isExpanded, setIsExpanded] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);
    const { theme } = useTheme();
    const activities = useActivityStore((state) => state.activities as Node[]);
    const startDate = useActivityStore((state) => state.startDate);
    const calculateCPM = useActivityStore((state) => state.calculateCPM);

    const cpmResults = useMemo(() => {
        if (!startDate || !activities.length) return [];
        return calculateCPM();
    }, [activities, startDate, calculateCPM]);

    useEffect(() => {
        if (!svgRef.current || !activities.length) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const container = svg.node()?.getBoundingClientRect();
        const width = container?.width || 800;
        const height = 500;
        const nodeRadius = 40;

        // Create links from dependencies and mark critical path links
        const links: Link[] = activities
            .flatMap((activity) =>
                activity.dependencies.map((depName) => {
                    const source = activities.find((a) => a.name === depName);
                    if (!source) return null;
                    const target = activity;
                    const sourceResult = cpmResults.find((r) => r.name === source.name);
                    const targetResult = cpmResults.find((r) => r.name === target.name);
                    return {
                        source,
                        target,
                        isCritical: sourceResult?.isOnCriticalPath && targetResult?.isOnCriticalPath,
                    } as Link;
                }),
            )
            .filter((link): link is Link => link !== null && link.source !== undefined && link.target !== undefined);

        // Setup zoom behavior
        const zoom = d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        const g = svg.append('g');

        // Define arrow markers for both normal and critical paths
        const defs = svg.append('defs');

        // Normal path arrow
        defs.append('marker')
            .attr('id', 'arrowhead-normal')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 34)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 8)
            .attr('markerHeight', 8)
            .append('path')
            .attr('d', 'M 0,-5 L 10,0 L 0,5')
            .attr('fill', theme === 'dark' ? 'rgb(153, 153, 153)' : 'black');

        // Critical path arrow
        defs.append('marker')
            .attr('id', 'arrowhead-critical')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 34)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 8)
            .attr('markerHeight', 8)
            .append('path')
            .attr('d', 'M 0,-5 L 10,0 L 0,5')
            .attr('fill', 'hsl(var(--chart-1))');

        // Create links
        const link = g
            .append('g')
            .selectAll<SVGLineElement, Link>('line')
            .data(links)
            .join('line')
            .attr('stroke', (d: Link) =>
                d.isCritical ? 'hsl(var(--chart-1))' : theme === 'dark' ? 'rgb(153, 153, 153)' : 'black',
            )
            .attr('stroke-width', () => 2)
            .attr('marker-end', (d: Link) => (d.isCritical ? 'url(#arrowhead-critical)' : 'url(#arrowhead-normal)'));

        // Create node groups
        const nodeGroup = g
            .append('g')
            .selectAll<SVGGElement, Node>('g')
            .data(activities)
            .join('g')
            .call((g) =>
                g.call(d3.drag<SVGGElement, Node>().on('start', dragStarted).on('drag', dragging).on('end', dragEnded)),
            );

        // Add circles for nodes
        nodeGroup
            .append('circle')
            .attr('r', nodeRadius)
            .attr('fill', (d: Node) => {
                const result = cpmResults.find((r) => r.name === d.name);
                return result?.isOnCriticalPath ? 'hsl(var(--chart-1))' : 'rgb(105, 179, 162)';
            });

        // Add activity name
        nodeGroup
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.3em')
            .attr('fill', theme === 'dark' ? 'white' : 'black')
            .attr('font-size', '14')
            .text((d: Node) => d.name || `A${d.id}`);

        // Setup force simulation
        const simulation = d3
            .forceSimulation<Node>(activities)
            .force('link', d3.forceLink<Node, Link>(links).distance(200))
            .force('charge', d3.forceManyBody().strength(-1000))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(nodeRadius * 1.5));

        // Update positions on simulation tick
        simulation.on('tick', () => {
            link.attr('x1', (d) => (d.source as Node).x!)
                .attr('y1', (d) => (d.source as Node).y!)
                .attr('x2', (d) => (d.target as Node).x!)
                .attr('y2', (d) => (d.target as Node).y!);

            nodeGroup.attr('transform', (d) => `translate(${d.x!},${d.y!})`);
        });

        // Drag functions
        function dragStarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragging(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragEnded(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        // Cleanup function
        return () => {
            simulation.stop();
        };
    }, [activities, theme, cpmResults]);

    return (
        <div className={isExpanded ? 'fixed inset-0 p-6 z-50 bg-background' : 'w-full h-full'}>
            <Card className="w-full h-full">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle>Network View</CardTitle>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-[hsl(var(--chart-1))]" />
                                <span className="text-sm text-muted-foreground">Critical Path</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-[rgb(105,179,162)]" />
                                <span className="text-sm text-muted-foreground">Normal Activity</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="ml-2"
                            >
                                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-[calc(100%-40px)] w-full pt-0">
                    <svg ref={svgRef} className="w-full h-full" />
                </CardContent>
            </Card>
        </div>
    );
}
