require('dotenv').config();

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

    const {heartburn, dysphagia, fullness, early_satiety, postprandial_pain, epigastric_pain, retrosternal_discomfort, pain_before_defecation, 
        difficulty_defecating, constipation, loose_stool, incontinence, urge_to_defecate, diarrhea, loss_of_appetite, abdominal_pain, sickness, 
        nausea, vomiting, bloating, flatulence, belching, anxiety, depression} = req.body;
    
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send("Error: Request body is empty");
    }

    const sql = `INSERT INTO responses 
        (heartburn, dysphagia, fullness, early_satiety, postprandial_pain, epigastric_pain, 
        retrosternal_discomfort, pain_before_defecation, difficulty_defecating, constipation, 
        loose_stool, incontinence, urge_to_defecate, diarrhea, loss_of_appetite, abdominal_pain, 
        sickness, nausea, vomiting, bloating, flatulence, belching, anxiety, depression, submission_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

    const values = [heartburn, dysphagia, fullness, early_satiety, postprandial_pain, epigastric_pain, retrosternal_discomfort, pain_before_defecation, 
    difficulty_defecating, constipation, loose_stool, incontinence, urge_to_defecate, diarrhea, loss_of_appetite, abdominal_pain, sickness, 
    nausea, vomiting, bloating, flatulence, belching, anxiety, depression];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting data: " + err.stack);
            res.status(500).send("Database error");
        } else {
            res.status(200).send("Survey submitted!");
        }
    });
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    
    connection.query("DELETE FROM responses WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Error deleting entry: " + err.stack);
            return res.status(500).send("Database error");
        }
        
        // Reset IDs sequentially after deletion
        connection.query("SET @count = 0;");
        connection.query("UPDATE responses SET id = @count := @count + 1;");
        connection.query("ALTER TABLE responses AUTO_INCREMENT = 1;");
        
        res.status(200).send("Entry deleted and IDs updated");
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
            {header: "Heartburn", key: "heartburn", width: 16.22},
            {header: "Dysphagia", key: "dysphagia", width: 16.22},
            {header: "Fullness", key: "fullness", width: 16.22},
            {header: "Early Satiety", key: "early_satiety", width: 16.22},
            {header: "Postprandial Pain", key: "postprandial_pain", width: 16.22},
            {header: "Epigastric Pain", key: "epigastric_pain", width: 16.22},
            {header: "Retrosternal Discomfort", key: "retrosternal_discomfort", width: 24.33},
            {header: "Pain before Defecation", key: "pain_before_defecation", width: 24.33},
            {header: "Difficulty Defecating", key: "difficulty_defecating", width: 24.33},
            {header: "Constipation", key: "constipation", width: 16.22},
            {header: "Loose Stool", key: "loose_stool", width: 16.22},
            {header: "Incontinence", key: "incontinence", width: 16.22},
            {header: "Urge to Defecate", key: "urge_to_defecate", width: 16.22},
            {header: "Diarrhea", key: "diarrhea", width: 16.22},
            {header: "Loss of Appetite", key: "loss_of_appetite", width: 16.22},
            {header: "Abdominal Pain", key: "abdominal_pain", width: 16.22},
            {header: "Sickness", key: "sickness", width: 16.22},
            {header: "Nausea", key: "nausea", width: 16.22},
            {header: "Vomiting", key: "vomiting", width: 16.22},
            {header: "Bloating", key: "bloating", width: 16.22},
            {header: "Flatulence", key: "flatulence", width: 16.22},
            {header: "Belching", key: "belching", width: 16.22},
            {header: "Anxiety", key: "anxiety", width: 16.22},
            {header: "Depression", key: "depression", width: 16.22},
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
                        heartburn: response.heartburn,
                        dysphagia: response.dysphagia,
                        fullness: response.fullness,
                        early_satiety: response.early_satiety,
                        postprandial_pain: response.postprandial_pain,
                        epigastric_pain: response.epigastric_pain,
                        retrosternal_discomfort: response.retrosternal_discomfort,
                        pain_before_defecation: response.pain_before_defecation,
                        difficulty_defecating: response.difficulty_defecating,
                        constipation: response.constipation,
                        loose_stool: response.loose_stool,
                        incontinence: response.incontinence, 
                        urge_to_defecate: response.urge_to_defecate, 
                        diarrhea: response.diarrhea, 
                        loss_of_appetite: response.loss_of_appetite, 
                        abdominal_pain: response.abdominal_pain,
                        sickness: response.sickness,
                        nausea: response.nausea,
                        vomiting: response.vomiting,
                        bloating: response.bloating,
                        flatulence: response.flatulence,
                        belching: response.belching, 
                        anxiety: response.anxiety, 
                        depression: response.depression, 
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

app.delete("/clear", (req, res) => {
    connection.query("DELETE FROM responses", (err, result) => {
        if (err) {
            console.error("Error clearing database: " + err.stack);
            return res.status(500).send("Database error");
        }
        
        // Reset auto-increment ID
        connection.query("ALTER TABLE responses AUTO_INCREMENT = 1;");
        
        res.status(200).send("All entries deleted and IDs reset");
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});