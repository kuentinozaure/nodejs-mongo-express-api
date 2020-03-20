const fs = require('fs');
const http = require('http');
const pug = require('pug');


const port = process.argv[2]
const filename = process.argv[3];


if (!port) {
    console.error('Please provide a port number')
    process.exit(1);
}

if (!filename) {
    console.error('Please provide a filename');
    process.exit(1);
}

const compiledFunction = pug.compileFile('template.pug');



const server = http.createServer(
    (req, res) => {

        fs.readFile(filename,'utf8', (err,data) => {
            if (err) {
                console.log(err);
                return ;
            }
            const generatedTemplate = compiledFunction({
                name: 'ca',
                utilisateurs: JSON.parse(data)
            })
    
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(generatedTemplate)
        });
    }
);

server.listen(port, () => {
    console.log(`➡️  your server is running on port ${port}`)
})


