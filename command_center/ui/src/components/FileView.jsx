import MDEditor from '@uiw/react-md-editor';
import { useState, useEffect } from 'react';
import '../App.css';

function FileView({note, filePath}) {
    const [content, setContent] = useState('');
    useEffect(() => {
        console.log("NOTE", note)
        setContent(note);
    }, [note]);

    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col">
            <h2 className="p-4 flex-shrink-0">Editing file: {filePath}</h2>
            <MDEditor
                value={content}
                onChange={setContent}
                className="flex-grow"
                preview="edit"
            />
            <div className="flex justify-end p-4">
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        // Here you would implement the logic to save the edited content
                        console.log('Saving content:', content);
                        // You might want to call an API or update state in the parent component
                    }}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default FileView;