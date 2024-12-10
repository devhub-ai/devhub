from extensions import neo4j_db
from flask import jsonify

def directory():
    query = "MATCH (u:User) RETURN u.username AS username, u.email AS email"
    with neo4j_db.driver.session() as session:
        result = session.run(query)
        users = []
        for record in result:
            users.append({
                'username': record["username"],
                'email': record["email"]
            })
        return jsonify(users), 200