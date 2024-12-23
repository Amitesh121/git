const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const crypto = require("crypto"); // Import the crypto module

class HashObject {
  constructor(tag, filename) {
    this.tag = tag;
    this.filename = filename;
  }

  execute() {
    const tag = this.tag;
    const filename = this.filename;

    switch (tag) {
      case "-w": {
        try {
          // Read the file content
          const data = fs.readFileSync(filename, "utf-8");

          // Create a buffer from the file data
          const dataBuffer = Buffer.from(data, "utf-8");

          // Compute the SHA-1 hash
          const hash = crypto.createHash("sha1");
          hash.update(`blob ${dataBuffer.length}\0`); // Include Git's object header
          const sha1 = hash.digest("hex");

          // Construct the folder and file paths
          const folder = sha1.slice(0, 2);
          const file = sha1.slice(2);
          const completePath = path.join(
            process.cwd(),
            ".git",
            "objects",
            folder,
            file
          );

          // Ensure the folder exists
          fs.mkdirSync(path.dirname(completePath), { recursive: true });

          // Compress and write the file content
          fs.writeFileSync(completePath, zlib.deflateSync(dataBuffer));

          console.log(sha1); // Output the hash
        } catch (error) {
          console.error(`Error: ${error.message}`);
        }
        break;
      }

      default:
        console.error(`Unsupported tag: ${tag}`);
    }
  }
}

module.exports = HashObject;
