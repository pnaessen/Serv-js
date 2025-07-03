const http = require('http');
const fs = require('fs');
const path = require('path');
const { readFileContent, listProjectFiles } = require('./file_utils');


const server = http.createServer(async (req, res) => {
	console.log(`Req: ${req.method} ${req.url}`)
	try {
		if (req.url === '/files') {
			const files = await listProjectFiles();
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify(files));	
		} 

		else if (req.url.startsWith('/file/')) {
		const filename = req.url.replace('/file/', '');
		const safePath = path.resolve('.', filename);
  	const projectDir = path.resolve('.');
 			 if (!safePath.startsWith(projectDir + path.sep)) {
					res.writeHead(403);
					res.end('Accès interdit - tentative  detectee');
					return;
  }

			try {
				await fs.promises.access(filename);
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				const stream = fs.createReadStream(filename);
				stream.pipe(res);	
			} catch (err) {
					res.writeHead(404);
					res.end('Fichier non trouvee');
			}
		}

		else {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end('<h1>Serveur Node.js</h1><a href="/files">Voir les fichiers</a>');
		}
	} catch (err) {
		console.error('Erreur serveur:', err);
		res.writeHead(500);
		res.end('Erreur interne');
	}
});

const port = process.argv[2] || 3000;
const host = process.argv[3] || 'localhost';

server.listen(port, host, () => {
	console.log(`Serveur sur http://${host}:${port}`);
	console.log('Routes disponibles:');
	console.log('- GET / (accueil)');
	console.log('- GET /files (liste des fichiers)');
	console.log('- GET /file/<nom> (contenu d\'un fichier)');
});