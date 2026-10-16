const http = require('http');
const fs = require('fs')


const server = http.createServer((req, res) => {



    if (req.url === '/') {
        let str;
        fs.readFile(`chat.txt`, (err, data) => {

            const string = data.toString();
            str = string.split(' ').join('+');
            console.log(str)

            res.setHeader('Content-type', 'text/html');
            res.end(`

            <p> ${str} </P>

            <form action="/message" method="POST">
                <input type="text" name="msg"> </input>
                <button type="submit">Submit</button>
            </form>`
            )
        })


    }
    else if (req.url === '/message') {
        res.setHeader('Content-type', 'text/html');

        let dataChunks = [];
        req.on('data', (chunks) => {
            dataChunks.push(chunks);
        })

        req.on("end", () => {
            let combinedBuffer = Buffer.concat(dataChunks);
            let value = combinedBuffer.toString().split("=");
            const formValues = value[1];
            console.log(formValues);

            fs.writeFile(`chat.txt`, formValues, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                res.end();
            })
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