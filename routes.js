const fs = require('fs');

const requestHandler = (req, res) => {
    const { url, method } = req;
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html')
        res.write('<html>');
        res.write('<head><title>My First bad page</title></head>')
        res.write('<body>');
        res.write('<form action="/message" method="POST"><input type="text" name="message" /><button type="submit">Submit</button></form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }

    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();
            const message = parseBody.split('=')[1];
            fs.writeFile('message.txt', message, err => {
                res.statusCode = 302;
                res.setHeader('Location', '/')
                return res.end(); F
            });
        });
    }

    res.setHeader('Content-Type', 'text/html');
    res.write('<h1>Hello from Node.js</h1>');
    res.end();
}

module.exports = requestHandler;