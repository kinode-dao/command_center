import { fetchStatus } from "./main.js";

window.submitKey = submitKey;  // Make it available globally

export async function submitKey() {
    const telegramKey = document.getElementById('telegramKey').value || null;
    const openaiKey = document.getElementById('openaiKey').value || null;
    const claudeKey = document.getElementById('claudeKey').value || null;
    const groqKey = document.getElementById('groqKey').value || null;
    const bodyData = {
        telegram_key: telegramKey,
        openai_key: openaiKey,
        claude_key: claudeKey,
        groq_key: groqKey
    };
    const response = await fetch('/main:command_center:appattacc.os/submit_config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    try {
        const data = await response.json();
        if (data.message === 'success') {
            document.getElementById('result').textContent = 'Success!';
            fetchStatus();
        } else {
            document.getElementById('result').textContent = 'Failed to submit key.';
        }
    } catch (error) {
        console.error(error);
        document.getElementById('result').textContent = 'Failed to submit key.';
    }
}
