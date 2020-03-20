const fs = require('fs');

const filename = process.argv[2];

if (!filename) {
    console.error('Please provide a filename');
    process.exit(1);
}

fs.readFile(filename,'utf8', (err,data) => {
    if (err) {
        console.log(err);
        return ;
    }
    console.log(data);
})