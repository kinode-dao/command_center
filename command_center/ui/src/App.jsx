import { useState, useEffect } from 'react'
import './App.css'
import Popup from './components/Popup'
import FlexSearch from "../node_modules/flexsearch/dist/flexsearch.bundle.module.min.js";

window.handleLinkClick = (id) => {
}


function App() {
  const [activeTab, setActiveTab] = useState('Config');
  const [notesResult, setNotesResult] = useState(''); 
  const [notes, setNotes] = useState({}); // Add this line
  const [notesIndex, setNotesIndex] = useState(null); // Add this line
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState('');

  const options = {
    charset: "latin:extra",
    preset: 'match',
    tokenize: 'strict',
  }

  useEffect(() => {
    webSocket();
    initializeTooltips();
    fetchStatus();
    fetchNotes();
  }, []);
  
  useEffect(() => {
    // Function to handle tab clicks
    const handleTabClick = (event, tabName) => {
      // Prevent the default action
      event.preventDefault();
      
      // Update the active tab state
      setActiveTab(tabName);
    };

    // Add click event listeners to all tab buttons
    const tabButtons = document.querySelectorAll('.tablinks');
    tabButtons.forEach(button => {
      button.addEventListener('click', (event) => handleTabClick(event, button.textContent));
    });

    // Cleanup function to remove event listeners
    return () => {
      tabButtons.forEach(button => {
        button.removeEventListener('click', (event) => handleTabClick(event, button.textContent));
      });
    };
  }, []); 

  const handleTooltipClick = (content) => {
    setPopupContent(content);
    setIsPopupOpen(true);
  };

  const fetchNotes = async () => {
    setNotesResult('Fetching notes and preparing index...');
    try {
      const response = await fetch('/main:command_center:appattacc.os/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const fetchedNotes = await response.json();
      console.log(fetchedNotes);
      setNotes(fetchedNotes);
  
      const newIndex = new FlexSearch.Index(options);
      for (let key in fetchedNotes) {
        newIndex.add(key, fetchedNotes[key]);
      }
      setNotesIndex(newIndex);


      console.log("creating index");
      console.log(newIndex);
      for (let key in fetchedNotes) {
        try {
          newIndex.add(key, fetchedNotes[key]);
        } catch (error) {
          console.error("Error adding note to index:", key);
        }
      }
      setNotesIndex(newIndex);
  
      if (Object.keys(fetchedNotes).length === 0) {
        setNotesResult('No notes found. Please import.');
      } else {
        setNotesResult('Ready to search!');
      }
      console.log("index created");
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotesResult('Error fetching notes. Please try again.');
    }
  }

  const searchNotes = () => {
    console.log(notesIndex);
    const searchQuery = document.getElementById('notesSearch').value || null;
    console.log(searchQuery);
    const ids = notesIndex.search(searchQuery, 15);
    console.log(ids);
    const notes_result = Object.fromEntries(
      Object.entries(notes).filter(([key, value]) => ids.includes(key))
    );
  
    console.log(notes_result);
  
    document.getElementById('notesResult').innerHTML =
      `<ul>
          ${Object.keys(notes_result).map((key) => {
        return `<nav><a id="${key}" onClick="handleLinkClick('${key}')">${key}</a></nav>`
      }).join('')}
        </ul>`
  }
  
  const importNotes = async () => {
    document.getElementById('importNotesResult').textContent = 'Importing notes...';
    const input = document.getElementById('folderInput');
    const files = input.files;
    const fileContentsMap = new Map();
  
    const readFiles = Array.from(files).map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
          fileContentsMap.set(file.webkitRelativePath, event.target.result);
          resolve();
        };
        reader.onerror = function (event) {
          console.error("File could not be read! Code " + event.target.error.code);
          reject(event.target.error);
        };
        reader.readAsText(file);
      });
    });
  
    Promise.all(readFiles).then(async () => {
      console.log("All files have been read and processed.");
      const bodyData = Object.fromEntries(fileContentsMap);
      const response = await fetch('/main:command_center:appattacc.os/import_notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });
      try {
        const data = await response.json();
        if (data.message === 'success') {
          document.getElementById('importNotesResult').textContent = 'Success!';
          fetchNotes();
        } else {
          document.getElementById('importNotesResult').textContent = 'Failed to import notes.';
        }
      } catch (error) {
        console.error(error);
        document.getElementById('importNotesResult').textContent = 'Failed to import notes.';
      }
  
    }).catch(error => {
      console.error("An error occurred while reading the files:", error);
    });
  
  
  }
  
  useEffect(() => {
    const tabContents = document.getElementsByClassName("tabcontent");
    const tabLinks = document.getElementsByClassName("tablinks");

    Array.from(tabContents).forEach((content) => {
      content.style.display = content.id === activeTab ? "block" : "none";
    });

    Array.from(tabLinks).forEach((link) => {
      if (link.id === `${activeTab}Link`) {
        link.className = link.className + " active";
      } else {
        link.className = link.className.replace(" active", "");
      }
    });
  }, [activeTab]);
  
  return (
<>
  <div className="tab">
    <button id="configTab" className="tablinks" onClick={() => setActiveTab('Config')}>Config</button>
    <button id="dataCenterTab" className="tablinks" onClick={() => setActiveTab('Data Center')}>Data Center</button>
    <button id="importNotesTab" className="tablinks" onClick={() => setActiveTab('Import Notes')}>Import Notes</button>
    <button id="notesTab" className="tablinks" onClick={() => setActiveTab('Notes')}>Notes</button>
  </div>
  <div className="h-screen w-screen overflow-hidden flex-col-center items-center justify-center gap-2">
  <div id="Config" className="tabcontent">
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
  <div id="Data Center" className="tabcontent">
    <h1 className="mb-2 flex-col-center">Latest Chat Updates</h1>
    <table id="messageContainer" className="mb-2">
      <thead>
        <tr>
          <th className="table-chat-id">Chat ID</th>
          <th className="table-message-id">Message ID</th>
          <th className="table-date">Date</th>
          <th className="table-username">Username</th>
          <th className="table-text">Text</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>
  <div id="Import Notes" className="tabcontent">
    <h1 className="mb-2 flex-col-center">Import Notes</h1>
    <div className="parent-container flex-col-center">
      <input
        type="file"
        id="folderInput"
        onChange={(e) => importNotes(e)}
        webkitdirectory="true"
        multiple
        style={{ display: 'none' }}
      />
      <label htmlFor="folderInput" className="button">Choose Files</label>
      <div className="flex-col-center">
        <span id="importNotesResult"></span>
      </div>
    </div>
  </div>
  <div id="Notes" className="tabcontent">
    <h1 className="mb-2 flex-col-center">Notes</h1>
    <div className="flex-center gap-2">
      <input type="text" id="notesSearch" placeholder="Search Notes" />
    </div>
    <div className="parent-container flex-col-center">
      <button onClick={() => searchNotes()}>Search</button>
      <div className="flex-col-center">
        <span id="notesResult"></span>
      </div>
    </div>
  </div>
  </div>
  <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        {popupContent}
      </Popup>

    </>
  )
}

