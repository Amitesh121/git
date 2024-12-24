const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const zlib = require("zlib");

class HashObject {
  constructor(flag, filename) {
    this.flag = flag;
    this.filename = filename;
  }

  execute() {
    //make sure that the file is there
    const filename = path.resolve(this.filename);

    if (!fs.existsSync(filename)) {
      throw new Error(`file not found ${filename}`);
    }
    //read the file
    const filecontent = fs.readFileSync(filename);
    const filelength = filecontent.length;
    //create a blob
    const header = `blob ${filelength}\0`;
    const blob = Buffer.concat([Buffer.from(header), filecontent]);
    const hash = crypto.createHash("sha1").update(blob).digest("hex");

    if (this.flag && this.flag === "-w") {
      const folder = hash.slice(0, 2);
      const file = hash.slice(2);

      const completePath = path.join(process.cwd(), ".git", "objects", folder);

      if (!fs.existsSync(completePath)) {
        fs.mkdirSync(completePath);
      }

      const compressedData = zlib.deflateSync(blob);
      fs.writeFileSync(path.join(completePath, file), compressedData);
    }
    process.stdout.write(hash);
  }
}

module.exports = HashObject;