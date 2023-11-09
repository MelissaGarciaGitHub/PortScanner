const express = require('express');
const net = require('net');
const cors = require('cors');

const app = express();

app.use(express.json());
// Other code remains the same

const corsOptions = {
  origin: 'https://mgarcia46.domains.ggc.edu/', // Replace with your website's origin
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); // Use the CORS middleware with the specified options

// The rest of the code remains the same


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
