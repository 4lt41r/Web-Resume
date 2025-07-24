# Android App Icon Instructions

To create a proper app icon for your Resume Builder Android app:

## Option 1: Use Android Studio's Asset Studio (Recommended)
1. Open Android Studio
2. Right-click on `app/src/main/res` folder
3. Select "New" > "Image Asset"
4. Choose "Launcher Icons (Adaptive and Legacy)"
5. Upload your icon design (512x512 PNG recommended)
6. Configure foreground and background layers
7. Generate all required sizes automatically

## Option 2: Manual Icon Creation
Create the following icon sizes and place them in respective folders:

### Required Folders and Sizes:
- `mipmap-mdpi/`: 48x48px
- `mipmap-hdpi/`: 72x72px  
- `mipmap-xhdpi/`: 96x96px
- `mipmap-xxhdpi/`: 144x144px
- `mipmap-xxxhdpi/`: 192x192px

### Icon Design Guidelines:
- Use a clean, professional design
- Include resume/document symbolism (📄 or 📝)
- Use your brand colors (primary: #2563eb)
- Ensure good contrast
- Test visibility at small sizes

## Current Icon Status:
The app currently uses the default Capacitor icon. Replace with custom icons for a professional look.

## Splash Screen:
The splash screen is configured to use your app's primary color (#2563eb) and will show for 2 seconds during app startup.
