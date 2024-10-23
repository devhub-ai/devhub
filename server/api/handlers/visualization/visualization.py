from flask import request, jsonify
from extensions import neo4j_db

def get_user_relations():
    username = request.args.get('username')
    query = """
    MATCH (u:User {username: $username})-[r]->(n)
    RETURN u.username AS userUsername, r.type AS relationshipType, 
           COALESCE(n.id, n.username, n.name, id(n)) AS nodeId, labels(n) AS nodeLabels
    """
    try:
        with neo4j_db.driver.session() as session:
            result = session.run(query, username=username)
            nodes = []
            links = []
            node_ids = set()  # To avoid adding duplicate nodes
            
            for record in result:
                u = record["userUsername"]
                r = record["relationshipType"]
                n_id = str(record["nodeId"])  # Convert nodeId to string
                n_labels = record["nodeLabels"][0] if record["nodeLabels"] else "Unknown"

                # Add the user node if not already added
                if u not in node_ids:
                    nodes.append({"id": u, "label": "User"})
                    node_ids.add(u)

                # Add the related node if not already added
                if n_id not in node_ids:
                    nodes.append({"id": n_id, "label": n_labels})
                    node_ids.add(n_id)

                # Add the link/relationship
                links.append({"source": u, "target": n_id, "type": r})

            return jsonify({"nodes": nodes, "links": links})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
