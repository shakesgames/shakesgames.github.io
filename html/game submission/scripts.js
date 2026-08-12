document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const submitButton = document.getElementById('submitBtn');

  if (!uploadForm || !submitButton) {
    console.error("Submit button or form element is missing.");
    return;
  }

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;

    const discordUsername = document.getElementById('discordUsername').value;
    const gameName = document.getElementById('gameName').value;
    const gameLink = document.getElementById('gameLink').value;
    const gameZip = document.getElementById('gameZip').files[0];

    if (!discordUsername || !gameName || !gameLink || !gameZip) {
      alert("Please fill in all fields.");
      submitButton.disabled = false;
      return;
    }

    try {
      // Initialize Filestack client with your API key.
      const client = filestack.init('AlaTHdVhoTEOuzuHb9eKwz');

      // Upload the file using Filestack's JavaScript SDK.
      const result = await client.upload(gameZip);
      const downloadLink = result.url; // URL of the uploaded file

      // Post the details to your Discord webhook.
      const webhookUrl = 'https://discord.com/api/webhooks/1344327713414058015/KIRhK83t5pvJkg-ImstjeWwLyB9Li4lRiLTVA52wt-9mK0UK1Rzyu94Xz_s4ErTBImjw';
      const discordContent = `**Discord Username:** ${discordUsername}\n**Game Name:** ${gameName}\n**Game Link:** ${gameLink}\n**Download Link:** ${downloadLink}`;

      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: discordContent })
      });

      if (!webhookResponse.ok) {
        throw new Error('Discord webhook failed with status ' + webhookResponse.status);
      }

      alert("Game uploaded successfully!");
      uploadForm.reset();
    } catch (error) {
      console.error('Error:', error);
      alert("Failed to upload the game.");
    } finally {
      submitButton.disabled = false;
    }
  });
});
