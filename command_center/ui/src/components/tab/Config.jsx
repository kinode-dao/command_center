import { useState } from 'react'
import Popup from '../Popup'

function Config({ fetchApiKeys }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupContent, setPopupContent] = useState('');

    const handleTooltipClick = (content) => {
        setPopupContent(content);
        setIsPopupOpen(true);
    };

    const submitKey = async () => {
        const telegramKey = document.getElementById('telegramKey').value || null;
        const openaiKey = document.getElementById('openaiKey').value || null;
        const groqKey = document.getElementById('groqKey').value || null;
        const bodyData = {
            telegram_key: telegramKey,
            openai_key: openaiKey,
            groq_key: groqKey
        };
        const response = await fetch('/main:command_center:appattacc.os/submit_api_keys', {
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
                fetchApiKeys();
            } else {
                document.getElementById('result').textContent = 'Failed to submit key.';
            }
        } catch (error) {
            console.error(error);
            document.getElementById('result').textContent = 'Failed to submit key.';
        }
    }

    return (
        <div id="Config" className="tabcontent">
            <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                {popupContent}
            </Popup>
            <h1 className="mb-2 flex-col-center">Telegram Bot Configuration</h1>
            <div className="parent-container">
                <span>Telegram Bot API Key</span>
                <div className="flex-center gap-2">
                    <input type="text" id="telegramKey" placeholder="Enter Telegram Bot API Key" />
                    <button
                        type="button"
                        className="icon relative tooltip"
                        onClick={() => handleTooltipClick(
                            <ul>
                                <li>- Open a Telegram chat with <a href="https://t.me/botfather" target="_blank">@BotFather</a>.</li>
                                <li>- Start a conversation and type `/newbot`.</li>
                                <li>- Follow prompts to create a new bot.</li>
                                <li>- Securely copy the HTTP API access token displayed.</li>
                                <li>- Paste the token (API key) here.</li>
                            </ul>
                        )}
                    >
                        <span className="text-lg font-bold">?</span>
                    </button>
                </div>
            </div>
            <div className="parent-container">
                <span>OpenAI API Key</span>
                <div className="flex-center gap-2">
                    <input type="text" id="openaiKey" placeholder="Enter OpenAI API Key" />
                    <button
                        type="button"
                        className="icon relative tooltip"
                        onClick={() => handleTooltipClick(
                            <ul>
                                <li>- Go to <a href="https://platform.openai.com" target="_blank">OpenAI Platform</a> and sign in /
                                    sign up.</li>
                                <li>- Go to <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI API Keys</a>, and if
                                    prompted, verify your phone number.</li>
                                <li>- Go to <a href="https://platform.openai.com/settings/organization/billing/overview"
                                    target="_blank">OpenAI
                                    Billing</a> page, and see if you have any credits - if not, add to
                                    credits balance.</li>
                                <li>- Go back to <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI API Keys</a>,
                                    and click "Create new secret key" to generate a key.</li>
                                <li>- Click through until an API key is displayed.</li>
                                <li>- Securely copy the API key.</li>
                                <li>- Paste the API key here.</li>
                            </ul>
                        )}
                    >
                        <span className="text-lg font-bold">?</span>
                    </button>
                </div>
            </div>
            <div className="parent-container">
                <span>Groq API Key</span>
                <div className="flex-center gap-2">
                    <input type="text" id="groqKey" placeholder="Enter Groq API Key" />
                    <button
                        type="button"
                        className="icon relative tooltip"
                        onClick={() => handleTooltipClick(
                            <ul>
                                <li>- Go to <a href="https://console.groq.com/keys">Groq API Keys</a> and sign in / sign up.</li>
                                <li>- Click "Create API Key" to generate a key.</li>
                                <li>- Click through until an API key is displayed.</li>
                                <li>- Give the key a name.</li>
                                <li>- Securely copy the API key.</li>
                                <li>- Paste the API key here.</li>
                            </ul>
                        )}
                    >
                        <span className="text-lg font-bold">?</span>
                    </button>
                </div>
            </div>
            <div className="parent-container flex-col-center">
                <button onClick={() => submitKey()}>Submit</button>
                <div className="flex-col-center">
                    <span id="result"></span>
                </div>
            </div>
        </div>
    );
}

export default Config;