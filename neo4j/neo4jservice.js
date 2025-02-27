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

    async getModel(model, id) {
      const modelName = model.charAt(0).toUpperCase() + model.slice(1);
      const methodName = `get${modelName}`;

      if (typeof this[methodName] !== 'function') {
          throw new Error(`Method ${methodName} not found for model ${model}`);
      }

      return this[methodName](id);
  }

  async updateModel(model, id, data) {
      const modelName = model.charAt(0).toUpperCase() + model.slice(1);
      const methodName = `update${modelName}`;

      if (typeof this[methodName] !== 'function') {
          throw new Error(`Method ${methodName} not found for model ${model}`);
      }

      return this[methodName](id, data);
  }

  async deleteModel(model, id) {
      const modelName = model.charAt(0).toUpperCase() + model.slice(1);
      const methodName = `delete${modelName}`;

      if (typeof this[methodName] !== 'function') {
          throw new Error(`Method ${methodName} not found for model ${model}`);
      }

      return this[methodName](id);
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


  _processNode(properties) {
    const processed = { ...properties };
    if (processed.createdAt) processed.createdAt = processed.createdAt.toNumber();
    if (processed.updatedAt) processed.updatedAt = processed.updatedAt.toNumber();
    return this._parseComplexProps(processed);
  }

  async getAll(model) {
    const label = model.charAt(0).toUpperCase() + model.slice(1);
    const result = await this.query(`MATCH (n:${label}) RETURN n`);
    return result.records.map(record => this._processNode(record.get('n').properties));
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
    return this._processNode(result.records[0].get('n').properties);
  }

  async getNode(label, id) {
    const result = await this.query(
        `
        MATCH (n:${label} {id: $id})
        RETURN n
        `,
        { id }
    );
    return result.records[0] ? this._processNode(result.records[0].get('n').properties) : null;
  }

  async updateNode(label, id, properties) {
      const processedProps = this._stringifyComplexProps(properties);
      const result = await this.query(
          `
          MATCH (n:${label} {id: $id})
          SET n += $props,
              n.updatedAt = datetime().epochMillis
          RETURN n
          `,
          { id, props: processedProps }
      );
      
      if (!result.records[0]) {
          throw new Error(`${label} with id ${id} not found`);
      }
      
      return this._processNode(result.records[0].get('n').properties);
  }

  async deleteNode(label, id) {
    console.log(`Attempting to delete ${label} with id: ${id}`);
    

    const node = await this.getNode(label, id);
    
    if (!node) {
        throw new Error(`${label} with id ${id} not found`);
    }

    await this.query(
        `MATCH (n:${label} {id: $id}) DETACH DELETE n`,
        { id }
    );
    
    return node;
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
    return this.getNode('User', id);
  }

  async updateUser(id, properties) {
    return this.updateNode('User', id, properties);
  }

  async deleteUser(id) {
    return this.deleteNode('User', id);
  }

  // CRUD Operations for Ingredients
  async createIngredient(data) {
    return this.createNode('Ingredient', data);
  }

  async getIngredient(id) {
    return this.getNode('Ingredient', id);
  }

  async updateIngredient(id, data) {
    return this.updateNode('Ingredient', id, data);
  }

  async deleteIngredient(id) {
    return this.deleteNode('Ingredient', id);
  }

  // CRUD Operations for UserPrompts
  async createUserPrompt(data) {
    return this.createNode('UserPrompt', data);
  }

  async getUserPrompt(id) {
    return this.getNode('UserPrompt', id);
  }

  async updateUserPrompt(id, properties) {
    return this.updateNode('UserPrompt', id, properties);
  }

  async deleteUserPrompt(id) {
    return this.deleteNode('UserPrompt', id);
  }

  // CRUD Operations for AIResponses
  async createAIResponse(data) {
    return this.createNode('AIResponse', data);
  }

  async getAIResponse(id) {
    return this.getNode('AIResponse', id);
  }

  async updateAIResponse(id, properties) {
    return this.updateNode('AIResponse', id, properties);
  }

  async deleteAIResponse(id) {
    return this.deleteNode('AIResponse', id);
  }

  async createRecipe(data) {
    return this.createRecipeWithIngredientsAndInstructions(data);
  }

  async getRecipe(id) {
    const result = await this.query(
        `
        MATCH (r:Recipe {id: $id})
        OPTIONAL MATCH (r)-[rel:CONTAINS]->(i:Ingredient)
        OPTIONAL MATCH (ins:Instruction)-[:PART_OF]->(r)
        RETURN r,
               collect(DISTINCT {ingredient: i, relationship: rel}) as ingredients,
               collect(DISTINCT ins) as instructions
        `,
        { id }
    );

    if (!result.records[0]) {
        return null;
    }

    const recipe = this._processNode(result.records[0].get('r').properties);
    const ingredients = result.records[0].get('ingredients')
        .filter(i => i.ingredient)
        .map(i => ({
            ...this._processNode(i.ingredient.properties),
            value: i.relationship.properties.value,
            unit: i.relationship.properties.unit,
            comment: i.relationship.properties.comment
        }));
    const instructions = result.records[0].get('instructions')
        .map(i => this._processNode(i.properties));

    return {
        ...recipe,
        ingredients,
        instructions
    };
  }

  async updateRecipe(id, properties) {
    // First update the recipe node itself
    const updatedRecipe = await this.updateNode('Recipe', id, properties);
    
    // If there are ingredients or instructions to update, handle those
    if (properties.ingredients || properties.instructions) {
        const session = this.driver.session();
        try {
            await session.executeWrite(async tx => {
                if (properties.ingredients) {
                    // Delete existing relationships and create new ones
                    await tx.run('MATCH (r:Recipe {id: $id})-[rel:CONTAINS]->() DELETE rel', { id });
                    for (const ingredient of properties.ingredients) {
                        await tx.run(
                            `
                            MERGE (i:Ingredient {name: $name})
                            ON CREATE SET i.id = $ingId, i.createdAt = datetime().epochMillis
                            WITH i
                            MATCH (r:Recipe {id: $recipeId})
                            CREATE (r)-[rel:CONTAINS {
                                value: $value,
                                unit: $unit,
                                comment: $comment,
                                createdAt: datetime().epochMillis
                            }]->(i)
                            `,
                            {
                                name: ingredient.name,
                                ingId: `ingredient_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
                                recipeId: id,
                                value: ingredient.value,
                                unit: ingredient.unit,
                                comment: ingredient.comment
                            }
                        );
                    }
                }

                if (properties.instructions) {
                    // Delete existing instructions and create new ones
                    await tx.run('MATCH (i:Instruction)-[:PART_OF]->(r:Recipe {id: $id}) DETACH DELETE i', { id });
                    for (const instruction of properties.instructions) {
                        await tx.run(
                            `
                            MATCH (r:Recipe {id: $recipeId})
                            CREATE (i:Instruction {
                                id: $id,
                                part: $part,
                                steps: $steps,
                                createdAt: datetime().epochMillis
                            })-[:PART_OF]->(r)
                            `,
                            {
                                recipeId: id,
                                id: `instruction_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
                                part: instruction.part,
                                steps: instruction.steps
                            }
                        );
                    }
                }
            });
        } finally {
            await session.close();
        }
    }
    return this.getRecipe(id);
  }

  async deleteRecipe(id) {
    return this.deleteNode('Recipe', id);
  }

  // CRUD Operations for Instructions
  async createInstruction(data) {
    return this.createNode('Instruction', data);
  }

  async getInstruction(id) {
    return this.getNode('Instruction', id);
  }

  async updateInstruction(id, data) {
    return this.updateNode('Instruction', id, data);
  }

  async deleteInstruction(id) {
    return this.deleteNode('Instruction', id);
  }

  // CRUD Operations for RecipeIngredients
  async createRecipeIngredient(properties) {
    return this.createNode('RecipeIngredient', properties);
  }

  async getRecipeIngredient(id) {
    return this.getNode('RecipeIngredient', id);
  }

  async updateRecipeIngredient(id, properties) {
    return this.updateNode('RecipeIngredient', id, properties);
  }

  async deleteRecipeIngredient(id) {
    return this.deleteNode('RecipeIngredient', id);
  }

  // CRUD Operations for RecipeModifications
  async createRecipeModification(data) {
    return this.createNode('RecipeModification', data);
  }

  async getRecipeModification(id) {
    return this.getNode('RecipeModification', id);
  }

  async updateRecipeModification(id, properties) {
    return this.updateNode('RecipeModification', id, properties);
  }

  async deleteRecipeModification(id) {
    return this.deleteNode('RecipeModification', id);
  }

  // CRUD Operations for ModificationResponses
  async createModificationResponse(data) {
    return this.createNode('ModificationResponse', data);
  }

  async getModificationResponse(id) {
    return this.getNode('ModificationResponse', id);
  }

  async updateModificationResponse(id, properties) {
    return this.updateNode('ModificationResponse', id, properties);
  }

  async deleteModificationResponse(id) {
    return this.deleteNode('ModificationResponse', id);
  }

  // CRUD Operations for UserRecipes
  async createUserRecipe(properties) {
    return this.createNode('UserRecipe', properties);
  }

  async getUserRecipe(id) {
    return this.getNode('UserRecipe', id);
  }

  async updateUserRecipe(id, properties) {
    return this.updateNode('UserRecipe', id, properties);
  }

  async deleteUserRecipe(id) {
    return this.deleteNode('UserRecipe', id);
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
            return await tx.run(
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
        });

        
        const record = result.records[0];
        const recipe = this._processNode(record.get('r').properties);
        const ingredients = record.get('ingredients')
            .filter(i => i.ingredient)
            .map(i => ({
                ...this._processNode(i.ingredient.properties),
                value: i.relationship.properties.value,
                unit: i.relationship.properties.unit,
                comment: i.relationship.properties.comment
            }));
        const instructions = record.get('instructions')
            .map(i => this._processNode(i.properties));

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