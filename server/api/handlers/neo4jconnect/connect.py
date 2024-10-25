from flask import request, jsonify
from neo4j import GraphDatabase

driver = None

def connect_to_neo4j():
    global driver
    data = request.get_json()
    uri = data.get('neo4jURI')
    username = data.get('username')
    password = data.get('password')

    try:
        driver = GraphDatabase.driver(uri, auth=(username, password))
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

def execute_cypher():
    global driver
    if driver is None:
        return jsonify({'success': False, 'message': 'Not connected to Neo4j'})

    data = request.get_json()
    query = data.get('query')

    try:
        with driver.session() as session:
            result = session.run(query)
            records = [record.data() for record in result]
            return jsonify({'success': True, 'results': records})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})
    
def get_schema(tx):
    # Cypher query to retrieve node labels and their properties
    query = """
    CALL db.schema.nodeTypeProperties()
    """
    return list(tx.run(query))

def schema():
    global driver
    if driver is None:
        return jsonify({'success': False, 'message': 'Not connected to Neo4j'})

    try:
        with driver.session() as session:
            schema_data = session.read_transaction(get_schema)
            return jsonify({"success": True, "schema": schema_data}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

