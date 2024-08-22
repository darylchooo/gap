document.addEventListener('DOMContentLoaded', function() {
    // Function to handle clicks on video elements
    function handleOptionClick(event) {
        // Find the closest option container
        const option = event.currentTarget.closest('.option');
        const label = option.querySelector('label');

        // Remove the 'selected' class from all labels in the same row
        option.parentNode.querySelectorAll('.option label').forEach(label => {
            label.classList.remove('selected');
        });

        // Add the 'selected' class to the clicked option's label
        label.classList.add('selected');
    }

    // Attach click event listeners to all video elements
    document.querySelectorAll('.option video').forEach(video => {
        video.addEventListener('click', handleOptionClick);
    });

    const form = document.getElementById('survey-form');
    const responsesContainer = document.getElementById('responses-container');

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();  // Prevent default form submission

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(text => {
            alert(text);
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Function to fetch and display responses
    function fetchResponses() {
        fetch('/responses')
            .then(response => response.json())
            .then(data => {
                responsesContainer.innerHTML = '';  // Clear previous data
                data.forEach(response => {
                    const div = document.createElement('div');
                    div.classList.add('response');
                    div.innerHTML = `
                        <p><strong>ID:</strong> ${response.id}</p>
                        <p><strong>Dysphagia:</strong> ${response.dysphagia}</p>
                        <p><strong>Bloating:</strong> ${response.bloating}</p>
                        <p><strong>Flatulence:</strong> ${response.flatulence}</p>
                        <p><strong>Abdominal Pain:</strong> ${response.abdominal_pain}</p>
                        <p><strong>Heartburn:</strong> ${response.heartburn}</p>
                        <p><strong>Nausea:</strong> ${response.nausea}</p>
                        <p><strong>Regurgitation:</strong> ${response.regurgitation}</p>
                        <p><strong>Vomiting:</strong> ${response.vomiting}</p>
                    `;
                    responsesContainer.appendChild(div);
                });
            })
            .catch(error => {
                console.error('Error fetching responses:', error);
            });
    }

    // Fetch responses when the page loads
    fetchResponses();
});