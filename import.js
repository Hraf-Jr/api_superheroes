const fs = require('fs');
const db = require('./database'); // Assure-toi d'avoir database.js dans le même dossier

// Lecture et parsing du fichier JSON
const data = JSON.parse(fs.readFileSync('./SuperHerosComplet.json', 'utf-8')).superheros;

// Préparation de la requête SQL d'insertion
const insert = db.prepare(`
  INSERT INTO heroes (name, publisher, gender, race, power, alignment, height_cm, weight_kg, createdAt)
  VALUES (@name, @publisher, @gender, @race, @power, @alignment, @height_cm, @weight_kg, @createdAt)
`);

// Vérifie si la table est vide
const count = db.prepare('SELECT COUNT(*) as total FROM heroes').get();

if (count.total === 0) {
    const now = new Date().toISOString();

    for (const hero of data) {
        insert.run({
            name: hero.name,
            publisher: hero.biography?.publisher ?? 'Unknown',
            gender: hero.appearance?.gender ?? 'Unknown',
            race: hero.appearance?.race ?? 'Unknown',
            power: JSON.stringify(hero.powerstats),
            alignment: hero.biography?.alignment ?? 'Unknown',
            height_cm: parseInt(hero.appearance?.height?.[1]) || null,
            weight_kg: parseInt(hero.appearance?.weight?.[1]) || null,
            createdAt: now
        });
    }

    console.log('Données initiales importées.');
} else {
    console.log('Données déjà présentes. Import ignoré.');
}
