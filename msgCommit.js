// commit.js
const { execSync } = require('child_process')

const POSITION_FOR_SLICE_PASS = 2
const message = process.argv.slice(POSITION_FOR_SLICE_PASS).join(' ')

if (!message) {
  // eslint-disable-next-line no-console
  console.error('❌ No commit message provided.')
  process.exit(1)
}

try {
  execSync ('git add .')
  execSync (`git commit -m "${message}"`)
  execSync ('git push', { stdio: 'inherit' })
  // eslint-disable-next-line no-console
  console.log('✅ Commit and push done.')
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('❌ Error during git operations', err.message)
}
