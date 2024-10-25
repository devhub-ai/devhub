import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface ShareRelationProps {
    username: string;
}

const RelationCode = ({ username }: ShareRelationProps) => {
    return (
        <div className="grid gap-4">
            <ScrollArea className="rounded-md border bg-black p-4">
                    <pre>
                        <code className="grid gap-1 text-sm text-muted-foreground [&_span]:h-5">
                            <span>
                            <span className="text-sky-300">MATCH</span> (u:<span className="text-amber-300">User</span> &#123;username:
                            <span className="text-green-300">{username}</span>&#125;)-[r1]-&gt;(n1)
                            </span>
                            <span>
                                <span className="text-sky-300">OPTIONAL MATCH</span> (n1)-[r2]-&gt;(n2)
                            </span>
                            <span>
                                <span className="text-sky-300">RETURN</span> u.username <span className="text-sky-300">AS </span>
                                <span className="text-green-300">userUsername</span>, r1.type <span className="text-sky-300">AS </span>
                                <span className="text-green-300">relationshipType1</span>,
                            </span>
                            <span>
                                COALESCE(n1.id, n1.username, n1.name, id(n1)) <span className="text-sky-300">AS </span>
                                <span className="text-green-300">nodeId1</span>, labels(n1) <span className="text-sky-300">AS </span>
                                <span className="text-green-300">nodeLabels1</span>,
                            </span>
                            <span>
                                r2.type <span className="text-sky-300">AS </span> <span className="text-green-300">relationshipType2</span>,
                            </span>
                            <span>
                                COALESCE(n2.id, n2.username, n2.name, id(n2)) <span className="text-sky-300">AS </span>
                                <span className="text-green-300">nodeId2</span>, labels(n2) <span className="text-sky-300">AS </span>
                                <span className="text-green-300">nodeLabels2</span>
                            </span>
                        </code>
                    </pre>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <div>
                <p className="text-sm text-muted-foreground">
                    This Cypher query retrieves a user's direct and optional second-level relationships, returning the user's username, relationship types, node IDs, and labels for both levels of connected nodes.
                </p>
            </div>
        </div>
    )
}

export default RelationCode