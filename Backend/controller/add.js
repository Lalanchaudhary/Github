const fs = require("fs").promises;
const path = require("path");

const addRepo = async (filePath) => {
  const RepoPath = path.resolve(process.cwd(), ".LalanGit");
  const staggingPath = path.join(RepoPath, "stagging");
  const MainPath = process.cwd(); // No need to append "Backend" since you're already in that folder

  try {
    await fs.mkdir(staggingPath, { recursive: true }); // Ensure the stagging folder exists

    if (filePath === "all") {
      const allDirs = await fs.readdir(MainPath, { withFileTypes: true });

      for (const dirent of allDirs) {
        const DirPath = path.join(MainPath, dirent.name);

        // Skip node_modules and .LalanGit directories
        if (dirent.name === 'node_modules' || dirent.name === '.LalanGit') {
          continue;
        }

        if (dirent.isDirectory()) {
          // Handle copying directory contents recursively
          await copyDirectory(DirPath, staggingPath);
        } else if (dirent.isFile()) {
          // Copy individual files
          const fileName = path.basename(DirPath);
          await fs.copyFile(DirPath, path.join(staggingPath, fileName));
        }
      }
    } else {
      // Copy a single file
      const fileName = path.basename(filePath);
      await fs.copyFile(filePath, path.join(staggingPath, fileName));
      console.log(`File ${fileName} added to stagging area`);
    }
  } catch (err) {
    console.log("Error occurred while adding file: ", err);
  }
};

// Helper function to recursively copy directory contents
const copyDirectory = async (srcDir, destDir) => {

    console.log(`Creating directory: ${destDir}`);
    await fs.mkdir(destDir, { recursive: true });
  
    const items = await fs.readdir(srcDir, { withFileTypes: true });
  
    for (const item of items) {
      const srcPath = path.join(srcDir, item.name);
      const destPath = path.join(destDir, item.name);
      console.log(`Processing ${srcPath}`);
  
      if (item.isDirectory()) {
        console.log(`Copying directory: ${srcPath} to ${destPath}`);
        await copyDirectory(srcPath, destPath);
      } else if (item.isFile()) {
        console.log(`Copying file: ${srcPath} to ${destPath}`);
        await fs.copyFile(srcPath, destPath);
      }
    }
  };
  

module.exports = addRepo;
