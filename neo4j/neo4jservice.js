// neo4jService.js
import { driver } from './neo4jConnector.js';

class Neo4jService {
  constructor() {
    this.driver = driver;
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

  async getAll(model) {
    const label = model.charAt(0).toUpperCase() + model.slice(1);
    const result = await this.query(`MATCH (n:${label}) RETURN n`);
    return result.records.map(record => record.get('n').properties);
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

  // CRUD Operations for Users
  async createUser(properties) {
    const result = await this.query(
      `CREATE (u:User $props) RETURN u`,
      { props: properties }
    );
    return result.records[0].get('u').properties;
  }

  async getUser(id) {
    const result = await this.query(
      `MATCH (u:User {id: $id}) RETURN u`,
      { id }
    );
    return result.records[0]?.get('u').properties;
  }

  async updateUser(id, properties) {
    const result = await this.query(
      `MATCH (u:User {id: $id}) SET u += $props RETURN u`,
      { id, props: properties }
    );
    return result.records[0].get('u').properties;
  }

  async deleteUser(id) {
    await this.query(
      `MATCH (u:User {id: $id}) DETACH DELETE u`,
      { id }
    );
  }

  // CRUD Operations for Ingredients
  async createIngredient(properties) {
    const result = await this.query(
      `CREATE (i:Ingredient $props) RETURN i`,
      { props: properties }
    );
    return result.records[0].get('i').properties;
  }

  async getIngredient(id) {
    const result = await this.query(
      `MATCH (i:Ingredient {id: $id}) RETURN i`,
      { id }
    );
    return result.records[0]?.get('i').properties;
  }

  async updateIngredient(id, properties) {
    const result = await this.query(
      `MATCH (i:Ingredient {id: $id}) SET i += $props RETURN i`,
      { id, props: properties }
    );
    return result.records[0].get('i').properties;
  }

  async deleteIngredient(id) {
    await this.query(
      `MATCH (i:Ingredient {id: $id}) DETACH DELETE i`,
      { id }
    );
  }

  // CRUD Operations for UserPrompts
  async createUserPrompt(properties) {
    const result = await this.query(
      `CREATE (up:UserPrompt $props) RETURN up`,
      { props: properties }
    );
    return result.records[0].get('up').properties;
  }

  async getUserPrompt(id) {
    const result = await this.query(
      `MATCH (up:UserPrompt {id: $id}) RETURN up`,
      { id }
    );
    return result.records[0]?.get('up').properties;
  }

  async updateUserPrompt(id, properties) {
    const result = await this.query(
      `MATCH (up:UserPrompt {id: $id}) SET up += $props RETURN up`,
      { id, props: properties }
    );
    return result.records[0].get('up').properties;
  }

  async deleteUserPrompt(id) {
    await this.query(
      `MATCH (up:UserPrompt {id: $id}) DETACH DELETE up`,
      { id }
    );
  }

  // CRUD Operations for AIResponses
  async createAIResponse(properties) {
    const result = await this.query(
      `CREATE (ar:AIResponse $props) RETURN ar`,
      { props: properties }
    );
    return result.records[0].get('ar').properties;
  }

  async getAIResponse(id) {
    const result = await this.query(
      `MATCH (ar:AIResponse {id: $id}) RETURN ar`,
      { id }
    );
    return result.records[0]?.get('ar').properties;
  }

  async updateAIResponse(id, properties) {
    const result = await this.query(
      `MATCH (ar:AIResponse {id: $id}) SET ar += $props RETURN ar`,
      { id, props: properties }
    );
    return result.records[0].get('ar').properties;
  }

  async deleteAIResponse(id) {
    await this.query(
      `MATCH (ar:AIResponse {id: $id}) DETACH DELETE ar`,
      { id }
    );
  }

  // CRUD Operations for Recipes
  async createRecipe(properties) {
    const result = await this.query(
      `CREATE (r:Recipe $props) RETURN r`,
      { props: properties }
    );
    return result.records[0].get('r').properties;
  }

  async getRecipe(id) {
    const result = await this.query(
      `MATCH (r:Recipe {id: $id}) RETURN r`,
      { id }
    );
    return result.records[0]?.get('r').properties;
  }

  async updateRecipe(id, properties) {
    const result = await this.query(
      `MATCH (r:Recipe {id: $id}) SET r += $props RETURN r`,
      { id, props: properties }
    );
    return result.records[0].get('r').properties;
  }

  async deleteRecipe(id) {
    await this.query(
      `MATCH (r:Recipe {id: $id}) DETACH DELETE r`,
      { id }
    );
  }

  // CRUD Operations for Instructions
  async createInstruction(properties) {
    const result = await this.query(
      `CREATE (i:Instruction $props) RETURN i`,
      { props: properties }
    );
    return result.records[0].get('i').properties;
  }

  async getInstruction(id) {
    const result = await this.query(
      `MATCH (i:Instruction {id: $id}) RETURN i`,
      { id }
    );
    return result.records[0]?.get('i').properties;
  }

  async updateInstruction(id, properties) {
    const result = await this.query(
      `MATCH (i:Instruction {id: $id}) SET i += $props RETURN i`,
      { id, props: properties }
    );
    return result.records[0].get('i').properties;
  }

  async deleteInstruction(id) {
    await this.query(
      `MATCH (i:Instruction {id: $id}) DETACH DELETE i`,
      { id }
    );
  }

  // CRUD Operations for RecipeIngredients
  async createRecipeIngredient(properties) {
    const result = await this.query(
      `CREATE (ri:RecipeIngredient $props) RETURN ri`,
      { props: properties }
    );
    return result.records[0].get('ri').properties;
  }

  async getRecipeIngredient(id) {
    const result = await this.query(
      `MATCH (ri:RecipeIngredient {id: $id}) RETURN ri`,
      { id }
    );
    return result.records[0]?.get('ri').properties;
  }

  async updateRecipeIngredient(id, properties) {
    const result = await this.query(
      `MATCH (ri:RecipeIngredient {id: $id}) SET ri += $props RETURN ri`,
      { id, props: properties }
    );
    return result.records[0].get('ri').properties;
  }

  async deleteRecipeIngredient(id) {
    await this.query(
      `MATCH (ri:RecipeIngredient {id: $id}) DETACH DELETE ri`,
      { id }
    );
  }

  // CRUD Operations for RecipeModifications
  async createRecipeModification(properties) {
    const result = await this.query(
      `CREATE (rm:RecipeModification $props) RETURN rm`,
      { props: properties }
    );
    return result.records[0].get('rm').properties;
  }

  async getRecipeModification(id) {
    const result = await this.query(
      `MATCH (rm:RecipeModification {id: $id}) RETURN rm`,
      { id }
    );
    return result.records[0]?.get('rm').properties;
  }

  async updateRecipeModification(id, properties) {
    const result = await this.query(
      `MATCH (rm:RecipeModification {id: $id}) SET rm += $props RETURN rm`,
      { id, props: properties }
    );
    return result.records[0].get('rm').properties;
  }

  async deleteRecipeModification(id) {
    await this.query(
      `MATCH (rm:RecipeModification {id: $id}) DETACH DELETE rm`,
      { id }
    );
  }

  // CRUD Operations for ModificationResponses
  async createModificationResponse(properties) {
    const result = await this.query(
      `CREATE (mr:ModificationResponse $props) RETURN mr`,
      { props: properties }
    );
    return result.records[0].get('mr').properties;
  }

  async getModificationResponse(id) {
    const result = await this.query(
      `MATCH (mr:ModificationResponse {id: $id}) RETURN mr`,
      { id }
    );
    return result.records[0]?.get('mr').properties;
  }

  async updateModificationResponse(id, properties) {
    const result = await this.query(
      `MATCH (mr:ModificationResponse {id: $id}) SET mr += $props RETURN mr`,
      { id, props: properties }
    );
    return result.records[0].get('mr').properties;
  }

  async deleteModificationResponse(id) {
    await this.query(
      `MATCH (mr:ModificationResponse {id: $id}) DETACH DELETE mr`,
      { id }
    );
  }

  // CRUD Operations for UserRecipes
  async createUserRecipe(properties) {
    const result = await this.query(
      `CREATE (ur:UserRecipe $props) RETURN ur`,
      { props: properties }
    );
    return result.records[0].get('ur').properties;
  }

  async getUserRecipe(id) {
    const result = await this.query(
      `MATCH (ur:UserRecipe {id: $id}) RETURN ur`,
      { id }
    );
    return result.records[0]?.get('ur').properties;
  }

  async updateUserRecipe(id, properties) {
    const result = await this.query(
      `MATCH (ur:UserRecipe {id: $id}) SET ur += $props RETURN ur`,
      { id, props: properties }
    );
    return result.records[0].get('ur').properties;
  }

  async deleteUserRecipe(id) {
    await this.query(
      `MATCH (ur:UserRecipe {id: $id}) DETACH DELETE ur`,
      { id }
    );
  }

  // Additional methods as needed...
}

export { Neo4jService };