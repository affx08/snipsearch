# Contributing to SnipSearch

Thank you for your interest in contributing to SnipSearch! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** - Search the [issues page](https://github.com/yourusername/snipsearch/issues) to see if the bug has already been reported
2. **Create a new issue** - Use the bug report template and include:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (Windows version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. **Check existing issues** - Search for similar feature requests
2. **Create a feature request** - Use the feature request template
3. **Provide context** - Explain why this feature would be useful
4. **Include mockups** - If possible, include UI mockups or examples

### Code Contributions

#### Prerequisites

- Node.js 18+ and npm
- Git
- Windows 10/11 (for testing)
- Basic knowledge of React, TypeScript, and Electron

#### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/snipsearch.git
   cd snipsearch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Guidelines

##### Code Style

- **TypeScript**: Use strict TypeScript with proper type annotations
- **React**: Use functional components with hooks
- **Material-UI**: Follow Material 3 design principles
- **Naming**: Use descriptive names for variables, functions, and components
- **Comments**: Add comments for complex logic

##### File Structure

```
src/
├── components/          # React components
│   ├── Home.tsx       # Main application view
│   ├── Settings.tsx   # Settings panel
│   └── ...
├── main/              # Electron main process
│   ├── main.ts        # Main application logic
│   └── preload.ts     # Preload script
├── types/             # TypeScript type definitions
└── App.tsx           # Root React component
```

##### Testing

- Test your changes thoroughly on Windows
- Test with different Windows themes (light/dark)
- Test hotkey functionality
- Test system tray integration

##### Building

Before submitting a PR, ensure the app builds successfully:

```bash
npm run build
npm run dist:win
```

#### Pull Request Process

1. **Update documentation** - Update README.md if needed
2. **Add tests** - If applicable, add tests for new functionality
3. **Update version** - Update version in package.json if needed
4. **Create PR** - Use the PR template and include:
   - Clear description of changes
   - Screenshots for UI changes
   - Testing instructions
   - Related issue number

#### Commit Message Guidelines

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(hotkeys): add support for Ctrl+Shift combinations`
- `fix(ui): resolve dark mode toggle issue`
- `docs(readme): update installation instructions`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 🛠️ Development Tools

### Recommended IDE Setup

- **VS Code** with extensions:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Material Icon Theme

### Debugging

- **Renderer process**: Use Chrome DevTools (Ctrl+Shift+I)
- **Main process**: Check console output in terminal
- **Hotkeys**: Use the test hotkeys feature in settings

### Common Development Tasks

#### Adding a New Component

1. Create component file in `src/components/`
2. Add proper TypeScript interfaces
3. Follow Material-UI patterns
4. Add to appropriate parent component

#### Adding a New Search Engine

1. Test the search URL format
2. Add to the default search engines list
3. Update documentation if needed

#### Modifying Hotkey Logic

1. Test in `src/main/main.ts`
2. Ensure compatibility with Windows
3. Test with different applications
4. Consider excluded applications functionality

## 📋 Issue Templates

### Bug Report Template

```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## System Information
- Windows Version:
- SnipSearch Version:
- Node.js Version:

## Additional Information
Screenshots, logs, etc.
```

### Feature Request Template

```markdown
## Feature Description
Brief description of the feature

## Use Case
Why this feature would be useful

## Proposed Implementation
How you think this could be implemented

## Alternatives Considered
Other approaches you've considered

## Additional Information
Mockups, examples, etc.
```

## 🎯 Areas for Contribution

### High Priority
- [ ] Cross-platform support (macOS, Linux)
- [ ] Plugin system for custom search engines
- [ ] Search history and favorites
- [ ] Advanced hotkey combinations
- [ ] Voice search integration

### Medium Priority
- [ ] Custom themes and styling
- [ ] Import/export settings
- [ ] Cloud sync for settings
- [ ] Performance optimizations
- [ ] Accessibility improvements

### Low Priority
- [ ] Additional search engine integrations
- [ ] Advanced filtering options
- [ ] Custom notification sounds
- [ ] Keyboard shortcuts for app navigation

## 📞 Getting Help

- **Discussions**: Use [GitHub Discussions](https://github.com/yourusername/snipsearch/discussions)
- **Issues**: Create an issue for bugs or feature requests
- **Documentation**: Check the README.md and code comments

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to SnipSearch! 🚀 