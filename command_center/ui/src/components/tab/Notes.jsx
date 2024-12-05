import { useEffect } from "react";
import TreeNode from "../TreeNode";
import { Tree } from "react-arborist";

function Notes({
  searchNotes,
  notesBackupProvider,
  notesBackedUpAt,
  lastBackupSize,
  treeData,
}) {

  return (
    <div id="Notes" className="tabcontent">
      <h1 className="mb-2 flex-col-center">Notes</h1>
      <div className="flex-center gap-2">
        <input type="text" id="notesSearch" placeholder="Search Notes" />
      </div>
      <div className="parent-container flex-col-center">
        <button onClick={() => searchNotes()}>Search</button>
        <div className="flex-col-center">
          <span id="notesResult"></span>
        </div>
      </div>
      <div className="notes-tree" style={{ height: "400px", width: "300px" }}>
        <Tree
          key={JSON.stringify(treeData)}
          initialData={treeData}
          openByDefault={true}
          width={300}
          height={400}
          indent={24}
          rowHeight={36}
          overscanCount={1}
        >
          {TreeNode}
        </Tree>
      </div>
    </div>
  );
}

export default Notes;
