import "dotenv/config";
import { specs, swaggerUi, swaggerOptions } from "./swagger.js";
import { MySQLService } from "./prisma/services/mysqlService.js";
//import { Neo4jService } from "./neo4j/neo4jservice.js";
import { MongoService } from "./mongoDB/mongoService.js";
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import express from "express";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
app.use(express.json());

app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
});

app.use('/docs', swaggerUi.serve);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});


const services = {
    mongodb: MongoService,
    mysql: new MySQLService(),
    //neo4j: new Neo4jService()
};

app.use((req, res, next) => {
    if (req.path.startsWith('/neo4j/') || 
        req.path.startsWith('/mongodb/') || 
        req.path.startsWith('/mysql/')) {
      return next();
    }
    next();
  });


// Middleware to validate database type
const validateDbType = (req, res, next) => {
    const dbType = req.params.dbType.toLowerCase();
    if (!['mongodb', 'mysql'].includes(dbType)) {
        return res.status(400).json({ error: 'Invalid database type. Use mongodb or mysql' });
    }
    req.dbService = services[dbType];
    req.dbType = dbType;
    next();
};


const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);


/**
 * @swagger
 * components:
 *   parameters:
 *     dbType:
 *       in: path
 *       name: dbType
 *       required: true
 *       schema:
 *         type: string
 *         enum: [mysql, mongodb]
 *       description: Database type to query (mysql or mongodb)
 *     modelId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: ID of the model
 *   schemas:
 *     Recipe:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /{dbType}/{model}:
 *   get:
 *     summary: Get all items from specified database
 *     tags: [Dynamic Routes]
 *     parameters:
 *       - $ref: '#/components/parameters/dbType'
 *       - name: model
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Model name (e.g., recipes, users)
 *     responses:
 *       200:
 *         description: List of items
 *       400:
 *         description: Invalid database type
 */
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
//            case "neo4j":
//                result = await services.neo4j.getAll(model)
//                console.log(result)
//                res.status(200).json(result)
//                break;
            default:
                console.log("Wrong db format: ", dbType)
                res.status(400).send("Wrong db format", dbType)
                break;
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /{dbType}/{model}:
 *   post:
 *     summary: Create new item in specified database
 *     tags: [Dynamic Routes]
 *     parameters:
 *       - $ref: '#/components/parameters/dbType'
 *       - name: model
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Created item
 *       400:
 *         description: Invalid request
 */
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
//            case "neo4j":
//                result = await services.neo4j.getAll(model)
//                console.log(result)
//                res.status(200).json(result)
//                break;
            default:
                console.log("Wrong db format: ", dbType)
                res.status(400).send("Wrong db format", dbType)
                break;
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**
 * @swagger
 * /{dbType}/{model}/{id}:
 *   get:
 *     summary: Get single item by ID
 *     tags: [Dynamic Routes]
 *     parameters:
 *       - $ref: '#/components/parameters/dbType'
 *       - name: model
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - $ref: '#/components/parameters/modelId'
 *     responses:
 *       200:
 *         description: Single item
 *       404:
 *         description: Item not found
 */
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
//        } else if (dbType === 'neo4j') {
//            result = await req.dbService[`get${capitalize(model)}`](id);
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


/**
 * @swagger
 * /{dbType}/{model}/{id}:
 *   put:
 *     summary: Update item by ID
 *     tags: [Dynamic Routes]
 *     parameters:
 *       - $ref: '#/components/parameters/dbType'
 *       - name: model
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - $ref: '#/components/parameters/modelId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated item
 *       404:
 *         description: Item not found
 */
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


/**
 * @swagger
 * /{dbType}/{model}/{id}:
 *   delete:
 *     summary: Delete item by ID
 *     tags: [Dynamic Routes]
 *     parameters:
 *       - $ref: '#/components/parameters/dbType'
 *       - name: model
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - $ref: '#/components/parameters/modelId'
 *     responses:
 *       204:
 *         description: Item deleted
 *       404:
 *         description: Item not found
 */
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


/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 env:
 *                   type: string
 */
app.get('/health', async (req, res) => {
    try {
        res.json({
            status: 'ok',
            timestamp: new Date(),
            env: process.env.NODE_ENV
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
