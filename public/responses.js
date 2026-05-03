document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("delete-button").addEventListener("click", function () {
        const id = prompt("Enter ID to delete:");
        if (id) {
            console.log(`/delete/${id}`)
            fetch(`/delete/${id}`, { method: "DELETE" })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                    location.reload();
                })
                .catch(error => console.error("Error:", error));
        }
    });
    
    fetch('/responses-data')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#responses-table tbody');
            tableBody.innerHTML = '';  // Clear existing data

            data.forEach(response => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${response.id}</td>

                    // New
                    <td>${response.expert_name}</td> 

                `;

                const symptoms = [
                    'heartburn', 'dysphagia', 'fullness', 'early_satiety', 'postprandial_pain', 'epigastric_pain', 'retrosternal_discomfort', 'pain_before_defecation', 
                    'difficulty_defecating', 'constipation', 'loose_stool', 'incontinence', 'urge_to_defecate', 'diarrhea', 'loss_of_appetite', 'abdominal_pain', 
                    'sickness', 'nausea', 'vomiting', 'bloating', 'flatulence', 'belching', 'anxiety', 'depression'
                ];

                symptoms.forEach(symptom => {
                    row.innerHTML += `
                        <td>${response[symptom]}</td>
                        <td>${response[`${symptom}_understood`]}</td>
                        <td>${response[`${symptom}_size`]}</td>
                        <td>${response[`${symptom}_color`]}</td>
                        <td>${response[`${symptom}_speed`]}</td>
                        <td>${response[`${symptom}_misinterpret`]}</td>
                        <td>${response[`${symptom}_misinterpret_comment`]}</td>
                        <td>${response[`${symptom}_comments`]}</td>
                    `;
                });

                row.innerHTML += `
                    <td>${response.design_quality}</td>
                    <td>${response.clinical_practice}</td>
                    <td>${response.overall_comments}</td>
                    <td>${new Date(response.submission_date).toLocaleString()}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching responses:', error));

    document.getElementById('export-button').addEventListener('click', function() {
        window.location.href = '/export';
    });

    document.getElementById("clear-button").addEventListener("click", function () {
        if (confirm("Are you sure you want to delete all responses?")) {
            fetch(`/clear`, { method: "DELETE" })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                    location.reload();
                })
                .catch(error => console.error("Error:", error));
        }
    });
});