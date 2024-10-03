const fs = require('fs').promises; // Use promise-based fs
const path = require('path');
const firebasebucket = require('../config/firebaseSdk'); // Firebase bucket setup

// Upload a file to Firebase Storage
const uploadFile = async (filePath, destination) => {
  try {
    // Upload file from local path to Firebase Storage bucket
    await firebasebucket.upload(filePath, {
      destination: destination, // Path in Firebase Storage
      public: true, // Make the file publicly accessible
    });
    console.log(`${filePath} uploaded to ${destination}`);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Ensure the error is propagated
  }
};

// Function to delete a file or directory locally
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

// Function to push commits to Firebase Cloud Storage
const push = async () => {
  const repoPath = path.resolve(process.cwd(), '.LalanGit');
  const commitsPath = path.join(repoPath, 'commits');

  try {
    const commitDirs = await fs.readdir(commitsPath); // List commit directories
    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir); // Path to commit directory
      const files = await fs.readdir(commitPath); // List files in commit directory

      for (const file of files) {
        const filePath = path.join(commitPath, file); // Full path to file

        // Define a destination path in Firebase storage (e.g., commits/commitId/file)
        const destination = `commits/${commitDir}/${file}`;

        try {
          // Upload file to Firebase
          await uploadFile(filePath, destination); // Use filePath for uploading

          // Delete the file locally after successful upload
          await deleteFile(filePath);
        } catch (error) {
          console.error(`Error processing file ${filePath}:`, error);
        }
      }

      // Delete the commit directory after all its files have been uploaded and deleted
      await deleteFile(commitPath, true); // true indicates it's a directory
      console.log(`Pushed all files from commit ${commitDir}!`);
    }
    console.log('All commits pushed successfully!');
  } catch (err) {
    console.error('Error occurred during push:', err);
  }
};

module.exports = push;
