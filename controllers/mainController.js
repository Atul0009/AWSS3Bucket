import User from "../models/userModel.js";
import Upload from "../models/uploadModel.js";
import crypto from "crypto-js";
import fs from "fs";
import path from "path";

// ################### START ## functions for getting lists of files from multiple directories ################
async function listFilesFromDirectory(directoryPath) {
  try {
    const files = await fs.promises.readdir(directoryPath);
    return files.map((file) => path.join(file));
  } catch (error) {
    console.error(`Error reading directory ${directoryPath}: ${error.message}`);
    return [];
  }
}
async function listFilesFromDirectories(directories) {
  const allFiles = [];

  for (const directory of directories) {
    const files = await listFilesFromDirectory(directory);
    allFiles.push(...files);
  }

  return allFiles;
}

// ############### END ######################################

export default {
  async register(req, res) {
    try {
      const { name } = req.body;
      var str = name + new Date().getTime();
      const apiKey = crypto.SHA256(str).toString().slice(0, 20);

      let user = new User({ name, apiKey });
      await user.save();
      return res.status(200).json({ success: "User Created", user: user });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async createBucket(req, res) {
    const folderName = req.body.folderName;
    if (!folderName) {
      return res.status(400).json({ message: "Folder Name is Mandatory" });
    }

    const rootFolder = "rootFolder";
    const folderPath = `${rootFolder}/${folderName}`;

    try {
      if (fs.existsSync(rootFolder)) {
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
          return res.status(200).json({ message: "Bucket Created" });
        }
      } else {
        fs.mkdirSync(rootFolder);
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
          return res.status(200).json({ message: "Bucket Created" });
        }
      }
      return res.status(200).json({ message: "Bucket Already Exist" });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async getAllBuckets(req, res) {
    try {
      const rootPath = path.join("rootFolder");

      fs.readdir(rootPath, (err, files) => {
        const directories = files.filter((file) => {
          const filePath = path.join(rootPath, file);
          return fs.statSync(filePath).isDirectory();
        });
        if (directories) {
          return res.status(200).json({ success: directories });
        }
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async uploadFile(req, res) {
    try {
      if (req.file) {
        const fileFullPath = req.file.destination + req.file.filename;
        const uploadedData = new Upload({
          userId: req.user._id,
          filename: req.file.filename,
          mimeType: req.file.mimetype,
          path: fileFullPath,
        });
        await uploadedData.save();
        return res.status(200).json({ message: "File Uploaded Successfully" });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send(err);
    }
  },

  async getAllFiles(req, res) {
    try {
      const bucketName = req.body.bucketName;
      if (!bucketName) {
        return res.staus(400).json({ message: "Please provide A bucket name" });
      }
      const directoryPath = path.join(`rootfolder/${bucketName}`);
      fs.readdir(directoryPath, (err, files) => {
        const allFiles = files.filter((file) => {
          const filePath = path.join(directoryPath, file);
          return fs.statSync(filePath).isFile();
        });
        if (allFiles.length == 0) {
          return res.status(404).json({ message: "No files found" });
        }
        return res.status(200).json({ allFiles: allFiles });
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async deleteFileFromBucket(req, res) {
    try {
      const { folderName, fileName } = req.body;
      if (!folderName) {
        return res.status(400).json({ message: "folderName is required" });
      }

      if (!fileName) {
        return res.status(400).json({ message: "fileName is required" });
      }

      const rootFolder = "rootFolder";
      const filePath = `${rootFolder}/${folderName}/${fileName}`;

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
      });
      return res.status(200).json({ message: "File deleted successfully" });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async getAllLists(req, res) {
    try {
      const directories = [
        "rootFolder/folder1",
        "rootFolder/folder2",
        // Add more directory paths as needed
      ];

      const result = await listFilesFromDirectories(directories);
      return res.status(200).json({ fileLists: result });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err);
    }
  },

  async updateFile(req, res) {
    try {
      const { bucketName, fileName } = req.body;
      const directoryPath = `rootFolder/${bucketName}`;
      const filePath = path.join(directoryPath, fileName);

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading the file:", err);
          return;
        }

        // Make modifications to the content (for example, add text)
        const updatedContent =
          data + "\nThis is new content added to the file.";

        fs.writeFile(filePath, updatedContent, "utf8", (err) => {
          if (err) {
            console.error("Error writing the file:", err);
          }
        });
      });
      return res.status(200).json({ message: " File updated successfully." });
    } catch (err) {
      return res.status(400).send(err);
    }
  },
};
