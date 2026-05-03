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

    // Check authentication when clicking "Responses" button
    document.getElementById("responses").addEventListener("click", async () => {
        const response = await fetch("/authenticate");
        const data = await response.json();        

        if (data.authenticated) {
            fetchResponses(); // Open responses if logged in
        } else {
            window.location.href = "login.html"; // Redirect to login page
        }
    }); 

    function yesNo(value) {
        return value == 1 ? "Yes" : "No";
    }

    // Function to fetch and display responses
    function fetchResponses() {
        fetch('/responses', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                responsesContainer.innerHTML = '';  // Clear previous data
                data.forEach(response => {
                    const div = document.createElement('div');
                    div.classList.add('response');
                    div.innerHTML = `
                        <p><strong>ID:</strong> ${response.id}</p>
                        // <p><strong>Expert Name:</strong> ${response.expert_name}</p> // New

                        // <p><strong>Name:</strong> ${response.name}</p>
                        // <p><strong>Patient ID:</strong> ${response.patient_id}</p>
                        // <p><strong>Age:</strong> ${response.age}</p>
                        // <p><strong>Sex:</strong> ${response.sex}</p>
                        // <p><strong>Ethnicity:</strong> ${response.ethnicity}</p>
                        // <p><strong>Weight:</strong> ${response.weight}</p>
                        // <p><strong>Height:</strong> ${response.height}</p>
                        // <p><strong>Diagnosis:</strong> ${response.diagnosis}</p>

                        <p><strong>Heartburn:</strong> ${response.heartburn}</p>
                        <p><strong>Easily understood:</strong> ${response.heartburn_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.heartburn_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.heartburn_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.heartburn_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.heartburn_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.heartburn_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.heartburn_comments}</p>

                        <p><strong>Dysphagia:</strong> ${response.dysphagia}</p>
                        <p><strong>Easily understood:</strong> ${response.dysphagia_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.dysphagia_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.dysphagia_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.dysphagia_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.dysphagia_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.dysphagia_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.dysphagia_comments}</p>

                        <p><strong>Fullness:</strong> ${response.fullness}</p>
                        <p><strong>Easily understood:</strong> ${response.fullness_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.fullness_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.fullness_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.fullness_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.fullness_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.fullness_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.fullness_comments}</p>

                        <p><strong>Early Satiety:</strong> ${response.early_satiety}</p>
                        <p><strong>Easily understood:</strong> ${response.early_satiety_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.early_satiety_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.early_satiety_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.early_satiety_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.early_satiety_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.early_satiety_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.early_satiety_comments}</p>

                        <p><strong>Post-prandial Pain:</strong> ${response.postprandial_pain}</p>
                        <p><strong>Easily understood:</strong> ${response.postprandial_pain_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.postprandial_pain_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.postprandial_pain_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.postprandial_pain_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.postprandial_pain_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.postprandial_pain_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.postprandial_pain_comments}</p>

                        <p><strong>Epigastric Pain:</strong> ${response.epigastric_pain}</p>
                        <p><strong>Easily understood:</strong> ${response.epigastric_pain_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.epigastric_pain_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.epigastric_pain_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.epigastric_pain_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.epigastric_pain_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.epigastric_pain_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.epigastric_pain_comments}</p>

                        <p><strong>Retrosternal Discomfort:</strong> ${response.retrosternal_discomfort}</p>
                        <p><strong>Easily understood:</strong> ${response.retrosternal_discomfort_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.retrosternal_discomfort_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.retrosternal_discomfort_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.retrosternal_discomfort_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.retrosternal_discomfort_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.retrosternal_discomfort_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.retrosternal_discomfort_comments}</p>

                        <p><strong>Pain before Defecation:</strong> ${response.pain_before_defecation}</p>
                        <p><strong>Easily understood:</strong> ${response.pain_before_defecation_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.pain_before_defecation_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.pain_before_defecation_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.pain_before_defecation_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.pain_before_defecation_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.pain_before_defecation_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.pain_before_defecation_comments}</p>

                        <p><strong>Difficulty Defecating:</strong> ${response.difficulty_defecating}</p>
                        <p><strong>Easily understood:</strong> ${response.difficulty_defecating_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.difficulty_defecating_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.difficulty_defecating_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.difficulty_defecating_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.difficulty_defecating_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.difficulty_defecating_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.difficulty_defecating_comments}</p>

                        <p><strong>Constipation:</strong> ${response.constipation}</p>
                        <p><strong>Easily understood:</strong> ${response.constipation_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.constipation_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.constipation_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.constipation_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.constipation_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.constipation_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.constipation_comments}</p>

                        <p><strong>Loose Stool:</strong> ${response.loose_stool}</p>
                        <p><strong>Easily understood:</strong> ${response.loose_stool_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.loose_stool_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.loose_stool_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.loose_stool_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.loose_stool_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.loose_stool_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.loose_stool_comments}</p>

                        <p><strong>Incontinence:</strong> ${response.incontinence}</p>
                        <p><strong>Easily understood:</strong> ${response.incontinence_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.incontinence_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.incontinence_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.incontinence_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.incontinence_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.incontinence_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.incontinence_comments}</p>

                        <p><strong>Urge to Defecate:</strong> ${response.urge_to_defecate}</p>
                        <p><strong>Easily understood:</strong> ${response.urge_to_defecate_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.urge_to_defecate_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.urge_to_defecate_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.urge_to_defecate_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.urge_to_defecate_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.urge_to_defecate_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.urge_to_defecate_comments}</p>

                        <p><strong>Diarrhea:</strong> ${response.diarrhea}</p>
                        <p><strong>Easily understood:</strong> ${response.diarrhea_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.diarrhea_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.diarrhea_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.diarrhea_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.diarrhea_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.diarrhea_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.diarrhea_comments}</p>

                        <p><strong>Loss of Appetite:</strong> ${response.loss_of_appetite}</p>
                        <p><strong>Easily understood:</strong> ${response.loss_of_appetite_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.loss_of_appetite_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.loss_of_appetite_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.loss_of_appetite_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.loss_of_appetite_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.loss_of_appetite_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.loss_of_appetite_comments}</p>

                        <p><strong>Abdominal Pain:</strong> ${response.abdominal_pain}</p>
                        <p><strong>Easily understood:</strong> ${response.abdominal_pain_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.abdominal_pain_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.abdominal_pain_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.abdominal_pain_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.abdominal_pain_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.abdominal_pain_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.abdominal_pain_comments}</p>

                        <p><strong>Sickness:</strong> ${response.sickness}</p>
                        <p><strong>Easily understood:</strong> ${response.sickness_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.sickness_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.sickness_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.sickness_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.sickness_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.sickness_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.sickness_comments}</p>

                        <p><strong>Nausea:</strong> ${response.nausea}</p>
                        <p><strong>Easily understood:</strong> ${response.nausea_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.nausea_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.nausea_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.nausea_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.nausea_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.nausea_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.nausea_comments}</p>

                        <p><strong>Vomiting:</strong> ${response.vomiting}</p>
                        <p><strong>Easily understood:</strong> ${response.vomiting_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.vomiting_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.vomiting_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.vomiting_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.vomiting_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.vomiting_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.vomiting_comments}</p>

                        <p><strong>Bloating:</strong> ${response.bloating}</p>
                        <p><strong>Easily understood:</strong> ${response.bloating_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.bloating_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.bloating_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.bloating_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.bloating_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.bloating_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.bloating_comments}</p>

                        <p><strong>Flatulence:</strong> ${response.flatulence}</p>
                        <p><strong>Easily understood:</strong> ${response.flatulence_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.flatulence_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.flatulence_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.flatulence_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.flatulence_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.flatulence_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.flatulence_comments}</p>

                        <p><strong>Belching:</strong> ${response.belching}</p>
                        <p><strong>Easily understood:</strong> ${response.belching_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.belching_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.belching_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.belching_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.belching_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.belching_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.belching_comments}</p>

                        <p><strong>Anxiety:</strong> ${response.anxiety}</p>
                        <p><strong>Easily understood:</strong> ${response.anxiety_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.anxiety_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.anxiety_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.anxiety_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.anxiety_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.anxiety_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.anxiety_comments}</p>

                        <p><strong>Depression:</strong> ${response.depression}</p>
                        <p><strong>Easily understood:</strong> ${response.depression_understood}</p>
                        <p><strong>Size appropriate:</strong> ${response.depression_size}</p>
                        <p><strong>Color appropriate:</strong> ${response.depression_color}</p>
                        <p><strong>Speed appropriate:</strong> ${response.depression_speed}</p>
                        <p><strong>Misinterpretation:</strong> ${yesNo(response.depression_misinterpret)}</p>
                        <p><strong>Misinterpretation comment:</strong> ${response.depression_misinterpret_comment}</p>
                        <p><strong>Comments:</strong> ${response.depression_comments}</p>

                        <p><strong>Engaging and intuitive design:</strong> ${response.design_quality}</p>
                        <p><strong>Recommended for clinical practice:</strong> ${response.clinical_practice}</p>
                        <p><strong>Overall comments:</strong> ${response.overall_comments}</p>
                    `;
                    responsesContainer.appendChild(div);
                });
            })
            .catch(error => {
                console.error('Error fetching responses:', error);
            });
    }
});