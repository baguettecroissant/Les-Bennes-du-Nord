const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/'/g, '-')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function fetchCommunes() {
  const url = 'https://geo.api.gouv.fr/departements/59/communes?fields=nom,code,population,codesPostaux';
  
  console.log('Fetching communes from Geo API...');
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    console.log(`Fetched ${data.length} communes.`);
    
    const formatted = data
      .filter(c => c.population && c.population >= 200)
      .map(c => {
        return {
          nom: c.nom,
          slug: slugify(c.nom),
          codeInsee: c.code,
          codePostal: c.codesPostaux && c.codesPostaux.length > 0 ? c.codesPostaux[0] : '',
          population: c.population
        };
      })
      .sort((a, b) => b.population - a.population);
      
    const dataDir = path.join(__dirname, '../src/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const outputPath = path.join(dataDir, 'communes.json');
    fs.writeFileSync(outputPath, JSON.stringify(formatted, null, 2));
    console.log(`Successfully wrote ${formatted.length} communes to ${outputPath}`);
  } catch (error) {
    console.error('Error fetching or saving communes:', error);
  }
}

fetchCommunes();
