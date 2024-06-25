use kinode_process_lib::{Address, NodeId};
use serde::{Deserialize, Serialize};

// ui -> client node
#[derive(Serialize, Deserialize, Debug)]
pub enum UiRequest {
    BackupRequest {
        node_id: NodeId,
        size: u64,
        password_hash: String,
    },
    BackupRetrieve {
        node_id: NodeId,
    },
    Decrypt {
        password_hash: String,
    },
}

// client node -> server node
#[derive(Serialize, Deserialize, Debug)]
pub enum ClientRequest {
    // telling the server which data size to expect
    BackupRequest { size: u64 },
    BackupRetrieve { worker_address: Address },
}

// server node -> client node
#[derive(Serialize, Deserialize, Debug)]
pub enum ServerResponse {
    BackupResponse(BackupResponse),
}

#[derive(Serialize, Deserialize, Debug)]
pub enum BackupResponse {
    Confirm { worker_address: Address },
    Decline,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum WorkerRequest {
    Initialize {
        request_type: WorkerRequestType,
        uploader_node: Option<NodeId>,
        target_worker: Option<Address>,
        password_hash: Option<String>,
    },
    Chunk {
        request_type: WorkerRequestType,
        done: bool,
        file_name: String,
    },
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum WorkerRequestType {
    BackingUp,
    RetrievingBackup,
}
