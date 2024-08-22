document.addEventListener('DOMContentLoaded', function() {
    fetch('/responses-data')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#responses-table tbody');
            tableBody.innerHTML = '';  // Clear existing data

            data.forEach(response => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${response.id}</td>
                    <td>${response.dysphagia}</td>
                    <td>${response.bloating}</td>
                    <td>${response.flatulence}</td>
                    <td>${response.abdominal_pain}</td>
                    <td>${response.heartburn}</td>
                    <td>${response.nausea}</td>
                    <td>${response.regurgitation}</td>
                    <td>${response.vomiting}</td>
                    <td>${new Date(response.submission_date).toLocaleString()}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching responses:', error));

    document.getElementById('export-button').addEventListener('click', function() {
        window.location.href = '/export';
    });
});