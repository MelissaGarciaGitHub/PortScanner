const express = require('express');
const net = require('net');
const cors = require('cors');
const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'https://mgarcia46.domains.ggc.edu', 
  methods: ['POST'], 
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


app.post('/scan', (req, res) => {
    const { ip } = req.body;
    console.log('Recieved an IP address from PortVision:');
  
    const funport = [20, 21, 22, 23, 25, 53, 80, 137, 139, 443, 445, 1433, 1434, 3306, 3389, 8080, 8443];
    let portScans = funport.map(port => {
        return new Promise(resolve => {
            const socket = new net.Socket();
            let result = { port: port, status: 'closed' };

            socket.setTimeout(4000);
            socket.on('connect', () => {
                result.status = 'open!'; 
                socket.destroy();
            });
            socket.on('error', (err) => {
                if (err.code === 'ECONNREFUSED') {
                    result.status = 'timeout!'; 
                } 
                socket.destroy();
            });
            socket.on('timeout', () => {
                result.status = 'closed!'; 
                socket.destroy();
            });
            socket.on('close', () => {
                resolve(result); 
            });

            socket.connect({ port: port, host: ip });
        });
    });

    Promise.all(portScans).then(results => {
        res.json(results); 
    }).catch(error => {
        console.error('Error during scanning:', error);
        res.status(500).send('Error during scanning');
    });
});
   
app.use((req, res) =>{
  res.send('Welcome to our Port Scan Server: Melissa G & Jessica H! This is the backend for our Online Port Scanner!')
})
app.use((req, res) => {
  res.status(404).send('404 Not Found: The requested resource does not exist on this server.');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

