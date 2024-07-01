import { useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { useState, useEffect } from 'react';

function FileView() {
  const { filePath } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    // Fetch file content based on filePath
    // This is a placeholder, replace with actual API call
    const fetchContent = async () => {
      // const response = await fetch(`/api/file/${filePath}`);
      // const data = await response.text();
      // setContent(data);
      setContent('# Placeholder content\n\nReplace this with actual file content.');
    };
    fetchContent();
  }, [filePath]);

  return (
    <div>
      <h2>Viewing file: {filePath}</h2>
      <MDEditor
        value={content}
        onChange={setContent}
      />
    </div>
  );
}

export default FileView;