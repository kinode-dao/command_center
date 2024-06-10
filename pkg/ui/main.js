import FlexSearch from "./node_modules/flexsearch/dist/flexsearch.bundle.module.min.js";
window.searchNotes = searchNotes;  // Make it available globally
window.handleLinkClick = handleLinkClick;  // Make it available globally

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("defaultOpen").click();
});
window.addEventListener('hashchange', renderNotePage);

// no thought has been put into these options, probably can be tuned
const options = {
  charset: "latin:extra",
  preset: 'match',
  tokenize: 'strict',
  cache: false
}
const notes_index = new FlexSearch.Index(options);
let notes = {};

webSocket();
initializeTooltips();
fetchStatus();
fetchNotes();

window.openTab = openTab;

export function searchNotes() {
  const searchQuery = document.getElementById('notesSearch').value || null;
  console.log(searchQuery);
  const ids = notes_index.search(searchQuery, 5);
  console.log(ids);
  const notes_result = Object.fromEntries(
    Object.entries(notes).filter(([key, value]) => ids.includes(key))
  );

  console.log(notes_result);

  document.getElementById('notesResult').innerHTML =
    `<ul>
        ${Object.keys(notes_result).map((key) => {
      return `<nav><a href="#/${key}" id="${key}" target="_blank" onclick="handleLinkClick('${key}')">${key}</a></nav>`
    }).join('')}
      </ul>`
}
export function handleLinkClick(id) {
  console.log("clicked");
  console.log(id);
  renderNotePage(id);
}

export async function fetchNotes() {
  const response = await fetch('/main:command_center:appattacc.os/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  notes = await response.json();
  console.log(notes);
  for (let key in notes) {
    notes_index.add(key, notes[key]);
    // console.log("creating page for key");
    // console.log(key);
    createNotePage(key, notes[key]);
  }
}
function createNotePage(key, note) {
  // This function is a placeholder to illustrate the concept
  // Actual implementation of creating "pages" would be handled by the router
}

function renderNotePage(noteKey) {
  console.log("rendering for key");
  console.log(noteKey);
  const noteContent = notes[noteKey];
  if (noteContent) {
    document.body.innerHTML = `<h1>Note: ${noteKey}</h1><p>${noteContent}</p>`;
  } else {
    document.body.innerHTML = '<h1>Note not found</h1>';
  }
}

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

export function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

export function webSocket() {
  const ws = new WebSocket('wss://' + window.location.host + '/tg:command_center:appattacc.os/');

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
