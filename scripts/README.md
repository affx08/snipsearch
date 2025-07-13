# Scripts

This directory contains utility scripts for the SnipSearch project.

## Available Scripts

### `prepare-for-github.js`

A comprehensive script to prepare the SnipSearch project for GitHub upload.

**Usage:**
```bash
# Basic preparation
node scripts/prepare-for-github.js

# With custom username
node scripts/prepare-for-github.js yourusername

# With script validation
node scripts/prepare-for-github.js yourusername --run-scripts
```

**What it does:**
- Updates placeholder values in documentation files
- Checks for required files and build artifacts
- Creates additional configuration files (.gitattributes, .editorconfig)
- Validates the project structure
- Generates a project summary
- Optionally runs npm scripts for validation

**Files created/updated:**
- `.gitattributes` - Git file handling configuration
- `.editorconfig` - Editor configuration
- Updates placeholder values in README.md, CONTRIBUTING.md, etc.

## Running Scripts

All scripts in this directory can be run using Node.js:

```bash
# Make sure you're in the project root
cd /path/to/snipsearch

# Run a script
node scripts/script-name.js [arguments]
```

## Script Development

When creating new scripts:

1. **Use Node.js**: All scripts should be written in Node.js for consistency
2. **Add shebang**: Include `#!/usr/bin/env node` at the top
3. **Error handling**: Include proper error handling and exit codes
4. **Documentation**: Add JSDoc comments explaining the script's purpose
5. **Logging**: Use console.log for user feedback
6. **Modular**: Export functions for testing and reuse

### Script Template

```javascript
#!/usr/bin/env node

/**
 * Script Name
 * Brief description of what this script does
 */

const fs = require('fs');
const path = require('path');

function main() {
  console.log('Starting script...');
  
  try {
    // Script logic here
    console.log('Script completed successfully');
  } catch (error) {
    console.error('Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
```

## Common Patterns

### File Operations
```javascript
// Check if file exists
if (fs.existsSync(filePath)) {
  // File exists
}

// Read file content
const content = fs.readFileSync(filePath, 'utf8');

// Write file content
fs.writeFileSync(filePath, content);
```

### Directory Operations
```javascript
// Create directory if it doesn't exist
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// List directory contents
const items = fs.readdirSync(dirPath);
```

### Command Execution
```javascript
const { execSync } = require('child_process');

try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully');
} catch (error) {
  console.log('Build failed');
}
```

## Testing Scripts

Scripts can be tested by importing them as modules:

```javascript
const { main } = require('./scripts/prepare-for-github.js');

// Test the script
main();
```

## Contributing

When adding new scripts:

1. Follow the existing patterns
2. Add proper error handling
3. Include usage examples in this README
4. Test the script thoroughly
5. Update this documentation 