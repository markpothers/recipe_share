const fs = require("fs");
const path = require("path");

const sourceArg = process.argv[2];

if (!sourceArg) {
	console.error("Usage: node ./buildScripts/applyEnvFile.js <env-file>");
	process.exit(1);
}

const projectRoot = path.resolve(__dirname, "..");
const sourcePath = path.resolve(projectRoot, sourceArg);
const targetPath = path.resolve(projectRoot, ".env");

if (!fs.existsSync(sourcePath)) {
	console.error(`Env file not found: ${sourceArg}`);
	process.exit(1);
}

const contents = fs.readFileSync(sourcePath, "utf8");
fs.writeFileSync(targetPath, contents, "utf8");

console.log(`Activated env file: ${sourceArg}`);
