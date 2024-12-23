const path = require("path");
const fs = require("fs");
const zlib = require("zlib");

class CatFile {
  constructor(flag, commitHASH) {
    // Initialize flag and commitHASH
    this.flag = flag;
    this.commitHASH = commitHASH;
  }

  execute() {
    const flag = this.flag;
    const commitHASH = this.commitHASH;

    switch (flag) {
      case "-p":
        {
          try {
            // Split commit hash into folder and file parts
            const folder = commitHASH.slice(0, 2);
            const file = commitHASH.slice(2);

            // Construct the complete path to the Git object file
            const completePath = path.join(
              process.cwd(),
              ".git",
              "objects",
              folder,
              file
            );

            //console.log(`Debug: Checking path: ${completePath}`);

            // Check if the file exists
            if (!fs.existsSync(completePath)) {
              throw new Error(`Not a valid object name: ${commitHASH}`);
            }

           // console.log(`Debug: File exists. Reading file contents.`);

            // Read the file contents
            const fileContents = fs.readFileSync(completePath);

            //console.log(`Debug: File contents read. Decompressing...`);

            // Decompress the file contents
            const outputBuffer = zlib.inflateSync(fileContents);

            //console.log(`Debug: Decompression successful.`);

            // Convert the decompressed buffer to a string
            const output = outputBuffer.toString().split("\x00")[1];

            //console.log(`Debug: File output:\n${output}`);

            // Output the decompressed content
            process.stdout.write(output);
          } catch (error) {
            console.error(`Error: ${error.message}`);
          }
        }
        break;

      
    }
  }
}

module.exports = CatFile;
