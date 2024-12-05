# Command Center

### Directory Structure

```
command_center
│   ├── README.md
│   ├── command_center
│   │   ├── ai_chatbot_demo
│   │   ├── command_center
│   │   ├── pkg
│   │   ├── ui
│   │   └── worker
│   ├── files_lib
```

To disambiguate the 3 levels of `command_center`:
- outermost - `command_center` the git repo
- middle - `command_center` the package
- innermost - `command_center` the process

`files_lib` is a package, used as a shared library by the `command_center` and `worker` processes.

### Quick Start

For the purposes of this tutorial:
- `node.os` is at `home`
- `node2.os` is at `home2`

Boot up 2 real nodes. Real ones are preferable because we are working with file storage which is easier to persist this way.

```bash
./binary/kinode home
./binary/kinode home2
```

```bash
cd command_center/command_center
kit b && kit s && kit s -p 8081
```
- due to a current bug in kit, you can use `kit b <<< y && kit s && kit s -p 8081` instead, if you don't want to manually press 'y' every time

```bash
cd command_center/command_center/ui
npm i
npm run dev
```

### Working Functionality

In the UI you should be able to use the following tabs:
- Config - set up tg bot
- Data Center - see tg chat in real time
- Import Notes - import notes via ui
- Notes - check backup status, search notes, view directory structure, and view notes in markdown
- Provided backups - see backups which you are providing for other nodes

UI functionality related to backups is a work in progress, so it may not work correctly.

### Dev Setup for Backups

`node.os` at `home` folder will be backing up their notes to `node2.os` at `home2` folder.

Import notes via ui on `node.os`, they should show up here:
```bash 
cd home/vfs/command_center:appattacc.os/files
ls
```

Throughout the rest of the tutorial, replace `node.os` and `node2.os` with the node ids of your nodes.

#### Backing Up

To back up the notes, in `node.os` terminal, run:
```
m node.os@main:command_center:appattacc.os '{"BackupRequest": {"node_id": "node2.os", "size": 0, "password_hash": "somehash"}}'
```

Wait until in the `node2.os` terminal you see a message like the following:
```
command_center:appattacc.os: command_center worker: done: exiting, took 123.456ms
```

In `node2.os` `home2`, you should find a folder called `node.os`:
``` bash
cd home2/vfs/command_center:appattacc.os/encrypted_storage/
ls
```

Inside that folder should be a bunch of encrypted files
```bash
cd node.os
ls
```

#### Retrieving Backup

To retrieve the backup to `node.os`, in `node.os` terminal, run:
```bash
m node.os@main:command_center:appattacc.os '{"BackupRetrieve": {"node_id": "node2.os"}}'
```

Wait until in the `node1.os` terminal you see a message like the following:
```
command_center:appattacc.os: command_center worker: done: exiting, took 123.456ms
```

In `node.os` `home`, you should find a folder called `retrieved_encrypted_backup` containing the same encrypted files which are backed up to `node2.os`:
```bash
cd home/vfs/command_center:appattacc.os/retrieved_encrypted_backup
ls
```

#### Decrypting Retrieved Backup

Warning: this will overwrite any changes to the notes you made in the `files` directory in the meantime.

To decrypt this data, in `node.os` terminal, run:
```bash
m node.os@main:command_center:appattacc.os '{"Decrypt": {"password_hash": "somehash"}}'
```

In `node.os` `home`, look at `files`, they should contain the decrypted data.
```bash
cd home/vfs/command_center:appattacc.os/files
ls
```

### TODO Functionality
- the commands shown above need to be connected to the ui
- the ui also needs to correctly surface backup status 
    - for client node: when was the last time data was backed up
    - for server node: all nodes which are backing up data to this node, and corresponding statuses
- a setting which allows a node to say: "I provide backups" or "I do not provide backups". Additionally, whitelisting and blacklisting by arbitrary criteria can be done.
- editing notes via markdown and propagating the changes to backend, then to backup
- vector search your notes

### Backup Diagrams

- [ClientRequest::BackupRequest](https://swimlanes.io/#jZFBUsMwDEX3PoUOQDmAFywIG7bJMCyJxxFUE1dObRlmenocp9AWp8DO0vz//fwtJA413Bs7Er/B06SUDwMGDdYRssCHDyOGm6/R7oYXmw/zKmJ4x7C2WkxKVSbY3NU2DX1ThC3uE0bResZJ03HslaosZznLXTnjuRy+Mx6ZhIyjA7ZokbJ0EVyLq1hzZFeELcbJc8QfXKd14/mVwq6/8uCLJn8D7ZCHM8wL3z9e3GwTjz0o9oJzp2WMYAJmZw4SD7JFCKWO+bePyYmFHBjnYDBigGKR364ArHW0QHRiJEWtHzzjqeEK/U/nJw==)

- [ClientRequest::BackupRetrieve](https://swimlanes.io/#jZE9TgQxDIX7nMIHAA6QgoLdhnamoGSizBMbTUiWxFkkTk8m2V8SBJ1t+X16z2bDFpIGcDA4GPdGT0ovaS+EDzOCJG0NHNOnDwvC3anV7/OrzsU6iggHhN6oioRoRHT/eAuWNL2UYsBHQmQpn51ho6z5wgANk3F1YfoF17jIyE1ZPCNrsmNUTCKKRnRF+tvYCDdf2erCGq8ZOJbFAXHvXcRPX6f5hVid/ONmm11yy0TCecYav7SRVEAOlXXsiXegUA66/vpITo6NJWUtzYoVmVjWH86XbgzcxKkmRlacopRb77rWe//pKsU3)