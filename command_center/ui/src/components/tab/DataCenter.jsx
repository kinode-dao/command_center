function DataCenter({ messages }) {
    return (
        <div id="Data Center" className="tabcontent">
            <h1 className="mb-2 flex-col-center">Latest Chat Updates</h1>
            <table id="messageContainer" className="mb-2">
                <thead>
                    <tr>
                        {/* <th className="table-chat-id">Chat ID</th>
                        <th className="table-message-id">Message ID</th>
                        <th className="table-date">Date</th> */}
                        <th className="table-username">Username</th>
                        <th className="table-text">Text</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map((message, index) => (
                        <tr key={index}>
                            {/* <td>{message.chat_id}</td>
                            <td>{message.message_id}</td>
                            <td>{formatDate(message.date)}</td> */}
                            <td>{message.username}</td>
                            <td>{message.text}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataCenter;