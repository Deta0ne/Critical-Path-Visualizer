import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useTheme } from '@/components/theme-provider';
import { useActivityStore } from '@/store/use-activity-store';
import { Node, Link } from '@/types/Activity';

export function NetworkView() {
    const svgRef = useRef<SVGSVGElement>(null);
    const { theme } = useTheme();
    const activities = useActivityStore((state) => state.activities as Node[]);

    useEffect(() => {
        if (!svgRef.current || !activities.length) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const container = svg.node()?.getBoundingClientRect();
        const width = container?.width || 800;
        const height = 500;
        const nodeRadius = 40;

        // Create links from dependencies
        const links: Link[] = activities
            .flatMap((activity) =>
                activity.dependencies.map((depId) => ({
                    source: activities.find((a) => a.id.toString() === depId)!,
                    target: activity,
                })),
            )
            .filter((link) => link.source && link.target);

        // Setup zoom behavior
        const zoom = d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        const g = svg.append('g');

        // Define arrow marker
        svg.append('defs')
            .append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 34)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 8)
            .attr('markerHeight', 8)
            .append('path')
            .attr('d', 'M 0,-5 L 10,0 L 0,5')
            .attr('fill', theme === 'dark' ? 'rgb(153, 153, 153)' : 'black');

        // Create links
        const link = g
            .append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', theme === 'dark' ? 'rgb(153, 153, 153)' : 'black')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrowhead)');

        // Create node groups
        const nodeGroup = g
            .append('g')
            .selectAll('g')
            .data(activities)
            .join('g')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .call(d3.drag<any, any>().on('start', dragStarted).on('drag', dragging).on('end', dragEnded));

        // Add circles for nodes
        nodeGroup.append('circle').attr('r', nodeRadius).attr('fill', 'rgb(105, 179, 162)');

        // Add activity name
        nodeGroup
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.3em')
            .attr('fill', theme === 'dark' ? 'white' : 'black')
            .attr('font-size', '14')
            .text((d) => d.name || `A${d.id}`);

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
    }, [activities, theme]);

    return (
        <div className="border rounded-lg  bg-muted">
            <div className="w-full h-[500px] overflow-hidden">
                <h2 className="text-lg font-semibold">Network View</h2>
                <svg ref={svgRef} className="w-full h-full" />
            </div>
        </div>
    );
}
