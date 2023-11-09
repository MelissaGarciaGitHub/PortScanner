const express = require('express');
const net = require('net');
const cors = require('cors');

const app = express();

app.use(express.json());

// Set up CORS to allow your client domain
const corsOptions = {
  origin: 'https://mgarcia46.domains.ggc.edu', // Replace with your actual client domain
  methods: ['POST'], // Allow only POST for /scan endpoint
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Enable CORS with the specified options

// ... [rest of your code] ...

app.post('/scan', (req, res) => {
    const { ip } = req.body;
    console.log('Received IP:', ip);
  
    const funport = [20, 21, 22, 23, 25, 53, 80, 137, 139, 443, 445, 1433, 1434, 3306, 3389, 8080, 8443];
    let portScans = funport.map(port => {
        return new Promise(resolve => {
            const socket = new net.Socket();
            let result = { port: port, status: 'CLOSED' };

            socket.setTimeout(4000);
            socket.on('connect', () => {
                result.status = 'OPEN'; // Set status to 'open' on connection
                socket.destroy();
            });
            socket.on('error', (err) => {
                if (err.code === 'ECONNREFUSED') {
                    result.status = 'CLOSED'; // Set status to 'closed' if connection is refused
                } // You can choose to handle other types of errors differently
                socket.destroy();
            });
            socket.on('timeout', () => {
                result.status = 'Timeout'; // Set status to 'timeout' on timeout
                socket.destroy();
            });
            socket.on('close', () => {
                resolve(result); // Resolve the promise with the result
            });

            socket.connect({ port: port, host: ip });
        });
    });

    Promise.all(portScans).then(results => {
        console.log(results); // Log the results for debugging
        res.json(results); // Send the results back to the client
    }).catch(error => {
        console.error('Error during scanning:', error);
        res.status(500).send('Error during scanning');
    });
});
   
app.use((req, res) =>{
  res.send('Welcome to Port Scan Server: Melisa G & Jessica H!')
})
app.use((req, res) => {
  res.status(404).send('404 Not Found: The requested resource does not exist on this server.');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

