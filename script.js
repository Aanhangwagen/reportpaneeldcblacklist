// Trello API credentials
const API_KEY = '5f862665847c0e4c47752f7eb60180a0';
const API_TOKEN = 'ATTA44371dd8a9370e2d6c74a24216ccfb11aaf2b41a292ebd1ac1665f76ec021863D4DB276B';
// Replace this with your Trello List ID
const LIST_ID = '6617abf0b6c144203eba1051';

async function createReport() {
    const name = document.getElementById('card-name').value;
    const type = document.getElementById('card-type').value;
    const reason = document.getElementById('card-reason').value;
    const attachment = document.getElementById('card-attachment').files[0];

    if (!name || !type || !reason) {
        alert("Please fill in all fields.");
        return;
    }

    // Check if attachment is larger than Trello's limit (10 MB)
    if (attachment && attachment.size > 10 * 1024 * 1024) {
        alert("Attachment size exceeds 10 MB. Please choose a smaller file.");
        return;
    }

    try {
        // Step 1: Create a new card in Trello
        const response = await fetch(`https://api.trello.com/1/cards?key=${API_KEY}&token=${API_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                desc: `Type: ${type}\nReason: ${reason}`,
                idList: LIST_ID,
                pos: 'top'
            })
        });

        const card = await response.json();
        console.log('Card created successfully:', card);

        // Step 2: Upload attachment to the created card (if any)
        if (attachment) {
            const formData = new FormData();
            formData.append('file', attachment);
            formData.append('key', API_KEY);
            formData.append('token', API_TOKEN);

            const uploadResponse = await fetch(`https://api.trello.com/1/cards/${card.id}/attachments`, {
                method: 'POST',
                body: formData
            });

            const uploadData = await uploadResponse.json();
            console.log('Attachment uploaded successfully:', uploadData);
        }

        alert('Report successfully sent!');
    } catch (error) {
        console.error('Error creating card:', error);
        alert('Error creating report: ' + error.message);
    }
}
