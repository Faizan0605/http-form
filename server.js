const http = require('http');
const fs = require('fs')


const server = http.createServer((req, res) => {

    const method = req.method;

    if (req.url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.end("<h1>Home</h1>");
    }
    else if (req.url === '/form') {
        res.setHeader('Content-type', 'text/html');
        res.end(`
            <form action="/message" method="POST">
                <label>Name:</label>
                <input type="text" name="username"> </input>
                <button type="submit">Submit</button>
            </form>`
        )
    }
    else if (req.url === '/message') {
        res.setHeader('Content-type', 'text/html');

        let dataChunks = [];
        req.on('data', (chunks) => {
            console.log(chunks);
            dataChunks.push(chunks);
        })

        req.on("end", () => {
            let combinedBuffer = Buffer.concat(dataChunks);
            // console.log(combinedBuffer.toString());
            let value = combinedBuffer.toString().split("=");
            // console.log(value);
            const formValues = value[1];

            fs.writeFile(`formValues.txt`, formValues, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                res.end();
            })
        })
    } else if (req.url === '/read') {
        fs.readFile(`formValues.txt`, (err, data) => {
            if (err) {
                res.statusCode = 404;
                return res.end("<h1>No data found. Submit the form first!</h1>");
            }
            res.end(`<h1>${data.toString()}</h1>`)
        })
    }

    else {
        res.statusCode = 404;
        res.end("<h1>404 Not Found</h1>");
    }
});


server.listen(3222, () => {
    console.log("server is running");
})