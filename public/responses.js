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
                    <td>${response.heartburn}</td>
                    <td>${response.dysphagia}</td>
                    <td>${response.fullness}</td>
                    <td>${response.early_satiety}</td>
                    <td>${response.postprandial_pain}</td>
                    <td>${response.epigastric_pain}</td>
                    <td>${response.retrosternal_discomfort}</td>
                    <td>${response.pain_before_defecation}</td>
                    <td>${response.difficulty_defecating}</td>
                    <td>${response.constipation}</td>
                    <td>${response.loose_stool}</td>
                    <td>${response.incontinence}</td>
                    <td>${response.urge_to_defecate}</td>
                    <td>${response.diarrhea}</td>
                    <td>${response.loss_of_appetite}</td>
                    <td>${response.abdominal_pain}</td>
                    <td>${response.sickness}</td>
                    <td>${response.nausea}</td>
                    <td>${response.vomiting}</td>
                    <td>${response.bloating}</td>
                    <td>${response.flatulence}</td>
                    <td>${response.belching}</td>
                    <td>${response.anxiety}</td>
                    <td>${response.depression}</td>
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