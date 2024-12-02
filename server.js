const express = require("express");
const bodyParser = require("body-parser");
const xml2js = require("xml2js");

const app = express();
const port = 3000;

// Middleware to parse XML requests
app.use(bodyParser.text({ type: "application/xml" }));

// Endpoint to handle eSign responses
app.post("/api/eSignResponse", async (req, res) => {
    try {
        const xmlResponse = req.body;

        // Parse the XML response
        const jsonResponse = await parseXML(xmlResponse);

        console.log("Received XML Response:", xmlResponse);
        console.log("Parsed JSON Response:", jsonResponse);

        // Extract data from the response
        const status = jsonResponse.ESignResponse?.Status?.[0];
        const errorMessage = jsonResponse.ESignResponse?.ErrorMessage?.[0];

        if (status === "1") {
            console.log("eSign was successful");
        } else {
            console.log("eSign failed:", errorMessage || "Unknown error");
        }

        // Send success response back to ESP
        res.status(200).send("Response processed successfully");
    } catch (error) {
        console.error("Error processing eSign response:", error.message);
        res.status(500).send("Error processing response");
    }
});

// Helper function to parse XML
function parseXML(xml) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, { explicitArray: true }, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
