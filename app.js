const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        // This is non-blocking code because it immediately sends a response to the client without waiting for any I/O operations.
        res.write('<html>');
        res.write('<head><title>Enter Message</title><head>');
        res.write(
        '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
        );
        res.write('</html>');
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        const body = [];
        // Non-blocking: Data event does not block the server from handling other requests.
        req.on('data', chunk => {
            console.log(chunk);
            body.push(chunk);
        });
        // Non-blocking: The end event waits for all chunks to be received, then processes them.
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            // Non-blocking: writeFile is asynchronous, allowing Node.js to handle other tasks while the file is being written.
            fs.writeFile('message.txt', message, err => {
                if (err) {
                    console.log(err);
                    return err;
                }
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
    // This is non-blocking code because it immediately sends a response to the client without waiting for any I/O operations.
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title><head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
// The server.listen call is non-blocking; it starts the server and immediately returns, allowing Node.js to continue processing.