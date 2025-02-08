// neo4jService.js
import neo4j from 'neo4j-driver';

class Neo4jService {
  constructor() {
    this.driver = neo4j.driver(
        'bolt://localhost:7687',
        neo4j.auth.basic('neo4j', 'password')
    );
  }

  async init() {
    await this.createConstraints();
    await this.createIndexes();
  }

  async query(cypher, params = {}) {
    const session = this.driver.session();
    try {
      return await session.run(cypher, params);
    } finally {
      await session.close();
    }
  }

  async createConstraints() {
    const constraints = [
      'CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE',
      'CREATE CONSTRAINT IF NOT EXISTS FOR (i:Ingredient) REQUIRE i.name IS UNIQUE',
      'CREATE CONSTRAINT IF NOT EXISTS FOR (r:Recipe) REQUIRE r.id IS UNIQUE',
      'CREATE CONSTRAINT IF NOT EXISTS FOR (up:UserPrompt) REQUIRE up.id IS UNIQUE',
      'CREATE CONSTRAINT IF NOT EXISTS FOR (ar:AIResponse) REQUIRE ar.id IS UNIQUE'
    ];

    for (const constraint of constraints) {
      await this.query(constraint);
    }
  }

  async createIndexes() {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS FOR (r:Recipe) ON (r.name)',
      'CREATE INDEX IF NOT EXISTS FOR (r:Recipe) ON (r.createdAt)',
      'CREATE INDEX IF NOT EXISTS FOR (u:User) ON (u.oauthId)',
      'CREATE INDEX IF NOT EXISTS FOR (i:Ingredient) ON (i.category)'
    ];

    for (const index of indexes) {
      await this.query(index);
    }
  }

  // Node operations
  async createNode(label, properties) {
    const timestamp = Date.now();
    const result = await this.query(
        `
            CREATE (n:${label} $props)
            RETURN n
            `,
        {
          props: {
            ...properties,
            id: `${label.toLowerCase()}_${timestamp}`,
            createdAt: timestamp,
            updatedAt: timestamp
          }
        }
    );
    return result.records[0].get('n').properties;
  }

  async updateNode(label, id, properties) {
    const result = await this.query(
        `
            MATCH (n:${label} {id: $id})
            SET n += $props, n.updatedAt = $timestamp
            RETURN n
            `,
        {
          id,
          props: properties,
          timestamp: Date.now()
        }
    );
    return result.records[0].get('n').properties;
  }

  async deleteNode(label, id) {
    await this.query(
        `
            MATCH (n:${label} {id: $id})
            DETACH DELETE n
            `,
        { id }
    );
  }

  // Relationship operations
  async createRelationship(fromNode, relationType, toNode, properties = {}) {
    const result = await this.query(
        `
            MATCH (from {id: $fromId}), (to {id: $toId})
            CREATE (from)-[r:${relationType} $props]->(to)
            RETURN r
            `,
        {
          fromId: fromNode.id,
          toId: toNode.id,
          props: {
            ...properties,
            createdAt: Date.now()
          }
        }
    );
    return result.records[0].get('r').properties;
  }

  // Common queries
  async getRecipeWithIngredients(recipeId) {
    const result = await this.query(
        `
            MATCH (r:Recipe {id: $recipeId})
            MATCH (r)-[rel:CONTAINS_INGREDIENT]->(i:Ingredient)
            RETURN r, collect({ingredient: i, relationship: rel}) as ingredients
            `,
        { recipeId }
    );
    return result.records[0]?.get(0);
  }

  async getUserRecipes(userId) {
    const result = await this.query(
        `
            MATCH (u:User {id: $userId})-[:OWNS_RECIPE]->(r:Recipe)
            RETURN r
            `,
        { userId }
    );
    return result.records.map(record => record.get('r').properties);
  }

  async getRecipeModifications(recipeId) {
    const result = await this.query(
        `
            MATCH (r:Recipe {id: $recipeId})-[:HAS_MODIFICATION]->(m:RecipeModification)
            RETURN m
            `,
        { recipeId }
    );
    return result.records.map(record => record.get('m').properties);
  }
}

export const neo4jService = new Neo4jService();