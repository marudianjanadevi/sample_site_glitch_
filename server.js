const fastify = require('fastify')({ logger: true });

// In-memory storage for names
let names = [];

// Serve the HTML form page
fastify.get('/', async (request, reply) => {
    reply.type('text/html').send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Name Submission</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    text-align: center;
                    background: #f4f4f4;
                }
                form {
                    margin-bottom: 20px;
                }
                input, button {
                    padding: 10px;
                    font-size: 16px;
                    margin: 5px;
                }
                ul {
                    list-style: none;
                    padding: 0;
                }
                li {
                    background: #fff;
                    padding: 10px;
                    margin: 5px 0;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <h1>Name Submission Form</h1>
            <form id="nameForm">
                <input type="text" id="nameInput" placeholder="Enter your name" required>
                <button type="submit">Submit</button>
            </form>
            <h2>Submitted Names</h2>
            <ul id="nameList"></ul>

            <script>
                document.getElementById('nameForm').addEventListener('submit', async function(event) {
                    event.preventDefault();
                    const nameInput = document.getElementById('nameInput');
                    
                    if (nameInput.value.trim() === '') {
                        alert('Please enter a valid name');
                        return;
                    }

                    const response = await fetch('/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: nameInput.value })
                    });

                    if (response.ok) {
                        nameInput.value = '';
                        fetchNames();
                    } else {
                        alert('Failed to submit name');
                    }
                });

                async function fetchNames() {
                    const response = await fetch('/names');
                    const names = await response.json();
                    const nameList = document.getElementById('nameList');
                    nameList.innerHTML = names.map(name => \`<li>\${name}</li>\`).join('');
                }

                // Load names when the page loads
                fetchNames();
            </script>
        </body>
        </html>
    `);
});

// POST route to add a name
fastify.post('/submit', async (request, reply) => {
    const { name } = request.body;
    if (!name) {
        return reply.status(400).send({ error: "Name is required" });
    }
    names.push(name);
    reply.send({ success: true, message: "Name added successfully!" });
});

// GET route to fetch all names
fastify.get('/names', async (request, reply) => {
    reply.send(names);
});

// Start the server
const start = async () => {
    try {
        await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
        console.log('Server running at http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
