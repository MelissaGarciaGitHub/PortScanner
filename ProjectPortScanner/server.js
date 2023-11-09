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

// New asynchronous function to scan ports with delay
async function scanPorts(ip, ports) {
  const scanResults = [];

  for (const port of ports) {
    const result = await scanPort(ip, port);
    scanResults.push(result);
    await delay(100); // Wait for 100 ms between each scan
  }

  return scanResults;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scanPort(ip, port) {
  return new Promise(resolve => {
    const socket = new net.Socket();
    const result = { port: port, status: 'closed' };

    socket.setTimeout(10000); // Increased timeout
    socket.on('connect', () => {
      result.status = 'open';
      socket.end();
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

    socket.connect({ port: port, host: ip });
  });
}

// New /scan route using the asynchronous scan
app.post('/scan', async (req, res) => {
  const { ip } = req.body;
  const funport = [20, 21, 22, 23, 25, 53, 80, 137, 139, 443, 445, 1433, 1434, 3306, 3389, 8080, 8443];
  
  try {
    const results = await scanPorts(ip, funport);
    res.json(results);
  } catch (error) {
    res.status(500).send('Error during scanning');
  }
});

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to Port Scan Server!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('404 Not Found: The requested resource does not exist on this server.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
