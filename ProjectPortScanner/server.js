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

// Define the /scan POST route
// ... [rest of your code]

app.post('/scan', (req, res) => {
    const { ip } = req.body;
    console.log('Received IP for scanning:', ip);
  
    const funport = [20, 21, 22, 23, 25, 53, 80, 137, 139, 443, 445, 1433, 1434, 3306, 3389, 8080, 8443];
    let portScans = funport.map(port => {
        return new Promise((resolve, reject) => {
            const socket = new net.Socket();
            const result = { port: port, status: 'closed' };

            socket.setTimeout(5000); // Increased timeout
            socket.on('connect', () => {
                result.status = 'open';
                socket.destroy();
                resolve(result);
            });
            socket.on('error', (err) => {
                console.log(`Error on port ${port}: ${err.message}`); // Log error message
                socket.destroy();
                resolve(result); // Still resolve the result, as we know the port is closed
            });
            socket.on('timeout', () => {
                console.log(`Timeout on port ${port}`); // Log timeout
                socket.destroy();
                resolve(result);
            });
            socket.on('close', () => {
                resolve(result);
            });

            socket.connect({ port: port, host: ip });
        });
    });

    Promise.all(portScans).then(results => {
        console.log('Scan results:', results); // Log the results
        res.json(results);
    }).catch(error => {
        console.error('Error during scanning:', error);
        res.status(500).send('Error during scanning');
    });
});

// ... [rest of your code]
 
app.use((req, res) =>{
  res.send('Welcome to Port Scan Server By Melissa and Jessica!')
})
app.use((req, res) => {
  res.status(404).send('404 Not Found: The requested resource does not exist on this server.');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


