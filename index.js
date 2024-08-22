const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const connection = require("./db");
const ExcelJS = require("exceljs");

const app = express();

app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html for root path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
}); 

app.get("/responses", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "responses.html"));
});

app.get("/responses-data", (req, res) => {
    const sql = "SELECT * FROM responses";
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error retrieving data: " + err.stack);
            res.status(500).send("Database error");
        } else {
            res.status(200).json(results);
        }
    });
});

app.post("/submit", (req, res) => {
    const {dysphagia, bloating, flatulence, abdominal_pain, heartburn, nausea, regurgitation, vomiting} = req.body;
    const sql = "INSERT INTO responses (dysphagia, bloating, flatulence, abdominal_pain, heartburn, nausea, regurgitation, vomiting) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [dysphagia, bloating, flatulence, abdominal_pain, heartburn, nausea, regurgitation, vomiting];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting data: " + err.stack);
            res.status(500).send("Database error");
        } else {
            res.status(200).send("Survey submitted!");
        }
    });
});

app.get("/export", async (req, res) => {
    try {
        // Create a new workbook and add a worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Responses");

        // Define columns
        worksheet.columns = [
            {header: "ID", key: "id", width: 8.11},
            {header: "Dysphagia", key: "dysphagia", width: 16.22},
            {header: "Bloating", key: "bloating", width: 16.22},
            {header: "Flatulence", key: "flatulence", width: 16.22},
            {header: "Abdominal Pain", key: "abdominal_pain", width: 16.22},
            {header: "Heartburn", key: "heartburn", width: 16.22},
            {header: "Nausea", key: "nausea", width: 16.22},
            {header: "Regurgitation", key: "regurgitation", width: 16.22},
            {header: "Vomiting", key: "vomiting", width: 16.22},
            {header: "Submission Date", key: "submission_date", width: 24.33}
        ];

        // Fetch data from database
        const sql = "SELECT * FROM responses";
        connection.query(sql, async (err, results) => {
            if (err) {
                console.error("Error retrieving data: " + err.stack);
                res.status(500).send("Database error");
            } else {
                // Add rows to the worksheet
                results.forEach(response => {
                    worksheet.addRow({
                        id: response.id,
                        dysphagia: response.dysphagia,
                        bloating: response.bloating,
                        flatulence: response.flatulence,
                        abdominal_pain: response.abdominal_pain,
                        heartburn: response.heartburn,
                        nausea: response.nausea,
                        regurgitation: response.regurgitation,
                        vomiting: response.vomiting,
                        submission_date: new Date(response.submission_date).toLocaleString()
                    });
                });

                // Set the response headers
                res.setHeader('Content-Disposition', 'attachment; filename="gap.xlsx"');
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                // Write the workbook to a stream and pipe it to the response
                await workbook.xlsx.write(res);
                res.end();
            }
        });
    } catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).send('Internal Server Error');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});