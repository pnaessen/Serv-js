const { argv } = require('process')
const path = require('path');
const fs = require('fs');

async function readFileContent(filename) {
  try {
    return await fs.promises.readFile(filename, 'utf8');
  } catch (err) {
    console.error(`Erreur lecture ${filename}:`, err.message);
    return null;
  }
}

async function listProjectFiles() {
	try {
		return await fs.promises.readdir('.');
	} catch (err) {
		console.error('Erreur list', err.message);
		return null;
	}
}

module.exports = {
	readFileContent,
	listProjectFiles
};