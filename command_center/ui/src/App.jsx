import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, useParams } from "react-router-dom";
import FileView from "./components/FileView";
import Home from "./components/Home";
import FlexSearch from "../node_modules/flexsearch/dist/flexsearch.bundle.module.min.js";

function FileViewWrapper({ notes }) {
  const { filePath: rawFilePath } = useParams();
  console.log(rawFilePath);
  const prefix = "root/";
  const filePath = rawFilePath.startsWith(prefix)
    ? rawFilePath.slice(prefix.length)
    : rawFilePath;
  const note = notes[filePath];
  const prefix2 = "root/command_center:appattacc.os/files";
  const trimmedFilePath = rawFilePath.startsWith(prefix2)
    ? rawFilePath.slice(prefix2.length)
    : rawFilePath;
  console.log("NOTE IN WRAPPER", note);
  return <FileView note={note} filePath={trimmedFilePath} />;
}

function App() {
  const [notes, setNotes] = useState({});
  const [notesResult, setNotesResult] = useState("");
  const [notesIndex, setNotesIndex] = useState(null);
  const [messages, setMessages] = useState([]);
  const [backupsTimeMap, setBackupsTimeMap] = useState(new Map());
  const [notesBackedUpAt, setNotesBackedUpAt] = useState(null);
  const [notesBackupProvider, setNotesBackupProvider] = useState(null);
  const [lastBackupSize, setLastBackupSize] = useState(null);

  useEffect(() => {
    webSocket();
    fetchNotes();
    fetchBackupData();
  }, []);

  const options = {
    charset: "latin:extra",
    preset: "match",
    tokenize: "strict",
  };

  const importNotes = async () => {
    document.getElementById("importNotesResult").textContent =
      "Importing notes...";
    const input = document.getElementById("folderInput");
    const files = input.files;
    const fileContentsMap = new Map();

    const readFiles = Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
          fileContentsMap.set(file.webkitRelativePath, event.target.result);
          resolve();
        };
        reader.onerror = function (event) {
          console.error(
            "File could not be read! Code " + event.target.error.code
          );
          reject(event.target.error);
        };
        reader.readAsText(file);
      });
    });

    Promise.all(readFiles)
      .then(async () => {
        console.log("All files have been read and processed.");
        const bodyData = Object.fromEntries(fileContentsMap);
        const response = await fetch(
          "/main:command_center:appattacc.os/import_notes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          }
        );
        try {
          const data = await response.json();
          if (data.message === "success") {
            document.getElementById("importNotesResult").textContent =
              "Success!";
            fetchNotes();
          } else {
            document.getElementById("importNotesResult").textContent =
              "Failed to import notes.";
          }
        } catch (error) {
          console.error(error);
          document.getElementById("importNotesResult").textContent =
            "Failed to import notes.";
        }
      })
      .catch((error) => {
        console.error("An error occurred while reading the files:", error);
      });
  };

  const webSocket = () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host =
      window.location.port === "5173" ? "localhost:8080" : window.location.host;
    const tg_ws = new WebSocket(
      `${protocol}//${host}/tg:command_center:appattacc.os/`
    );
    const cmd_ws = new WebSocket(
      `${protocol}//${host}/main:command_center:appattacc.os/`
    );

    tg_ws.onopen = function (event) {
      console.log("Connection opened on " + window.location.host + ":", event);
    };
    tg_ws.onmessage = function (event) {
      console.log("tg websocket message received:", event.data);
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data.NewMessageUpdate]);
    };
    
    cmd_ws.onopen = function (event) {
      console.log("Connection opened on " + window.location.host + ":", event);
    };
    cmd_ws.onmessage = function (event) {
      console.log("cmd websocket message received:", event.data);
      const data = JSON.parse(event.data);
    };
  };

  const fetchNotes = async () => {
    setNotesResult("Fetching notes and preparing index...");
    try {
      const response = await fetch("/main:command_center:appattacc.os/fetch_notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const fetchedNotes = await response.json();
      console.log("FETCHED NOTES", fetchedNotes);
      setNotes(fetchedNotes);

      const newIndex = new FlexSearch.Index(options);
      for (let key in fetchedNotes) {
        const noteContent = fetchedNotes[key];
        if (typeof noteContent === "string") {
          try {
            newIndex.add(key, fetchedNotes[key]);
          } catch (error) {
            console.error("Error adding note to index:", key);
          }
        } else {
          console.error(
            `Note content for key ${key} is not a string:`,
            noteContent
          );
        }
      }
      setNotesIndex(newIndex);

      if (Object.keys(fetchedNotes).length === 0) {
        setNotesResult("No notes found. Please import.");
      } else {
        setNotesResult("Ready to search!");
      }
      console.log("index created");
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotesResult("Error fetching notes. Please try again.");
    }
  };

  const fetchApiKeys = async () => {
    const response = await fetch(
      "/main:command_center:appattacc.os/fetch_api_keys",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    try {
      const data = await response.json();
      if (data.telegram_key) {
        document.getElementById("telegramKey").value = data.telegram_key;
      }
      if (data.openai_key) {
        document.getElementById("openaiKey").value = data.openai_key;
      }
      if (data.groq_key) {
        document.getElementById("groqKey").value = data.groq_key;
      }
      if (data.groq_key && data.openai_key && data.telegram_key) {
        document.getElementById("result").innerHTML = `<ul>
              <li> Congrats! You have submitted all 3 API keys.</li>
              <li> - Go to your Telegram <a href="https://t.me/your_new_bot" target="_blank"> @botfather</a> chat.</li>
              <li> - Click on the link which he provided (e.g. "t.me/your_new_bot").</li>
              <li> - Try sending it a voice or a text message and see what happens!</li>
              <li> - Bonus: take a look at Data Center while messaging.</li>
            </ul>`;
      }
    } catch (error) {
      console.error(error);
      document.getElementById("result").textContent =
        "Failed to fetch api keys.";
    }
  };

  const fetchBackupData = async () => {
    try {
      const response = await fetch(
        "/main:command_center:appattacc.os/fetch_backup_data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resp = await response.json();
      console.log("response:", resp);
      setBackupsTimeMap(resp.backups_time_map);
      setNotesBackedUpAt(resp.notes_last_backed_up_at);
      setNotesBackupProvider(resp.notes_backup_provider);
      // mock:
      setLastBackupSize("1gb");
    } catch (error) {
      console.error("error on backup:", error);
    }
  };

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              fetchApiKeys={fetchApiKeys}
              importNotes={importNotes}
              notes={notes}
              setNotes={setNotes}
              notesIndex={notesIndex}
              setNotesIndex={setNotesIndex}
              notesResult={notesResult}
              setNotesResult={setNotesResult}
              messages={messages}
              setMessages={setMessages}
              notesBackedUpAt={notesBackedUpAt}
              notesBackupProvider={notesBackupProvider}
              backupsTimeMap={backupsTimeMap}
              lastBackupSize={lastBackupSize}
            />
          }
        />
        <Route
          path="/file/:filePath"
          element={<FileViewWrapper notes={notes} />}
        />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
