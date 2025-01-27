import neo4j from "neo4j-driver";
import { v4 as uuidv4 } from "uuid"

const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "password"));

// You should create a new session for each operation to avoid multiple queries running on the same session
export const neo4jservice = {
  nodes: {
    create: async (label, data) => {
      const session = driver.session();
      try {
        const nodeData = { ...data, id: data.id || uuidv4() };
        const result = await session.executeWrite((tx) =>
          tx.run(`CREATE (n:${label} $props) RETURN n`, { props: nodeData })
        );
        const node = result.records[0].get(0);
        return node.properties ;
      } catch (error) {
        throw new Error("Error creating node: " + error.message);
      } finally {
        await session.close();
      }
    },

    read: async (label, query) => {
      const session = driver.session();  // Open a new session
      try {
        const result = await session.executeWrite((tx) =>
          tx.run(`MATCH (n:${label}) WHERE ${query} RETURN n`)
        );
        return result.records;
      } catch (error) {
        throw new Error("Error reading node: " + error.message);
      } finally {
        await session.close();  // Always close the session after use
      }
    },

    update: async (label, match, updates) => {
      const session = driver.session();  // Open a new session
      try {
        const result = await session.executeWrite((tx) =>
          tx.run(
            `MATCH (n:${label}) WHERE ${match} SET ${Object.entries(updates)
              .map(([k, v]) => `n.${k} = '${v}'`)
              .join(", ")} RETURN n`
          )
        );
        return result.records[0].get(0).properties;
      } catch (error) {
        throw new Error("Error updating node: " + error.message);
      } finally {
        await session.close();
      }
    },

    delete: async (label, match) => {
      const session = driver.session();  // Open a new session
      try {
        await session.executeWrite((tx) =>
          tx.run(`MATCH (n:${label}) WHERE ${match} DELETE n`)
        );
      } catch (error) {
        throw new Error("Error deleting node: " + error.message);
      } finally {
        await session.close();  // Always close the session after use
      }
    },

    createRelationship: async (startNode, relationshipType, endNode) => {
      console.log(startNode, relationshipType, endNode);
      console.log(startNode.id, endNode.id);
      const session = driver.session();
      try {
        const query = `
          MATCH (start {id: $startId})
          MATCH (end {id: $endId})
          CREATE (start)-[:${relationshipType}]->(end)
        `;
        await session.executeWrite((tx) =>
          tx.run(query, { startId: startNode.id, endId: endNode.id }),
          console.log(query)
        );
      } catch (error) {
        throw new Error("Error creating relationship: " + error.message);
      } finally {
        await session.close();
      }
    }
  },
};

// Example of closing the connections when done
export const closeConnections = async () => {
  await driver.close();
};
