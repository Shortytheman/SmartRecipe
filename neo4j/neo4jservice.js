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

  async createModel(model, data) {
    const modelName = model.charAt(0).toUpperCase() + model.slice(1);
    const methodName = `create${modelName}`;

    if (typeof this[methodName] !== 'function') {
      throw new Error(`Method ${methodName} not found for model ${model}`);
    }

    return this[methodName](data);
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
      'CREATE CONSTRAINT IF NOT EXISTS ON (u:User) ASSERT u.email IS UNIQUE',
      'CREATE CONSTRAINT IF NOT EXISTS ON (i:Ingredient) ASSERT i.name IS UNIQUE',
      'CREATE CONSTRAINT IF NOT EXISTS ON (r:Recipe) ASSERT r.id IS UNIQUE',
      'CREATE CONSTRAINT IF NOT EXISTS ON (up:UserPrompt) ASSERT up.id IS UNIQUE',
      'CREATE CONSTRAINT IF NOT EXISTS ON (ar:AIResponse) ASSERT ar.id IS UNIQUE',
      'CREATE CONSTRAINT IF NOT EXISTS ON (ins:Instruction) ASSERT ins.id IS UNIQUE',
      'CREATE CONSTRAINT IF NOT EXISTS ON (rm:RecipeModification) ASSERT rm.id IS UNIQUE',
      'CREATE CONSTRAINT IF NOT EXISTS ON (mr:ModificationResponse) ASSERT mr.id IS UNIQUE'
  ];

    for (const constraint of constraints) {
        try {
            await this.query(constraint);
            console.log(`Created constraint: ${constraint}`);
        } catch (error) {
            console.error(`Error creating constraint: ${constraint}`, error);
            throw error;
        }
    }
}

async createIndexes() {
  const indexes = [
      'CREATE INDEX recipe_name_idx IF NOT EXISTS FOR (r:Recipe) ON (r.name)',
      'CREATE INDEX recipe_created_idx IF NOT EXISTS FOR (r:Recipe) ON (r.createdAt)',
      'CREATE INDEX user_oauth_idx IF NOT EXISTS FOR (u:User) ON (u.oauthId)',
      'CREATE INDEX ingredient_category_idx IF NOT EXISTS FOR (i:Ingredient) ON (i.category)',
      'CREATE INDEX user_prompt_created_idx IF NOT EXISTS FOR (up:UserPrompt) ON (up.createdAt)',
      'CREATE INDEX ai_response_created_idx IF NOT EXISTS FOR (ar:AIResponse) ON (ar.createdAt)'
  ];

  for (const index of indexes) {
      try {
          await this.query(index);
          console.log(`Created index: ${index}`);
      } catch (error) {
          console.error(`Error creating index: ${index}`, error);
          throw error;
      }
  }
}

  async clearDatabase() {
    console.log('Clearing existing database data...');

    try {
        const constraints = await this.query('SHOW CONSTRAINTS');
        for (const constraint of constraints.records) {
            await this.query(`DROP CONSTRAINT ${constraint.get('name')}`);
        }
        console.log('Dropped existing constraints');
    } catch (error) {
        console.log('No existing constraints to drop');
    }

    try {
        const indexes = await this.query('SHOW INDEXES');
        for (const index of indexes.records) {
            if (index.get('type') !== 'LOOKUP') { // Don't drop internal indexes
                await this.query(`DROP INDEX ${index.get('name')}`);
            }
        }
        console.log('Dropped existing indexes');
    } catch (error) {
        console.log('No existing indexes to drop');
    }

    // Delete all nodes and relationships
    await this.query('MATCH (n) DETACH DELETE n');
    console.log('Deleted all nodes and relationships');

    // Verify database is empty
    const result = await this.query('MATCH (n) RETURN count(n) as count');
    const count = result.records[0].get('count').toNumber();

    if (count === 0) {
        console.log('Database cleared successfully');
    } else {
        throw new Error(`Database not properly cleared. ${count} nodes remaining.`);
    }
}

  _stringifyComplexProps(data) {
    const processed = { ...data };
    for (const [key, value] of Object.entries(processed)) {
      if (typeof value === 'object' && value !== null) {
        processed[key] = JSON.stringify(value);
      }
    }
    return processed;
  }

  _parseComplexProps(data) {
    const processed = { ...data };
    for (const [key, value] of Object.entries(processed)) {
      try {
        processed[key] = JSON.parse(value);
      } catch (e) {
        // If it's not JSON parseable, keep original value
        continue;
      }
    }
    return processed;
  }

  _convertNeo4jInteger(neo4jInteger) {
    return neo4jInteger.low + (neo4jInteger.high << 32);
}

  async getAll(model) {
    const label = model.charAt(0).toUpperCase() + model.slice(1);
    const result = await this.query(`MATCH (n:${label}) RETURN n`);
    return result.records.map(record => record.get('n').properties);
  }

  async createNode(label, properties) {
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    const id = `${label.toLowerCase()}_${Date.now()}_${randomSuffix}`;
    const processedProps = this._stringifyComplexProps(properties);
    
    const result = await this.query(
      `
      CREATE (n:${label})
      SET n += $props,
          n.id = $id,
          n.createdAt = datetime().epochMillis,
          n.updatedAt = datetime().epochMillis
      RETURN n
      `,
      {
        props: processedProps,
        id: id
      }
    );
    return this._parseComplexProps(result.records[0].get('n').properties);
}

  async updateNode(label, id, properties) {
    const result = await this.query(
        `
            MATCH (n:${label} {id: $id})
            SET n += $props, n.updatedAt = datetime().epochMillis
            RETURN n
            `,
        {
          id,
          props: properties,
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
  async createRelationship(fromNode, toNode, relationType, properties = {}) {
    const result = await this.query(
        `
        MATCH (from) WHERE from.id = $fromId
        MATCH (to) WHERE to.id = $toId
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
    return result.records[0].get('r');
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
  async createUser(data) {
    return this.createNode('User', data);
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
  async createIngredient(data) {
    return this.createNode('Ingredient', data);
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
  async createUserPrompt(data) {
    return this.createNode('UserPrompt', data);
  }

  async getUserPrompt(id) {
    const result = await this.query(
        'MATCH (up:UserPrompt {id: $id}) RETURN up',
        { id }
    );
    const userPrompt = result.records[0].get('up').properties;
    userPrompt.prompt = JSON.parse(userPrompt.prompt);
    return userPrompt;
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
  async createAIResponse(data) {
    return this.createNode('AIResponse', data);
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

  async createRecipe(data) {
    return this.createRecipeWithIngredientsAndInstructions(data);
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
  async createInstruction(data) {
    return this.createNode('Instruction', data);
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
    return this.createNode('RecipeIngredient', properties);
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
  async createRecipeModification(data) {
    return this.createNode('RecipeModification', data);
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
  async createModificationResponse(data) {
    return this.createNode('ModificationResponse', data);
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
    return this.createNode('UserRecipe', properties);
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

  async createRecipeWithIngredientsAndInstructions(data) {
    const session = this.driver.session();
    try {
        const result = await session.executeWrite(async tx => {
            // Check if AIResponse exists
            const aiResponseCheck = await tx.run(
                'MATCH (ar:AIResponse {id: $aiResponseId}) RETURN ar',
                { aiResponseId: data.aiResponseId }
            );

            if (aiResponseCheck.records.length === 0) {
                throw new Error(`AIResponse with id ${data.aiResponseId} does not exist.`);
            }

            // Create Recipe node
            const recipeResult = await tx.run(
                `
                CREATE (r:Recipe {
                    id: $id,
                    name: $name,
                    prepTime: $prepTime,
                    prepUnit: $prepUnit,
                    cookTime: $cookTime,
                    cookUnit: $cookUnit,
                    portionSize: $portionSize,
                    finalComment: $finalComment
                })
                SET r.createdAt = datetime().epochMillis,
                    r.updatedAt = datetime().epochMillis
                WITH r
                MATCH (ar:AIResponse {id: $aiResponseId})
                CREATE (ar)-[:GENERATES]->(r)
                RETURN r
                `,
                {
                    id: `recipe_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
                    name: data.name,
                    prepTime: data.prepTime,
                    prepUnit: data.prepUnit,
                    cookTime: data.cookTime,
                    cookUnit: data.cookUnit,
                    portionSize: data.portions,
                    finalComment: data.final_comment,
                    aiResponseId: data.aiResponseId
                }
            );

            const recipe = recipeResult.records[0].get('r').properties;

            // Create or merge ingredients and create relationships
            for (const ingredient of data.ingredients) {
                await tx.run(
                    `
                    MERGE (i:Ingredient {name: $name})
                    ON CREATE SET 
                        i.id = $id,
                        i.createdAt = timestamp(),
                        i.category = $category
                    WITH i
                    MATCH (r:Recipe {id: $recipeId})
                    CREATE (r)-[rel:CONTAINS {
                        value: $value,
                        unit: $unit,
                        comment: $comment,
                        createdAt: timestamp()
                    }]->(i)
                    `,
                    {
                        name: ingredient.name,
                        id: `ingredient_${Date.now()}_${Math.random()}`,
                        category: ingredient.category || 'uncategorized',
                        recipeId: recipe.id,
                        value: ingredient.value,
                        unit: ingredient.unit,
                        comment: ingredient.comment
                    }
                );
            }

            // Create instructions with relationships
            for (const instruction of data.instructions) {
                await tx.run(
                    `
                    MATCH (r:Recipe {id: $recipeId})
                    CREATE (i:Instruction {
                        id: $id,
                        part: $part,
                        steps: $steps,
                        createdAt: timestamp()
                    })-[:PART_OF]->(r)
                    `,
                    {
                        recipeId: recipe.id,
                        id: `instruction_${Date.now()}_${Math.random()}`,
                        part: instruction.part,
                        steps: instruction.steps
                    }
                );
            }

            // Get complete recipe with relationships
            const finalResult = await tx.run(
                `
                MATCH (r:Recipe {id: $recipeId})
                OPTIONAL MATCH (r)-[rel:CONTAINS]->(i:Ingredient)
                OPTIONAL MATCH (ins:Instruction)-[:PART_OF]->(r)
                OPTIONAL MATCH (ar:AIResponse)-[:GENERATES]->(r)
                RETURN r,
                       collect(DISTINCT {ingredient: i, relationship: rel}) as ingredients,
                       collect(DISTINCT ins) as instructions,
                       ar
                `,
                { recipeId: recipe.id }
            );

            return finalResult.records[0];
        });

        // Transform and parse the results
        const recipe = result.get('r').properties;
        const ingredients = result.get('ingredients')
            .filter(i => i.ingredient)
            .map(i => ({
                ...i.ingredient.properties,
                value: i.relationship.properties.value,
                unit: i.relationship.properties.unit,
                comment: i.relationship.properties.comment
            }));
        const instructions = result.get('instructions')
            .map(i => i.properties);

        return {
            ...recipe,
            ingredients,
            instructions,
            prep: {
                value: recipe.prepTime,
                unit: recipe.prepUnit
            },
            cook: {
                value: recipe.cookTime,
                unit: recipe.cookUnit
            }
        };

    } finally {
        await session.close();
    }
}
}

export { Neo4jService };