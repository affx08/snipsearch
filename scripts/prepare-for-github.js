#!/usr/bin/env node

/**
 * Prepare SnipSearch for GitHub upload
 * This script helps organize and prepare the project for open-sourcing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Preparing SnipSearch for GitHub upload...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Function to check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Function to create directory if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

// Function to update placeholder values
function updatePlaceholders() {
  console.log('🔧 Updating placeholder values...');
  
  // Files that need username replacement
  const filesToUpdate = [
    'README.md',
    'CONTRIBUTING.md',
    'CHANGELOG.md',
    'SECURITY.md',
    'package.json',
    '.github/FUNDING.yml',
    '.github/dependabot.yml'
  ];

  const username = process.argv[2] || 'yourusername';
  
  filesToUpdate.forEach(file => {
    if (fileExists(file)) {
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/yourusername/g, username);
      fs.writeFileSync(file, content);
      console.log(`✅ Updated ${file}`);
    }
  });
}

// Function to check for required files
function checkRequiredFiles() {
  console.log('📋 Checking required files...');
  
  const requiredFiles = [
    'README.md',
    'LICENSE',
    'package.json',
    'CONTRIBUTING.md',
    'CODE_OF_CONDUCT.md',
    'SECURITY.md',
    'CHANGELOG.md',
    '.gitignore',
    'src/main/main.ts',
    'src/App.tsx',
    'assets/icon.ico'
  ];

  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (!fileExists(file)) {
      missingFiles.push(file);
    }
  });

  if (missingFiles.length > 0) {
    console.log('⚠️  Missing required files:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
  } else {
    console.log('✅ All required files present');
  }

  return missingFiles.length === 0;
}

// Function to check for build artifacts
function checkBuildArtifacts() {
  console.log('🔍 Checking build artifacts...');
  
  const buildDirs = ['dist', 'dist-electron', 'node_modules'];
  const shouldIgnore = ['dist', 'dist-electron'];
  
  buildDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      if (shouldIgnore.includes(dir)) {
        console.log(`✅ ${dir} exists and should be ignored by git`);
      } else {
        console.log(`📁 ${dir} exists`);
      }
    }
  });
}

// Function to run npm scripts
function runNpmScripts() {
  console.log('⚙️  Running npm scripts...');
  
  const scripts = [
    'npm run lint:check',
    'npm run type-check',
    'npm run format:check'
  ];

  scripts.forEach(script => {
    try {
      console.log(`Running: ${script}`);
      execSync(script, { stdio: 'inherit' });
      console.log(`✅ ${script} completed successfully`);
    } catch (error) {
      console.log(`⚠️  ${script} failed (this is okay for initial setup)`);
    }
  });
}

// Function to create .gitattributes
function createGitAttributes() {
  const gitAttributes = `# Auto detect text files and perform LF normalization
* text=auto

# Source files
*.ts text
*.tsx text
*.js text
*.jsx text
*.json text
*.md text
*.css text
*.html text

# Binary files
*.ico binary
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.exe binary
*.dll binary
*.so binary
*.dylib binary

# Archives
*.zip binary
*.tar.gz binary
*.rar binary

# Documents
*.pdf binary
*.doc binary
*.docx binary

# Scripts
*.bat text eol=crlf
*.cmd text eol=crlf
*.ps1 text eol=crlf
*.sh text eol=lf

# Config files
*.yml text
*.yaml text
*.toml text
*.ini text
*.cfg text

# Lock files
package-lock.json text
yarn.lock text
pnpm-lock.yaml text
`;

  fs.writeFileSync('.gitattributes', gitAttributes);
  console.log('✅ Created .gitattributes');
}

// Function to create .editorconfig
function createEditorConfig() {
  const editorConfig = `# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

# TypeScript and JavaScript files
[*.{ts,tsx,js,jsx}]
indent_size = 2

# JSON files
[*.json]
indent_size = 2

# Markdown files
[*.md]
trim_trailing_whitespace = false

# Windows batch files
[*.{bat,cmd}]
end_of_line = crlf

# PowerShell files
[*.ps1]
end_of_line = lf
`;

  fs.writeFileSync('.editorconfig', editorConfig);
  console.log('✅ Created .editorconfig');
}

// Function to create GitHub templates
function createGitHubTemplates() {
  console.log('📝 Creating GitHub templates...');
  
  ensureDir('.github');
  ensureDir('.github/ISSUE_TEMPLATE');
  ensureDir('.github/workflows');
  
  console.log('✅ GitHub templates directory structure created');
}

// Function to generate project summary
function generateProjectSummary() {
  console.log('\n📊 Project Summary:');
  console.log('==================');
  
  // Count files by type
  const fileTypes = {
    '.ts': 0,
    '.tsx': 0,
    '.js': 0,
    '.jsx': 0,
    '.json': 0,
    '.md': 0,
    '.css': 0,
    '.html': 0
  };

  function countFiles(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        countFiles(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (fileTypes.hasOwnProperty(ext)) {
          fileTypes[ext]++;
        }
      }
    });
  }

  countFiles('src');
  
  console.log('📁 Source files:');
  Object.entries(fileTypes).forEach(([ext, count]) => {
    if (count > 0) {
      console.log(`   ${ext}: ${count} files`);
    }
  });
  
  // Check package.json for dependencies
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const depCount = Object.keys(packageJson.dependencies || {}).length;
  const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
  
  console.log(`📦 Dependencies: ${depCount} production, ${devDepCount} development`);
  console.log(`🎯 Target: ${packageJson.build?.productName || 'Unknown'}`);
  console.log(`📄 License: ${packageJson.license || 'Unknown'}`);
}

// Main execution
function main() {
  console.log('🎯 SnipSearch GitHub Preparation Script\n');
  
  // Update placeholders
  updatePlaceholders();
  
  // Check required files
  const allFilesPresent = checkRequiredFiles();
  
  // Check build artifacts
  checkBuildArtifacts();
  
  // Create additional config files
  createGitAttributes();
  createEditorConfig();
  
  // Create GitHub templates structure
  createGitHubTemplates();
  
  // Run npm scripts (optional)
  if (process.argv.includes('--run-scripts')) {
    runNpmScripts();
  }
  
  // Generate project summary
  generateProjectSummary();
  
  console.log('\n🎉 Preparation complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Review and update placeholder values in files');
  console.log('2. Test the build process: npm run build && npm run dist:win');
  console.log('3. Initialize git repository: git init');
  console.log('4. Add files: git add .');
  console.log('5. Make initial commit: git commit -m "Initial commit"');
  console.log('6. Create repository on GitHub');
  console.log('7. Push to GitHub: git remote add origin <repo-url> && git push -u origin main');
  console.log('\n📚 Documentation created:');
  console.log('   - CONTRIBUTING.md (contribution guidelines)');
  console.log('   - CODE_OF_CONDUCT.md (community standards)');
  console.log('   - SECURITY.md (security policy)');
  console.log('   - CHANGELOG.md (version history)');
  console.log('   - .github/ (issue templates and workflows)');
  
  if (!allFilesPresent) {
    console.log('\n⚠️  Some required files are missing. Please create them before uploading to GitHub.');
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main }; 