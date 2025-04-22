// commit.js
const { execSync } = require("child_process");

const message = process.argv.slice(2).join(" ");

if (!message) {
  console.error("❌ No commit message provided.");
  process.exit(1);
}

try {
  execSync(`git add .`);
  execSync(`git commit -m "${message}"`);
  execSync(`git push`, { stdio: "inherit" });
  console.log("✅ Commit and push done.");
} catch (err) {
  console.error("❌ Error during git operations", err.message);
}