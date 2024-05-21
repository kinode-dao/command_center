// document.getElementById("defaultOpen").click();
initializeTooltips();
fetchStatus();

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
    } else {
      document.getElementById('result').textContent = 'Failed to submit key.';
    }
  } catch (error) {
    console.error(error);
    document.getElementById('result').textContent = 'Failed to submit key.';
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

