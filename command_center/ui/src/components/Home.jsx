import { useState, useEffect } from 'react'
import '../App.css';
import Config from './tab/Config';
import DataCenter from './tab/DataCenter';
import NotesConfig from './tab/NotesConfig';
import Notes from './tab/Notes';
import ProvidedBackups from './tab/ProvidedBackups';

function Home({
    fetchApiKeys,
    importNotes,
    notes, setNotes,
    notesIndex, setNotesIndex,
    notesResult, setNotesResult,
    messages, setMessages,
    notesBackedUpAt, notesBackupProvider, backupsTimeMap, lastBackupSize
}) {
    const [activeTab, setActiveTab] = useState('Notes');
    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
        const notesKeys = Object.keys(notes);
        const newTreeData = pathsToTree(notesKeys);
        try {
            setTreeData(newTreeData[0].children[0].children[0].children);
        } catch (error) {
            console.log("NO NEW TREE DATA");
        }
    }, [notes]);

    useEffect(() => {
        fetchApiKeys();
        console.log("NTOES BACKED UP AT", notesBackedUpAt);
        console.log("NTOES RPOVIDER", notesBackupProvider);
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

    const searchNotes = () => {
        const searchQuery = document.getElementById('notesSearch').value || null;
        const ids = notesIndex.search(searchQuery, 15);
        const notes_result = Object.fromEntries(
            Object.entries(notes).filter(([key, value]) => ids.includes(key))
        );

        console.log(notes_result);
        document.getElementById('notesResult').innerHTML =
            `<ul>
      ${Object.keys(notes_result).map((key) => {
                const displayKey = key.replace('command_center:appattacc.os/files/', '');
                return `<nav><a id="${key}" href="#" onClick="window.location.hash = '/file/${encodeURIComponent(key)}'; return false;">${displayKey}</a></nav>`
            }).join('')}
          </ul>`
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
        <div>
            <div className="tab">
                <button id="configTab" className="tablinks" onClick={() => setActiveTab('Config')}>Config</button>
                <button id="dataCenterTab" className="tablinks" onClick={() => setActiveTab('Data Center')}>Data Center</button>
                <button id="notesConfigTab" className="tablinks" onClick={() => setActiveTab('Notes Config')}>Notes Config</button>
                <button id="notesTab" className="tablinks" onClick={() => setActiveTab('Notes')}>Notes</button>
                <button id="providedBackups" className="tablinks" onClick={() => setActiveTab('Provided Backups')}>Provided Backups</button>
            </div>
            <div className="h-screen w-screen overflow-hidden flex-col-center items-center justify-center gap-2">
            <Config fetchApiKeys={fetchApiKeys}></Config>
            <DataCenter messages={messages}></DataCenter>
            <NotesConfig 
                importNotes={importNotes}
                notesBackupProvider={notesBackupProvider} 
                notesBackedUpAt={notesBackedUpAt} 
                lastBackupSize={lastBackupSize} 
            ></NotesConfig>
            <Notes 
                searchNotes={searchNotes}
                notesBackupProvider={notesBackupProvider} 
                notesBackedUpAt={notesBackedUpAt} 
                lastBackupSize={lastBackupSize} 
                treeData={treeData}
            ></Notes>
            <ProvidedBackups backupsTimeMap={backupsTimeMap}></ProvidedBackups>
            </div>
        </div>
    );
}

export default Home;

function pathsToTree(paths) {
    const root = { name: 'root', children: {} };

    paths.forEach(path => {
        const parts = path.split('/');
        let currentNode = root;

        parts.forEach((part, index) => {
            if (!currentNode.children[part]) {
                currentNode.children[part] = { name: part, children: {} };
            }
            currentNode = currentNode.children[part];

            // If it's the last part, mark it as a file
            if (index === parts.length - 1) {
                currentNode.isFile = true;
            }
        });
    });

    // Helper function to convert the tree to Arborist format
    function convertToArboristFormat(node, id = 'root') {
        const children = Object.entries(node.children).map(([key, value]) =>
            convertToArboristFormat(value, `${id}/${key}`)
        );

        return {
            id,
            name: node.name,
            isLeaf: node.isFile,
            children: children.length > 0 ? children : undefined
        };
    }

    return [convertToArboristFormat(root)];
}
