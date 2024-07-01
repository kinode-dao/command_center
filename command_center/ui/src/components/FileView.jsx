import { useParams } from 'react-router-dom';

function FileView() {
  const { filePath } = useParams();
  
  // Use filePath to fetch and display file content
  return <div>Viewing file: {filePath}</div>;
}

export default FileView;