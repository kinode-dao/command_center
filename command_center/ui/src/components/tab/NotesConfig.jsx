function NotesConfig({ importNotes, notesBackupProvider, notesBackedUpAt, lastBackupSize,  }) {
  
    const backupRequest = async (node_id, password) => {
        console.log("making backup request");
        try {
          const response = await fetch(
            "/main:command_center:appattacc.os/backup_request",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                BackupRequest: {
                  node_id,
                  size: 0,
                  password_hash: password, // todo hash it
                },
              }),
            }
          );
          const resp = await response.json();
          console.log("response:", resp);
        } catch (error) {
          console.error("error on backup:", error);
        }
      };
  
    return (
    <div id="Notes Config" className="tabcontent">
      <div id="importNotesDiv" className="flex-col-center">
        <h1 className="mb-2 flex-col-center">Import Notes</h1>
        <div className="parent-container flex-col-center">
          <input
            type="file"
            id="folderInput"
            onChange={(e) => importNotes(e)}
            webkitdirectory="true"
            multiple
            style={{ display: "none" }}
          />
          <label htmlFor="folderInput" className="button">
            Choose Files
          </label>
          <div className="flex-col-center">
            <span id="importNotesResult"></span>
          </div>
        </div>
      </div>
      <div className="mb-16"></div>
      <div className="notesBackupStatus">
        <div id="backupStatus" className="flex-col-center">
          <span id="lastBackupTime">Last backup:</span>
          <>
            <span id="notesBackupProvider">
              Provider: {notesBackupProvider}
            </span>
            <span id="lastBackupTime">
              Time:{" "}
              {notesBackedUpAt ? notesBackedUpAt.toLocaleString() : "Unknown"}
            </span>
            <span id="lastBackupSize">Size: {lastBackupSize || "Unknown"}</span>
          </>
        </div>
      </div>
      <div id="backupNotesDiv" className="flex-col-center">
        <h1 className="mb-2 flex-col-center">Backup Notes</h1>
        <div className="flex-col-center gap-2">
          <input type="text" id="backupNodeId" placeholder="Enter Node ID" />
          <input
            type="password"
            id="backupPassword"
            placeholder="Enter Password"
          />
          <button
            onClick={() => {
              backupRequest(document.getElementById("backupNodeId").value, document.getElementById("backupPassword").value);
            }}
          >
            Backup Your Notes
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotesConfig;
