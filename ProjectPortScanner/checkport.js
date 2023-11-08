function scanPort() {
    const userIP = document.getElementById("ip").value;
    const results = document.getElementById("results");
    results.innerHTML = "<p>Scanning...</p>";

    fetch('http://localhost:3000/scan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ipAddress: userIP }), 
    })
    .then(response => response.json())
    .then(data => {
        results.innerHTML = data.map(result => `
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 5px; border-radius: 5px;">
                Port ${result.port} is <strong>${result.status}</strong>
            </div>
        `).join('');
    })
    
    
    .catch(error => {
        results.innerHTML = `<p>Error during scanning: ${error}</p>`;
    });
}
