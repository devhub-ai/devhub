from flask import request, jsonify
from extensions import neo4j_db

def get_user_relations():
    username = request.args.get('username')
    query = """
    MATCH (u:User {username: $username})-[r1]->(n1)
    OPTIONAL MATCH (n1)-[r2]->(n2)
    RETURN u.username AS userUsername, r1.type AS relationshipType1, 
    COALESCE(n1.id, n1.username, n1.name, id(n1)) AS nodeId1, labels(n1) AS nodeLabels1,
    r2.type AS relationshipType2, 
    COALESCE(n2.id, n2.username, n2.name, id(n2)) AS nodeId2, labels(n2) AS nodeLabels2
    """
    try:
        with neo4j_db.driver.session() as session:
            result = session.run(query, username=username)
            nodes = []
            links = []
            node_ids = set()  # To avoid adding duplicate nodes
            
            for record in result:
                u = record["userUsername"]
                r1 = record["relationshipType1"]
                n1_id = str(record["nodeId1"])  # Convert nodeId to string
                n1_labels = record["nodeLabels1"][0] if record["nodeLabels1"] else "Unknown"
                
                r2 = record["relationshipType2"]
                n2_id = str(record["nodeId2"]) if record["nodeId2"] else None
                n2_labels = record["nodeLabels2"][0] if record["nodeLabels2"] else "Unknown"

                # Add the user node if not already added
                if u not in node_ids:
                    nodes.append({"id": u, "label": "User"})
                    node_ids.add(u)

                # Add the first-level related node if not already added
                if n1_id not in node_ids:
                    nodes.append({"id": n1_id, "label": n1_labels})
                    node_ids.add(n1_id)

                # Add the first-level link/relationship
                links.append({"source": u, "target": n1_id, "type": r1})

                # Add the second-level related node if it exists and not already added
                if n2_id and n2_id not in node_ids:
                    nodes.append({"id": n2_id, "label": n2_labels})
                    node_ids.add(n2_id)

                # Add the second-level link/relationship if it exists
                if n2_id:
                    links.append({"source": n1_id, "target": n2_id, "type": r2})

            return jsonify({"nodes": nodes, "links": links})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
