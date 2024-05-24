document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("defaultOpen").click();
});

webSocket();
initializeTooltips();
fetchStatus();

window.openTab = openTab;

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
  const ws = new WebSocket('ws://' + window.location.host + '/tg:command_center:appattacc.os/');

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
