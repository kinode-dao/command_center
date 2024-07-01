import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useParams } from 'react-router-dom';
import FileView from './components/FileView';
import Home from './components/Home';

function FileViewWrapper({ notes }) {
  const { filePath: rawFilePath } = useParams();
  const filePath = rawFilePath.startsWith('root/') ? rawFilePath.slice(5) : rawFilePath;
  const note = notes[filePath];
  console.log("NOTE IN WRAPPER", note);
  return <FileView note={note} />;
}

  function App() {
    const [notes, setNotes] = useState({});
    console.log("NOTES IN APP", notes);
    return (
      <HashRouter>
        <Routes>
        <Route path="/" element={<Home notes={notes} setNotes={setNotes}/>} />
        <Route path="/file/:filePath" element={<FileViewWrapper notes={notes} />} />
        <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </HashRouter>
    );
  }
export default App

