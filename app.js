import "dotenv/config";

import { MySQLService } from "./prisma/services/mysqlService.js";
import { Neo4jService } from "./neo4j/neo4jservice.js";
import { MongoService } from "./mongoDB/mongoService.js";
import cors from 'cors';

import mongoose from "mongoose";
import express from "express";
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
app.use(express.json());

app.use((req, res, next) => {
    if (req.path.startsWith('/neo4j/') || 
        req.path.startsWith('/mongodb/') || 
        req.path.startsWith('/mysql/')) {
      return next();
    }
    next();
  });

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
    req.dbType = dbType;
    next();
};

// Helper function to capitalize model names
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

app.get('/:dbType/:model', validateDbType, async (req, res) => {
    const { dbType, model } = req.params;
    console.log(`Calling method: get${capitalize(model)}`);
    console.log(`Database type: ${dbType}\nModel: ${model}`);

    try {
        let result;
        switch (dbType) {
            case "mysql":
                result = await services.mysql.getAll(model)
                console.log(result)
                res.status(200).json(result);
                break;
            case "mongodb":
                result = await services.mongodb.getAll(model)
                console.log(result)
                res.status(200).json(result)
                break;
            case "neo4j":
                result = await services.neo4j.getAll(model)
                console.log(result)
                res.status(200).json(result)
                break;
            default:
                console.log("Wrong db format: ", dbType)
                res.status(400).send("Wrong db format", dbType)
                break;
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/:dbType/:model', validateDbType, async (req, res) => {
    const { dbType, model } = req.params;
    const data = req.body;
    console.log(`Calling method: create${capitalize(model)}`);
    console.log(`Database type: ${dbType}\nModel: ${model}`);

    try {
        let result;
        switch (dbType) {
            case "mysql":
                result = await services.mysql.createMethod(model, data)
                console.log(result)
                res.status(200).json(result);
                break;
            case "mongodb":
                result = await services.mongodb.getAll(model)
                console.log(result)
                res.status(200).json(result)
                break;
            case "neo4j":
                result = await services.neo4j.getAll(model)
                console.log(result)
                res.status(200).json(result)
                break;
            default:
                console.log("Wrong db format: ", dbType)
                res.status(400).send("Wrong db format", dbType)
                break;
        }
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
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid ID format. ID must be a valid ObjectId.' });
            }
            result = await req.dbService[`get${capitalize(model)}`](new mongoose.Types.ObjectId(id));
        } else if (dbType === 'neo4j') {
            result = await req.dbService[`get${capitalize(model)}`](id);
        } else {
            const numericId = parseInt(id, 10);
            if (isNaN(numericId)) {
                return res.status(400).json({ error: 'Invalid ID format. ID must be a number.' });
            }
            result = await req.dbService[`get${capitalize(model)}`](numericId);
        }

        if (result) {
            console.log(`${capitalize(model)} found: ${JSON.stringify(result)}`);
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
    const { dbType, model, id } = req.params;
    console.log(`Calling method: update${capitalize(model)}`);
    console.log(`Database type: ${dbType}\nModel: ${model}\nID: ${id}`);

    try {
        if (dbType === 'mongodb' && !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format. ID must be a valid ObjectId.' });
        }

        const result = await req.dbService[`update${capitalize(model)}`](id, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/:dbType/:model/:id', validateDbType, async (req, res) => {
    const { dbType, model, id } = req.params;
    console.log(`Calling method: delete${capitalize(model)}`);
    console.log(`Database type: ${dbType}\nModel: ${model}\nID: ${id}`);

    try {
        if (dbType === 'mongodb' && !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format. ID must be a valid ObjectId.' });
        }

        await req.dbService[`delete${capitalize(model)}`](id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
