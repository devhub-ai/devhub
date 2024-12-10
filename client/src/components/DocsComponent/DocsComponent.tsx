
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const DocsComponent = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl mb-6">DevHub: Building Core Features</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            DevHub is a robust platform designed to enhance collaboration and networking within a developer community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This document details the development of three key features:</p>
          <ol className="list-decimal list-inside mt-2">
            <li><strong>Finding People</strong>: Utilizing tag-based and graph-based relationships.</li>
            <li><strong>Recommendations</strong>: Providing personalized suggestions for users and projects.</li>
            <li><strong>Visualization</strong>: Displaying user connections and project interactions visually.</li>
          </ol>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="feature-1">
          <AccordionTrigger>
            <h2 className="text-2xl">Feature 1: Finding People</h2>
          </AccordionTrigger>
          <AccordionContent>
            <h3 className="text-xl mb-2">Purpose</h3>
            <p className="mb-4">To help users connect with individuals sharing similar interests, skills, or project goals.</p>

            <h3 className="text-xl mb-2">Implementation</h3>
            <p className="mb-2">We use Neo4j's graph database to explore connections and common interests. The implementation involves two main queries:</p>

            <h4 className="text-lg mt-4 mb-2">Common Tags Between Users</h4>
            <p className="mb-2">Matches users based on shared project tags using a breadth-first search (BFS) query.</p>
            <pre className="border p-4 rounded-md overflow-x-auto max-w-[310px]">
              <code className="overflow-x-auto">{`MATCH (u1:User)-[:CONNECTED_TO]->(:Project)-[:TAGGED_WITH]->(tag:Tag)<-[:TAGGED_WITH]-(:Project)<-[:CONNECTED_TO]-(u2:User)
WHERE u1.username = $username AND u1 <> u2
RETURN u2.username AS commonUser, collect(tag.name) AS commonTags`}</code>
            </pre>

            <h4 className="text-lg mt-4 mb-2">User Suggestions</h4>
            <p className="mb-2">Combines friendship data and project participation to suggest potential connections, excluding existing friends.</p>
            <pre className="border p-4 rounded-md overflow-x-auto max-w-[310px]">
              <code className="overflow-x-auto">{`MATCH (u:User {username: $username})-[:FRIEND]-(friend)
WITH u, collect(friend.username) AS friends
MATCH (u:User {username: $username})
RETURN u.suggestions AS suggestions, friends`}</code>
            </pre>

            <h3 className="text-xl mt-6 mb-2">Tech Stack</h3>
            <ul className="list-disc list-inside">
              <li><strong>Neo4j</strong>: Handles graph-based queries and relationships.</li>
              <li><strong>Flask API</strong>: Serves data to the frontend in JSON format.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="feature-2">
          <AccordionTrigger>
            <h2 className="text-2xl ">Feature 2: Recommendations</h2>
          </AccordionTrigger>
          <AccordionContent>
            <h3 className="text-xl  mb-2">Purpose</h3>
            <p className="mb-4">Provide users with tailored suggestions for other developers, projects, or opportunities based on their activities and connections.</p>

            <h3 className="text-xl  mb-2">Implementation</h3>
            <p>The recommendation system analyzes:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Direct connections and mutual friends.</li>
              <li>Tags on projects the user has interacted with.</li>
            </ul>
            <p>Outputs are filtered to exclude current friends to maintain relevance.</p>

            <h3 className="text-xl  mt-6 mb-2">Tech Stack</h3>
            <ul className="list-disc list-inside">
              <li><strong>Neo4j</strong>: For real-time relationship computations.</li>
              <li><strong>Python</strong>: For backend logic.</li>
              <li><strong>LangChain & GenAI</strong>: Enhance recommendation relevance by using AI to validate and optimize query results.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="feature-3">
          <AccordionTrigger>
            <h2 className="text-2xl ">Feature 3: Visualization of User Connections and Projects</h2>
          </AccordionTrigger>
          <AccordionContent>
            <h3 className="text-xl  mb-2">Purpose</h3>
            <p className="mb-4">Provide a visual interface to display how users are interconnected through projects and shared tags.</p>

            <h3 className="text-xl  mb-2">Implementation</h3>
            <p className="mb-2">Graph traversal generates data about direct and indirect relationships.</p>
            <p className="mb-2">Example Query:</p>
            <pre className="border p-4 rounded-md overflow-x-auto mb-4 max-w-[310px]">
              <code>{`MATCH (u:User {username: $username})-[r1]->(n1)
OPTIONAL MATCH (n1)-[r2]->(n2)
RETURN ...`}</code>
            </pre>

            <h4 className="text-lg  mb-2">Data Transformation</h4>
            <p className="mb-4">Converts Neo4j query results into nodes and edges for frontend visualization.</p>

            <h4 className="text-lg  mb-2">Frontend Representation</h4>
            <ul className="list-disc list-inside mb-4">
              <li>Nodes represent users or projects.</li>
              <li>Links represent relationships like "connected to" or "tagged with."</li>
            </ul>

            <h3 className="text-xl  mt-6 mb-2">Tech Stack</h3>
            <ul className="list-disc list-inside">
              <li><strong>Neo4j</strong>: Graph database.</li>
              <li><strong>D3.js</strong>: For interactive frontend visualization.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="challenges">
          <AccordionTrigger>
            <h2 className="text-2xl ">Challenges and Solutions</h2>
          </AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal list-inside space-y-4">
              <li>
                <strong>Efficient Querying</strong>
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li><strong>Challenge</strong>: Scaling graph queries for large datasets.</li>
                  <li><strong>Solution</strong>: Optimized Cypher queries and added caching mechanisms.</li>
                </ul>
              </li>
              <li>
                <strong>Maintaining Relevance</strong>
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li><strong>Challenge</strong>: Ensuring recommendations align with user interests.</li>
                  <li><strong>Solution</strong>: Used AI models (LangChain) to validate relevance.</li>
                </ul>
              </li>
              <li>
                <strong>Real-Time Visualization</strong>
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li><strong>Challenge</strong>: Rendering complex graphs in real-time.</li>
                  <li><strong>Solution</strong>: Pre-processed data before sending it to the frontend to reduce rendering time.</li>
                </ul>
              </li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conclusion</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            DevHub's core features leverage a blend of advanced graph databases, AI models, and visualization libraries to create a seamless user experience. By focusing on connections, recommendations, and intuitive interfaces, DevHub stands out as a platform for collaboration and growth in the developer community.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default DocsComponent