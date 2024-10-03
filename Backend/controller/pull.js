const fs = require("fs").promises;
const path = require("path");
const firebasebucket = require("../config/firebaseSdk"); // Firebase SDK with bucket initialization

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".LalanGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    // List all files from the 'commits' directory in Firebase Storage
    const [files] = await firebasebucket.getFiles({
      prefix: "commits/",
    });

    for (const file of files) {
      const filePath = file.name; // The path of the file in Firebase Storage
      const commitDir = path.join(
        commitsPath,
        path.dirname(filePath).split("/").pop() // Directory for the local commit
      );

      await fs.mkdir(commitDir, { recursive: true }); // Create the local commit directory if it doesn't exist

      const localFilePath = path.join(repoPath, filePath); // Full local file path

      // Download the file from Firebase Storage to the local system
      await file.download({ destination: localFilePath });

      console.log(`File ${filePath} pulled from Firebase Storage.`);
    }
    console.log("All commits pulled from Firebase Storage.");
  } catch (err) {
    console.error("Unable to pull: ", err);
  }
}

module.exports = { pullRepo };
