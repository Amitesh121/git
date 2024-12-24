const fs = require("fs");
const path = require("path");

const GitClient = require("./git/client");
const CatFile = require("./git/commands/cat-file");
const HashObject = require("./git/commands/hash-object");
// You can use print statements as follows for debugging, they'll be visible when running tests
// .

const gitclient = new GitClient();

// Uncomment this block to pass the first sflage
const command = process.argv[2];

switch (command) {
  case "init":
    createGitDirectory();
  case "cat-file":
    handleCatCommands();
  case "hash-object":
    handleHashObjectCommands();
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

  fs.writeFileSync(
    path.join(process.cwd(), ".git", "HEAD"),
    "ref: refs/heads/main\n"
  );
  console.log("Initialized git directory");
}

function handleCatCommands() {
  const flag = process.argv[3]; //cat-file -p djejd12122
  const commitHASH = process.argv[4];

  const command = new CatFile(flag, commitHASH);
  gitclient.run(command);
}

function handleHashObjectCommands() {
  let flag  = process.argv[3]; //cat-file -p djejd12122
  let filename = process.argv[4];

  if (!filename) {
    filename = flag;
    flag = null;
  }

  const command = new HashObject(flag, filename);
  gitclient.run(command);
 
}
