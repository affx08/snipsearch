# GitHub Setup Guide for SnipSearch

This guide will help you set up the SnipSearch project on GitHub with proper releases and documentation.

## 🚀 Quick Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `snipsearch`
3. Make it public
4. Don't initialize with README (we already have one)

### 2. Update Repository URLs

Update the following files with your actual GitHub username:

- `package.json` - Replace `yourusername` with your actual GitHub username
- `README.md` - Replace `yourusername` with your actual GitHub username

### 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: SnipSearch v1.0.0"
git branch -M main
git remote add origin https://github.com/yourusername/snipsearch.git
git push -u origin main
```

## 📦 Creating Releases

### Manual Release

1. **Build the installer**:
   ```bash
   npm run dist:win
   ```

2. **Create a GitHub release**:
   - Go to your repository on GitHub
   - Click "Releases" → "Create a new release"
   - Tag: `v1.0.0`
   - Title: `SnipSearch v1.0.0`
   - Description: Use the changelog from `CHANGELOG.md`
   - Upload the installer: `dist-electron/SnipSearch Setup 1.0.0.exe`

### Automated Release (Recommended)

The project includes GitHub Actions for automated releases:

1. **Create a new tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **GitHub Actions will automatically**:
   - Build the application
   - Create a Windows installer
   - Create a GitHub release
   - Upload the installer

## 🔧 Repository Settings

### 1. Enable GitHub Actions

1. Go to Settings → Actions → General
2. Enable "Allow all actions and reusable workflows"
3. Save

### 2. Set up Branch Protection

1. Go to Settings → Branches
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Include administrators

### 3. Configure Issues

1. Go to Settings → Features
2. Enable Issues
3. Enable Discussions (optional)

## 📋 Repository Structure

```
snipsearch/
├── .github/
│   └── workflows/
│       └── release.yml          # Automated releases
├── src/                         # Source code
├── assets/                      # App icons
├── dist-electron/               # Built installer (gitignored)
├── README.md                    # Main documentation
├── CONTRIBUTING.md              # Contributing guidelines
├── LICENSE                      # MIT License
├── CHANGELOG.md                 # Version history
├── SECURITY.md                  # Security policy
├── CODE_OF_CONDUCT.md           # Community guidelines
├── install.bat                  # Windows installation script
├── install.ps1                  # PowerShell installation script
└── package.json                 # Project configuration
```

## 🎯 GitHub Features

### Issues

- **Bug reports**: Use the bug report template
- **Feature requests**: Use the feature request template
- **Questions**: Use GitHub Discussions

### Pull Requests

- All changes should go through pull requests
- Require reviews before merging
- Use conventional commit messages

### Releases

- Tagged releases with installers
- Automated via GitHub Actions
- Include changelog and release notes

## 🔐 Security

### Security Policy

The project includes a `SECURITY.md` file that:
- Explains how to report vulnerabilities
- Lists supported versions
- Provides contact information

### Dependencies

- Regular dependency updates via Dependabot
- Security scanning via GitHub Actions
- Automated vulnerability alerts

## 📊 Analytics

### GitHub Insights

- Traffic analytics
- Contributor insights
- Repository statistics

### Badges

The README includes badges for:
- License status
- Node.js version
- Build status
- Release downloads

## 🚀 Next Steps

1. **Update repository URLs** in all files
2. **Push to GitHub** with initial commit
3. **Create first release** (v1.0.0)
4. **Set up branch protection**
5. **Enable GitHub Actions**
6. **Share the repository** with the community

## 📞 Support

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Security**: Email for security vulnerabilities (see SECURITY.md)

---

**Happy coding! 🎉** 