export default App

export async function fetchStatus() {
  const response = await fetch('/main:command_center:appattacc.os/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  try {
    const data = await response.json();
    if (data.telegram_key) {
      document.getElementById('telegramKey').value = data.telegram_key;
    }
    if (data.openai_key) {
      document.getElementById('openaiKey').value = data.openai_key;
    }
    if (data.groq_key) {
      document.getElementById('groqKey').value = data.groq_key;
    }
    if (data.groq_key && data.openai_key && data.telegram_key) {
      document.getElementById('result').innerHTML =
        `<ul>
          <li> Congrats! You have submitted all 3 API keys.</li>
          <li> - Go to your Telegram <a href="https://t.me/your_new_bot" target="_blank"> @botfather</a> chat.</li>
          <li> - Click on the link which he provided (e.g. "t.me/your_new_bot").</li>
          <li> - Try sending it a voice or a text message and see what happens!</li>
          <li> - Bonus: take a look at Data Center while messaging.</li>
        </ul>`
    }
  } catch (error) {
    console.error(error);
    document.getElementById('result').textContent = 'Failed to fetch status.';
  }
}

export function initializeTooltips() {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tooltip').forEach(tooltip => {
      console.log(tooltip)
      tooltip.addEventListener('click', (e) => {
        // e.preventDefault();
        const tooltipText = tooltip.querySelector('.tooltiptext');
        console.log(tooltipText)
        tooltipText.classList.toggle('invisible');
      });
    });
  });
}

export function webSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.port === '5173' ? 'localhost:8080' : window.location.host;
  const ws = new WebSocket(`${protocol}//${host}/tg:command_center:appattacc.os/`);
  ws.onopen = function (event) {
    console.log('Connection opened on ' + window.location.host + ':', event);
  };
  ws.onmessage = function (event) {
    console.log('Message received:', event.data);
    const data = JSON.parse(event.data); // Assuming the data is JSON formatted
    const tableBody = document.querySelector('#messageContainer tbody');
    const row = document.createElement('tr');

    // Create a cell for each piece of data and append to the row
    ['chat_id', 'message_id', 'date', 'username', 'text'].forEach(key => {
      const cell = document.createElement('td');
      if (key == 'date') {
        // Create a new Date object using the timestamp multiplied by 1000 (to convert seconds to milliseconds)
        const timestamp = data["NewMessageUpdate"][key];
        const date = new Date(timestamp * 1000);

        // Format the date into a human-readable string
        const dateString = date.toLocaleDateString("en-US"); // Outputs in MM/DD/YYYY format for US locale
        const timeString = date.toLocaleTimeString("en-US"); // Outputs time in HH:MM:SS AM/PM format for US locale

        cell.textContent = dateString + " " + timeString;
      } else {
        cell.textContent = data["NewMessageUpdate"][key];
      }
      row.appendChild(cell);
    });

    tableBody.appendChild(row); // Append the row to the table body
  };
}

export function toggleTooltipVisibility() {
  document.addEventListener('DOMContentLoaded', () => {
      const tooltips = document.querySelectorAll('.tooltip');
      tooltips.forEach(tooltip => {
          tooltip.addEventListener('click', () => {
              const tooltipText = tooltip.querySelector('.tooltiptext');
              tooltipText.classList.toggle('visible');
          });
      });
  });
}

export async function submitKey() {
  const telegramKey = document.getElementById('telegramKey').value || null;
  const openaiKey = document.getElementById('openaiKey').value || null;
  const groqKey = document.getElementById('groqKey').value || null;
  const bodyData = {
      telegram_key: telegramKey,
      openai_key: openaiKey,
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
