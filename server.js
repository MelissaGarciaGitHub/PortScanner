const express = require('express');
const net = require('net');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: ['https://mgarcia46.domains.ggc.edu'] // Allow both domains
}));

  


app.use(express.json());

// Route for port scanning
app.post('/scan', (req, res) => {
    const { ip } = req.body; 
    const funport = [20, 21, 22, 23, 25, 53, 80, 137, 139, 443, 445, 1433, 1434, 3306, 3389, 8080, 8443]; 
    let scanResults = [];

    let portScans = funport.map(port => {
        return new Promise(resolve => {
            const socket = new net.Socket();
            const result = { port: port, status: 'closed' };

            socket.setTimeout(2000);
            socket.on('connect', () => {
                result.status = 'open';
                socket.destroy();
            });
            socket.on('error', () => {
                socket.destroy();
            });
            socket.on('timeout', () => {
                socket.destroy();
            });
            socket.on('close', () => {
                resolve(result);
            });

            socket.connect(port, ip);
        });
    });

    Promise.all(portScans).then(results => {
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
