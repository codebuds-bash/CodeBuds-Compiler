import 'dotenv/config'; // Load environment variables
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Define a root route
app.get('/', (req, res) => {
    res.send('Welcome to the Online Compiler API!'); // Respond with a message
});

// Endpoint to execute code
app.post('/execute', async (req, res) => {
    const { code, language } = req.body;

    // Validate input
    if (!code || !language) {
        return res.status(400).json({ error: "Code and language are required." });
    }

    // Set appropriate JDoodle language and version index
    let versionIndex;
    switch (language) {
        case 'python3':
            versionIndex = '3'; // Python 3
            break;
        case 'javascript':
            versionIndex = '0'; // JavaScript
            break;
        case 'c_cpp':
            versionIndex = '4'; // C++ version index (change as necessary based on JDoodle's version index)
            break;
        default:
            return res.status(400).json({ error: "Unsupported language." });
    }

    const payload = {
        script: code,
        language: language,
        versionIndex: versionIndex,
        clientId: process.env.JDoodle_CLIENT_ID, // Use environment variable
        clientSecret: process.env.JDoodle_CLIENT_SECRET // Use environment variable
    };

    try {
        const response = await fetch("https://api.jdoodle.com/v1/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        // Check if the response is OK
        if (!response.ok) {
            const errorDetails = await response.json();
            return res.status(response.status).json({ error: errorDetails });
        }

        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error("Error executing code:", error);
        res.status(500).json({ error: "An error occurred while executing code." });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
