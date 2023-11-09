const express = require('express');
const net = require('net');
const cors = require('cors');

const app = express();

app.use(express.json());

// Set up CORS to allow your client domain
const corsOptions = {
  origin: 'https://mgarcia46.domains.ggc.edu.com', // Replace with your actual client domain
  methods: ['POST'], // Allow only POST for /scan endpoint
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Enable CORS with the specified options

// Define the /scan POST route
app.post('/scan', (req, res) => {
    const { ip } = req.body; // Extract the IP address from the request body
   console.log('Received IP:', ip);
  
 const funport = [20, 21, 22, 23, 25, 53, 80, 137, 139, 443, 445, 1433, 1434, 3306, 3389, 8080, 8443];
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

            socket.connect({ port: port, host: ip }); // Ensure to connect using host and port
        });
    });

    Promise.all(portScans).then(results => {
        console.log(results)
        res.json(results); // Respond with the results as JSON
    }).catch(error => {
        res.status(500).send('Error during scanning');
    });
});

   
app.use((req, res) =>{
  res.send('Welcome to Port Scan Server!')
})
app.use((req, res) => {
  res.status(404).send('404 Not Found: The requested resource does not exist on this server.');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


