const express = require('express');
const db = require('./database');
const { stringify } = require('csv-stringify/sync');
const app = express();
const PORT = 3000;

app.use(express.json());

// GET /heroes – tous les héros
app.get('/heroes', (req, res) => {
    const heroes = db.prepare('SELECT * FROM heroes').all();
    res.json(heroes);
});



// GET /heroes/search?q=bat – recherche par nom avec LIKE
app.get('/heroes/search', (req, res) => {
    const q = `%${req.query.q ?? ''}%`;
    const results = db.prepare('SELECT * FROM heroes WHERE name LIKE ?').all(q);
    res.json(results);
});

//  GET /heroes – tous les héros, option de filtrage par éditeur
app.get('/heroes', (req, res) => {
    const publisher = req.query.publisher;
    if (publisher) {
        const results = db
            .prepare('SELECT * FROM heroes WHERE publisher = ?')
            .all(publisher);
        return res.json(results);
    }
    const heroes = db.prepare('SELECT * FROM heroes').all();
    res.json(heroes);
});

// GET /heroes/sorted?by=height – tri dynamique
app.get('/heroes/sorted', (req, res) => {
    const validFields = ['height_cm', 'weight_kg', 'name'];
    const sortParams = req.query.by?.split(',') ?? [];

    if (sortParams.length === 0 || !sortParams.every(f => validFields.includes(f))) {
        return res.status(422).json({ message: 'Champ(s) de tri invalide(s)' });
    }

    const orderClause = sortParams.map(f => `${f} ASC`).join(', ');
    const sorted = db.prepare(`SELECT * FROM heroes ORDER BY ${orderClause}`).all();
    res.json(sorted);
});



// POST /heroes – ajout d’un héros
app.post('/heroes', (req, res) => {
    const { name, publisher, height_cm, weight_kg } = req.body;

    if (!name || !publisher || height_cm == null || weight_kg == null) {
        return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }

    const createdAt = new Date().toISOString();
    const stmt = db.prepare(`
        INSERT INTO heroes (name, publisher, gender, race, power, alignment, height_cm, weight_kg, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
        name, publisher, req.body.gender, req.body.race, req.body.power,
        req.body.alignment, height_cm, weight_kg, createdAt
    );

    res.status(201).json({ message: 'Héros ajouté', id: result.lastInsertRowid });
});


// DELETE /heroes/:id – suppression
app.delete('/heroes/:id', (req, res) => {
    const result = db.prepare('DELETE FROM heroes WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ message: 'Héros non trouvé' });
    res.json({ message: 'Héros supprimé' });
});

app.get('/heroes/export', (req, res) => {
    const publisher = req.query.publisher;
    if (!publisher) {
        return res.status(400).json({ message: 'Paramètre publisher requis' });
    }

    const rows = db.prepare('SELECT * FROM heroes WHERE publisher = ?').all(publisher);

    if (rows.length === 0) {
        return res.status(404).json({ message: 'Aucun héros trouvé pour cet éditeur' });
    }

    const csv = stringify(rows, { header: true });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="export-${publisher}.csv"`);
    res.send(csv);
});

app.get('/heroes/stats', (req, res) => {
    const stats = db.prepare(`
        SELECT 
            publisher,
            COUNT(*) AS total,
            ROUND(AVG(height_cm), 2) AS avg_height,
            ROUND(AVG(weight_kg), 2) AS avg_weight
        FROM heroes
        WHERE height_cm IS NOT NULL AND weight_kg IS NOT NULL
        GROUP BY publisher
    `).all();

    res.json(stats);
});


// GET /heroes/:id – un héros par ID
app.get('/heroes/:id', (req, res) => {
    const hero = db.prepare('SELECT * FROM heroes WHERE id = ?').get(req.params.id);
    if (!hero) return res.status(404).json({ message: 'Héros non trouvé' });
    res.json(hero);
});






// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
