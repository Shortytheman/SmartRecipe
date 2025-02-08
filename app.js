

import express from "express";
const app = express();

app.use(express.json());

const services = {
    mongodb: new MongoService(),
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

// CRUD routes
app.post('/:dbType', validateDbType, async (req, res) => {
    try {
        const result = await req.dbService.create(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/:dbType/:id', validateDbType, async (req, res) => {
    try {
        const result = await req.dbService.read(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/:dbType/:id', validateDbType, async (req, res) => {
    try {
        const result = await req.dbService.update(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/:dbType/:id', validateDbType, async (req, res) => {
    try {
        const result = await req.dbService.delete(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});