const fs = require('fs');
const { exec } = require('child_process');

const folderToDelete = 'dist';
const folderToCreate = 'dist';
const folderToZip = 'plugin';
const zipFilePath = 'dist/wix-headless-example.zip';

// Delete the folder "dist" if it exists
if (fs.existsSync(folderToDelete)) {
  fs.rmSync(folderToDelete, { recursive: true });
}

// Create an empty folder "dist"
fs.mkdirSync(folderToCreate);

// Zip all the content of the folder "plugin" into "dist/plugin.zip"
exec(`zip -r ${zipFilePath} ${folderToZip}/*`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Folder ${folderToZip} has been zipped successfully into ${zipFilePath}`);
});
