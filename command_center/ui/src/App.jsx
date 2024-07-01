import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom';
import FileView from './components/FileView';
import Home from './components/Home';

  function App() {
    return (
      <HashRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/file/*" element={<FileView />} />
        <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </HashRouter>
    );
  }
export default App

