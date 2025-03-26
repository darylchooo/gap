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
            return res.status(500).json({ error: "Database error", details: err.message }); // Send JSON response
        }

        if (!Array.isArray(results)) {
            console.error("Data retrieved is not an array:", results);
            return res.status(500).json({ error: "Data format error", details: "Retrieved data is not an array" });
        }

        res.status(200).json(results);
    });
});

app.post("/submit", (req, res) => {

    const columns = [
        'name', 'patient_id', 'age', 'sex', 'ethnicity', 'weight', 'height', 'diagnosis',

        'heartburn', 'heartburn_aligns', 'heartburn_represents', 'heartburn_differentiates', 'heartburn_misinterpret', 'heartburn_misinterpret_comment', 'heartburn_cultural',
        'heartburn_comments', 'heartburn_design', 'heartburn_size', 'heartburn_color', 'heartburn_speed', 'heartburn_understood', 'heartburn_design_comments',
        
        'dysphagia', 'dysphagia_aligns', 'dysphagia_represents', 'dysphagia_differentiates', 'dysphagia_misinterpret', 'dysphagia_misinterpret_comment', 'dysphagia_cultural',
        'dysphagia_comments', 'dysphagia_design', 'dysphagia_size', 'dysphagia_color', 'dysphagia_speed', 'dysphagia_understood', 'dysphagia_design_comments',
        
        'fullness', 'fullness_aligns', 'fullness_represents', 'fullness_differentiates', 'fullness_misinterpret', 'fullness_misinterpret_comment', 'fullness_cultural',
        'fullness_comments', 'fullness_design', 'fullness_size', 'fullness_color', 'fullness_speed', 'fullness_understood', 'fullness_design_comments',
        
        'early_satiety', 'early_satiety_aligns', 'early_satiety_represents', 'early_satiety_differentiates', 'early_satiety_misinterpret', 'early_satiety_misinterpret_comment', 'early_satiety_cultural',
        'early_satiety_comments', 'early_satiety_design', 'early_satiety_size', 'early_satiety_color', 'early_satiety_speed', 'early_satiety_understood', 'early_satiety_design_comments',
        
        'postprandial_pain', 'postprandial_pain_aligns', 'postprandial_pain_represents', 'postprandial_pain_differentiates', 'postprandial_pain_misinterpret', 'postprandial_pain_misinterpret_comment', 'postprandial_pain_cultural',
        'postprandial_pain_comments', 'postprandial_pain_design', 'postprandial_pain_size', 'postprandial_pain_color', 'postprandial_pain_speed', 'postprandial_pain_understood', 'postprandial_pain_design_comments',
        
        'epigastric_pain', 'epigastric_pain_aligns', 'epigastric_pain_represents', 'epigastric_pain_differentiates', 'epigastric_pain_misinterpret', 'epigastric_pain_misinterpret_comment', 'epigastric_pain_cultural',
        'epigastric_pain_comments', 'epigastric_pain_design', 'epigastric_pain_size', 'epigastric_pain_color', 'epigastric_pain_speed', 'epigastric_pain_understood', 'epigastric_pain_design_comments',
        
        'retrosternal_discomfort', 'retrosternal_discomfort_aligns', 'retrosternal_discomfort_represents', 'retrosternal_discomfort_differentiates', 'retrosternal_discomfort_misinterpret', 'retrosternal_discomfort_misinterpret_comment', 'retrosternal_discomfort_cultural',
        'retrosternal_discomfort_comments', 'retrosternal_discomfort_design', 'retrosternal_discomfort_size', 'retrosternal_discomfort_color', 'retrosternal_discomfort_speed', 'retrosternal_discomfort_understood', 'retrosternal_discomfort_design_comments',
        
        'pain_before_defecation', 'pain_before_defecation_aligns', 'pain_before_defecation_represents', 'pain_before_defecation_differentiates', 'pain_before_defecation_misinterpret', 'pain_before_defecation_misinterpret_comment', 'pain_before_defecation_cultural',
        'pain_before_defecation_comments', 'pain_before_defecation_design', 'pain_before_defecation_size', 'pain_before_defecation_color', 'pain_before_defecation_speed', 'pain_before_defecation_understood', 'pain_before_defecation_design_comments',
        
        'difficulty_defecating', 'difficulty_defecating_aligns', 'difficulty_defecating_represents', 'difficulty_defecating_differentiates', 'difficulty_defecating_misinterpret', 'difficulty_defecating_misinterpret_comment', 'difficulty_defecating_cultural',
        'difficulty_defecating_comments', 'difficulty_defecating_design', 'difficulty_defecating_size', 'difficulty_defecating_color', 'difficulty_defecating_speed', 'difficulty_defecating_understood', 'difficulty_defecating_design_comments',
        
        'constipation', 'constipation_aligns', 'constipation_represents', 'constipation_differentiates', 'constipation_misinterpret', 'constipation_misinterpret_comment', 'constipation_cultural',
        'constipation_comments', 'constipation_design', 'constipation_size', 'constipation_color', 'constipation_speed', 'constipation_understood', 'constipation_design_comments',
        
        'loose_stool', 'loose_stool_aligns', 'loose_stool_represents', 'loose_stool_differentiates', 'loose_stool_misinterpret', 'loose_stool_misinterpret_comment', 'loose_stool_cultural',
        'loose_stool_comments', 'loose_stool_design', 'loose_stool_size', 'loose_stool_color', 'loose_stool_speed', 'loose_stool_understood', 'loose_stool_design_comments',
        
        'incontinence', 'incontinence_aligns', 'incontinence_represents', 'incontinence_differentiates', 'incontinence_misinterpret', 'incontinence_misinterpret_comment', 'incontinence_cultural',
        'incontinence_comments', 'incontinence_design', 'incontinence_size', 'incontinence_color', 'incontinence_speed', 'incontinence_understood', 'incontinence_design_comments',
        
        'urge_to_defecate', 'urge_to_defecate_aligns', 'urge_to_defecate_represents', 'urge_to_defecate_differentiates', 'urge_to_defecate_misinterpret', 'urge_to_defecate_misinterpret_comment', 'urge_to_defecate_cultural',
        'urge_to_defecate_comments', 'urge_to_defecate_design', 'urge_to_defecate_size', 'urge_to_defecate_color', 'urge_to_defecate_speed', 'urge_to_defecate_understood', 'urge_to_defecate_design_comments', 

        'diarrhea', 'diarrhea_aligns', 'diarrhea_represents', 'diarrhea_differentiates', 'diarrhea_misinterpret', 'diarrhea_misinterpret_comment', 'diarrhea_cultural',
        'diarrhea_comments', 'diarrhea_design', 'diarrhea_size', 'diarrhea_color', 'diarrhea_speed', 'diarrhea_understood', 'diarrhea_design_comments',
        
        'loss_of_appetite', 'loss_of_appetite_aligns', 'loss_of_appetite_represents', 'loss_of_appetite_differentiates', 'loss_of_appetite_misinterpret', 'loss_of_appetite_misinterpret_comment', 'loss_of_appetite_cultural',
        'loss_of_appetite_comments', 'loss_of_appetite_design', 'loss_of_appetite_size', 'loss_of_appetite_color', 'loss_of_appetite_speed', 'loss_of_appetite_understood', 'loss_of_appetite_design_comments',
        
        'abdominal_pain', 'abdominal_pain_aligns', 'abdominal_pain_represents', 'abdominal_pain_differentiates', 'abdominal_pain_misinterpret', 'abdominal_pain_misinterpret_comment', 'abdominal_pain_cultural',
        'abdominal_pain_comments', 'abdominal_pain_design', 'abdominal_pain_size', 'abdominal_pain_color', 'abdominal_pain_speed', 'abdominal_pain_understood', 'abdominal_pain_design_comments',
        
        'sickness', 'sickness_aligns', 'sickness_represents', 'sickness_differentiates', 'sickness_misinterpret', 'sickness_misinterpret_comment', 'sickness_cultural',
        'sickness_comments', 'sickness_design', 'sickness_size', 'sickness_color', 'sickness_speed', 'sickness_understood', 'sickness_design_comments',
        
        'nausea', 'nausea_aligns', 'nausea_represents', 'nausea_differentiates', 'nausea_misinterpret', 'nausea_misinterpret_comment', 'nausea_cultural',
        'nausea_comments', 'nausea_design', 'nausea_size', 'nausea_color', 'nausea_speed', 'nausea_understood', 'nausea_design_comments',
        
        'vomiting', 'vomiting_aligns', 'vomiting_represents', 'vomiting_differentiates', 'vomiting_misinterpret', 'vomiting_misinterpret_comment', 'vomiting_cultural',
        'vomiting_comments', 'vomiting_design', 'vomiting_size', 'vomiting_color', 'vomiting_speed', 'vomiting_understood', 'vomiting_design_comments',
        
        'bloating', 'bloating_aligns', 'bloating_represents', 'bloating_differentiates', 'bloating_misinterpret', 'bloating_misinterpret_comment', 'bloating_cultural',
        'bloating_comments', 'bloating_design', 'bloating_size', 'bloating_color', 'bloating_speed', 'bloating_understood', 'bloating_design_comments',
        
        'flatulence', 'flatulence_aligns', 'flatulence_represents', 'flatulence_differentiates', 'flatulence_misinterpret', 'flatulence_misinterpret_comment', 'flatulence_cultural',
        'flatulence_comments', 'flatulence_design', 'flatulence_size', 'flatulence_color', 'flatulence_speed', 'flatulence_understood', 'flatulence_design_comments',
        
        'belching', 'belching_aligns', 'belching_represents', 'belching_differentiates', 'belching_misinterpret', 'belching_misinterpret_comment', 'belching_cultural',
        'belching_comments', 'belching_design', 'belching_size', 'belching_color', 'belching_speed', 'belching_understood', 'belching_design_comments',
        
        'anxiety', 'anxiety_aligns', 'anxiety_represents', 'anxiety_differentiates', 'anxiety_misinterpret', 'anxiety_misinterpret_comment', 'anxiety_cultural',
        'anxiety_comments', 'anxiety_design', 'anxiety_size', 'anxiety_color', 'anxiety_speed', 'anxiety_understood', 'anxiety_design_comments',
        
        'depression', 'depression_aligns', 'depression_represents', 'depression_differentiates', 'depression_misinterpret', 'depression_misinterpret_comment', 'depression_cultural',
        'depression_comments', 'depression_design', 'depression_size', 'depression_color', 'depression_speed', 'depression_understood', 'depression_design_comments',
        
        'sequence_order', 'pictogram_count', 'severity_scale', 'design_quality', 'distinguishable_symptoms', 
        'easy_tool', 'clinical_practice', 'overall_comments', 'submission_date'
    ];

    const values = columns.filter(col => col !== 'submission_date').map(col => req.body[col]);

    const placeholders = columns.map((col, index) => col === 'submission_date' ? 'NOW()' : `$${index + 1}`).join(', ');

    const sql = `INSERT INTO responses (${columns.join(', ')}) VALUES (${placeholders})`;

    console.log("SQL Query:", sql);
    console.log("Query Values:", values);

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
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Responses");

        // Define column structure
        const columns = [
            // Patient Information
            { header: "ID", key: "id", width: 8 },
            { header: "Name", key: "name", width: 25 },
            { header: "Patient ID", key: "patient_id", width: 15 },
            { header: "Age", key: "age", width: 8 },
            { header: "Sex", key: "sex", width: 8 },
            { header: "Ethnicity", key: "ethnicity", width: 20 },
            { header: "Weight", key: "weight", width: 10 },
            { header: "Height", key: "height", width: 10 },
            { header: "Diagnosis", key: "diagnosis", width: 25 }
        ];

        // Add Domain 1 & 2 columns for each symptom
        const symptoms = [
            'heartburn', 'dysphagia', 'fullness', 'early_satiety', 'postprandial_pain',
            'epigastric_pain', 'retrosternal_discomfort', 'pain_before_defecation',
            'difficulty_defecating', 'constipation', 'loose_stool', 'incontinence',
            'urge_to_defecate', 'diarrhea', 'loss_of_appetite', 'abdominal_pain',
            'sickness', 'nausea', 'vomiting', 'bloating', 'flatulence', 'belching',
            'anxiety', 'depression'
        ];

        symptoms.forEach(symptom => {
            const symptomName = symptom.replace(/_/g, ' ');
            columns.push(
                { header: `${symptomName} Severity`, key: symptom, width: 15 },
                { header: `${symptomName} Aligns`, key: `${symptom}_aligns`, width: 15 },
                { header: `${symptomName} Represents`, key: `${symptom}_represents`, width: 15 },
                { header: `${symptomName} Differentiates`, key: `${symptom}_differentiates`, width: 15 },
                { header: `${symptomName} Misinterpret`, key: `${symptom}_misinterpret`, width: 15 },
                { header: `${symptomName} Misinterpret Comment`, key: `${symptom}_misinterpret_comment`, width: 25 },
                { header: `${symptomName} Cultural`, key: `${symptom}_cultural`, width: 15 },
                { header: `${symptomName} Comments`, key: `${symptom}_comments`, width: 25 },
                { header: `${symptomName} Design`, key: `${symptom}_design`, width: 15 },
                { header: `${symptomName} Size`, key: `${symptom}_size`, width: 15 },
                { header: `${symptomName} Color`, key: `${symptom}_color`, width: 15 },
                { header: `${symptomName} Speed`, key: `${symptom}_speed`, width: 15 },
                { header: `${symptomName} Understood`, key: `${symptom}_understood`, width: 15 },
                { header: `${symptomName} Design Comments`, key: `${symptom}_design_comments`, width: 25 }
            );
        });

        // Add Domain 3 columns
        columns.push(
            { header: "Sequence Order", key: "sequence_order", width: 15 },
            { header: "Pictogram Count", key: "pictogram_count", width: 15 },
            { header: "Severity Scale", key: "severity_scale", width: 15 },
            { header: "Design Quality", key: "design_quality", width: 15 },
            { header: "Distinguishable Symptoms", key: "distinguishable_symptoms", width: 20 },
            { header: "Easy to Use", key: "easy_tool", width: 15 },
            { header: "Clinical Practice", key: "clinical_practice", width: 15 },
            { header: "Overall Comments", key: "overall_comments", width: 25 },
            { header: "Submission Date", key: "submission_date", width: 25 }
        );

        worksheet.columns = columns;

        // Fetch and process data
        connection.query("SELECT * FROM responses", async (err, results) => {
            if (err) throw err;

            results.forEach(response => {
                const rowData = {
                    // Patient Information
                    id: response.id,
                    name: response.name,
                    patient_id: response.patient_id,
                    age: response.age,
                    sex: response.sex,
                    ethnicity: response.ethnicity,
                    weight: response.weight,
                    height: response.height,
                    diagnosis: response.diagnosis
                };

                // Add Domain 1 & 2 data for each symptom
                symptoms.forEach(symptom => {
                    rowData[symptom] = response[symptom];
                    rowData[`${symptom}_aligns`] = response[`${symptom}_aligns`];
                    rowData[`${symptom}_represents`] = response[`${symptom}_represents`];
                    rowData[`${symptom}_differentiates`] = response[`${symptom}_differentiates`];
                    rowData[`${symptom}_misinterpret`] = response[`${symptom}_misinterpret`];
                    rowData[`${symptom}_misinterpret_comment`] = response[`${symptom}_misinterpret_comment`];
                    rowData[`${symptom}_cultural`] = response[`${symptom}_cultural`];
                    rowData[`${symptom}_comments`] = response[`${symptom}_comments`];
                    rowData[`${symptom}_design`] = response[`${symptom}_design`];
                    rowData[`${symptom}_size`] = response[`${symptom}_size`];
                    rowData[`${symptom}_color`] = response[`${symptom}_color`];
                    rowData[`${symptom}_speed`] = response[`${symptom}_speed`];
                    rowData[`${symptom}_understood`] = response[`${symptom}_understood`];
                    rowData[`${symptom}_design_comments`] = response[`${symptom}_design_comments`];
                });

                // Add Domain 3 data
                rowData.sequence_order = response.sequence_order;
                rowData.pictogram_count = response.pictogram_count;
                rowData.severity_scale = response.severity_scale;
                rowData.design_quality = response.design_quality;
                rowData.distinguishable_symptoms = response.distinguishable_symptoms;
                rowData.easy_tool = response.easy_tool;
                rowData.clinical_practice = response.clinical_practice;
                rowData.overall_comments = response.overall_comments;
                rowData.submission_date = new Date(response.submission_date).toLocaleString();

                worksheet.addRow(rowData);
            });

            // Set response headers
            res.setHeader('Content-Disposition', 'attachment; filename="gap_full_export.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            // Write to response
            await workbook.xlsx.write(res);
            res.end();
        });
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).send('Error generating export file');
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
