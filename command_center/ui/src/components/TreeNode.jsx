function TreeNode({ node, style, dragHandle }) {

  const handleClick = () => {
    if (!node.isLeaf) {
      node.toggle();
    } else {
      console.log('Clicked file:', node.data.name);
      const path = `/file/${encodeURIComponent(node.data.id)}`;
      window.location.hash = path;
    }
  };

  return (
    <div style={style} ref={dragHandle}>
      <div onClick={handleClick} style={{ cursor: 'pointer', userSelect: 'none' }}>
        {node.isLeaf ? '📄 ' : node.isOpen ? '📂 ' : '📁 '}
        {node.data.name}
      </div>
    </div>
  );
};

export default TreeNode;