function ProvidedBackups({ backupsTimeMap }) {
    return (
        <div id="Provided Backups" className="tabcontent">
            <h1 className="mb-2 flex-col-center">Provided Backups</h1>
            <div className="parent-container flex-col-center">
                <table className="backup-table">
                    <thead>
                        <tr>
                            <th>Node</th>
                            <th>Last Backup Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(backupsTimeMap).length > 0 ? (
                            Object.entries(backupsTimeMap).map(([node, time]) => (
                                <tr key={node}>
                                    <td>{node}</td>
                                    <td>{new Date(time).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">Currently not providing backups for anyone.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProvidedBackups;

