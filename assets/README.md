# Assets Directory

This directory contains the application icons and assets for SnipSearch.

## Required Icons

To complete the SnipSearch application, you need to add the following icon files:

### App Icon (Required)
- **File**: `icon.png`
- **Size**: 512x512 pixels
- **Format**: PNG with transparency
- **Description**: Main application icon for the window and system tray

### Windows Icon (Required)
- **File**: `icon.ico`
- **Size**: Multiple sizes (16x16, 32x32, 48x48, 256x256)
- **Format**: ICO format
- **Description**: Windows executable icon for the installer

## Icon Design Guidelines

The SnipSearch icon should follow these design principles:

1. **Material 3 Style**: Use the Material 3 color palette and design language
2. **Simple & Recognizable**: Should be easily identifiable at small sizes
3. **Search Theme**: Incorporate search/magnifying glass elements
4. **Windows 11 Compatible**: Follow Windows 11 icon design guidelines
5. **Scalable**: Should look good at all sizes from 16x16 to 512x512

## Suggested Icon Concept

- **Primary Element**: Magnifying glass or search icon
- **Secondary Element**: Text selection or clipboard symbol
- **Colors**: Use Material 3 primary colors (#6750A4)
- **Style**: Rounded corners, subtle shadows, modern appearance

## Icon Generation Tools

You can create the required icons using:

1. **Online Tools**:
   - [Favicon.io](https://favicon.io/) - Generate ICO files
   - [RealFaviconGenerator](https://realfavicongenerator.net/) - Complete icon set

2. **Design Software**:
   - Adobe Illustrator
   - Figma
   - Sketch
   - GIMP (free)

3. **Icon Libraries**:
   - Material Design Icons
   - Feather Icons
   - Lucide Icons

## File Structure

After adding your icons, the assets directory should look like:

```
assets/
├── README.md
├── icon.png      # Main app icon (512x512)
└── icon.ico      # Windows executable icon
```

## Testing Icons

After adding the icons:

1. **Development**: Run `npm run dev` to test the app icon
2. **Build**: Run `npm run dist:win` to test the installer icon
3. **System Tray**: Check that the tray icon displays correctly

## Notes

- The icon files are referenced in `package.json` and `src/main/main.ts`
- Make sure the file names match exactly: `icon.png` and `icon.ico`
- Test the icons at different sizes to ensure they look good
- Consider creating a high-resolution version for future scaling needs 