import "dotenv/config";

import { MySQLService } from "./prisma/services/mysqlService.js";
import { Neo4jService } from "./neo4j/neo4jservice.js";
import { MongoService } from "./mongoDB/mongoService.js";

import mongoose from "mongoose";
import express from "express";
const app = express();

app.use(express.json());

const services = {
    mongodb: MongoService,
    mysql: new MySQLService(),
    neo4j: new Neo4jService()
};

// Middleware to validate database type
const validateDbType = (req, res, next) => {
    const dbType = req.params.dbType.toLowerCase();
    if (!services[dbType]) {
        return res.status(400).json({ error: 'Invalid database type. Use mongodb, mysql, or neo4j' });
    }
    req.dbService = services[dbType];
    next();
};

app.post('/:dbType/:model', validateDbType, async (req, res) => {
    const { model } = req.params;
    console.log(`Calling method: create${capitalize(model)}`);
    console.log(`Database type: ${dbType}\nModel: ${model}\nID: ${id}`);

    try {
        const result = await req.dbService[`create${capitalize(model)}`](req.body);
        console.log(result);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/:dbType/:model/:id', validateDbType, async (req, res) => {
    const { dbType, model, id } = req.params;
    console.log(`Calling method: get${capitalize(model)}`);
    console.log(`Database type: ${dbType}\nModel: ${model}\nID: ${id}`);
    try {
        let result;
        if (dbType === 'mongodb') {
            // Convert id to ObjectId for MongoDB
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid ID format. ID must be a valid ObjectId.' });
            } 
            result = await req.dbService[`get${capitalize(model)}`](new mongoose.Types.ObjectId(id));
        } else if (dbType === 'neo4j') {
            // Use the id directly for Neo4j
            result = await req.dbService[`get${capitalize(model)}`](id);
        } else {
            // Convert id to an integer for other databases
            const numericId = parseInt(id, 10);
            if (isNaN(numericId)) {
                return res.status(400).json({ error: 'Invalid ID format. ID must be a number.' });
            }
            result = await req.dbService[`get${capitalize(model)}`](numericId);
        }

        if (result) {
            res.json(result);
        } else {
            console.log(`${capitalize(model)} not found`);
            res.status(404).json({ error: `${capitalize(model)} not found` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/:dbType/:model/:id', validateDbType, async (req, res) => {
    const { model, id } = req.params;
    console.log(`Calling method: update${capitalize(model)}`);
    console.log(`Database type: ${dbType}\nModel: ${model}\nID: ${id}`);
    try {
        const result = await req.dbService[`update${capitalize(model)}`](id, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/:dbType/:model/:id', validateDbType, async (req, res) => {
    const { model, id } = req.params;
    console.log(`Calling method: delete${capitalize(model)}`);
    console.log(`Database type: ${dbType}\nModel: ${model}\nID: ${id}`);
    try {
        await req.dbService[`delete${capitalize(model)}`](id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper function to capitalize model names
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});