const http = require('http');
const { readFileContent, listProjectFiles } = require('./file_utils');


const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/files') {
      const files = await listProjectFiles();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(files));
      
    } else if (req.url.startsWith('/file/')) {
      const filename = req.url.replace('/file/', '');
      const content = await readFileContent(filename);
      
      if (content) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(content);
      } else {
        res.writeHead(404);
        res.end('Fichier non trouve');
      }
      
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>Serveur Node.js</h1><a href="/files">Voir les fichiers</a>');
    }
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.writeHead(500);
    res.end('Erreur interne');
  }
});

server.listen(3000, () => {
  console.log('Serveur sur http://localhost:3000');
});