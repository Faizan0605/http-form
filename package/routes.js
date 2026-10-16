const fs = require('fs')


function requestHandler(req, res) {

    if (req.url === '/') {
        fs.readFile(`chat.txt`, (err, data) => {
            let str = "No messages yet";

            if (!err && data.length > 0) {
                const stri = data.toString();
                str = stri.split(' ').join('+');
                console.log(str);
            }

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
}

module.exports = requestHandler;