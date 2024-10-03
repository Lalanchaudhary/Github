const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function deleteFile(filePath, isDir = false) {
    try {
      if (isDir) {
        await fs.rm(filePath, { recursive: true, force: true }); // Recursively remove directory
        console.log(`Directory ${filePath} deleted!`);
      } else {
        await fs.unlink(filePath); // Remove file
        console.log(`File ${filePath} deleted!`);
      }
    } catch (err) {
      console.error(`Error deleting ${isDir ? 'directory' : 'file'} ${filePath}:`, err);
    }
  }

  
const commit = async (message) => {
    const repoPath = path.resolve(process.cwd(), ".LalanGit");
    const stagedPath = path.join(repoPath, "stagging");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitId = uuidv4();  // Call the function to generate the UUID
        const commitDir = path.join(commitsPath, commitId);
        
        await fs.mkdir(commitDir, { recursive: true });  // Create commit directory

        const files = await fs.readdir(stagedPath);  // Read staged files

        // Copy each file from staging area to commit directory
        for (const file of files) {
            await fs.copyFile(path.join(stagedPath, file), path.join(commitDir, file));
            await deleteFile(path.join(stagedPath, file));
        }

        // Write commit metadata (message and date) to commit.json
        await fs.writeFile(
            path.join(commitDir, "commit.json"),
            JSON.stringify({ message, date: new Date().toISOString() })
        );

        console.log(`Commit ${commitId} created with message: ${message}`);
    } catch (err) {
        console.error("Error occurred in committing", err);
    }
};

module.exports = commit;
