# Professional Resume Builder

A modern, feature-rich resume generator built with React and Vite. Create stunning professional resumes with multiple themes, real-time preview, and seamless export functionality.

## ✨ Key Features

- **📝 Intelligent Form Builder** - Comprehensive form with smart validation and placeholders
- **👀 Live Preview** - Real-time resume preview with instant updates
- **🎨 Professional Themes** - 5 beautiful themes (Professional, Amazon, Netflix, Google, Dark Mode)
- **📱 Fully Responsive** - Perfect on desktop, tablet, and mobile devices
- **📄 Multi-Format Export** - HTML download and browser preview with PDF generation
- **⚡ Performance Optimized** - Fast loading with elegant animations
- **✅ Smart Validation** - Ensures resume completeness before export
- **🎯 User-Friendly** - Intuitive interface with helpful notifications
- **♿ Accessibility Ready** - Screen reader friendly with proper ARIA support
- **🚀 Production Ready** - Optimized build with clean, maintainable code

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite (Lightning fast development)
- **Styling:** Modern CSS with Custom Properties for theming
- **Icons:** Lucide React (Beautiful, consistent iconography)
- **PDF Generation:** html2pdf.js (High-quality PDF output)
- **State Management:** React Hooks (useState, useEffect, useContext)
- **Build Tool:** Vite (Fast builds and hot reloading)
- **Linting:** ESLint (Code quality assurance)

## � Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web-resume
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🎯 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🎨 Themes

The app includes 5 built-in themes:

1. **Professional** - Clean blue and gray (default)
2. **Dark Mode** - Dark background with light text
3. **Amazon** - Orange and navy corporate style
4. **Netflix** - Black and red entertainment style
5. **Google** - Multi-color tech company style

## 📱 Mobile App Conversion

Convert to Android app using Capacitor:

1. **Initialize Capacitor**
   ```bash
   npx cap init
   ```

2. **Add Android platform**
   ```bash
   npx cap add android
   ```

3. **Build and copy**
   ```bash
   npm run build
   npx cap copy
   ```

4. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ResumeForm.jsx      # Main form component
│   ├── ResumeTemplate.jsx  # Preview template
│   ├── LoadingScreen.jsx   # Loading animation
│   └── AdminPanel.jsx      # Admin interface
├── assets/
│   └── templates/          # Custom templates
├── App.jsx                 # Main app component
├── App.css                 # App-specific styles
├── index.css              # Global styles + themes
└── main.jsx               # App entry point
```

## 🎛️ Admin Panel

Access the admin panel by clicking the settings icon in the header:

- **Template Management** - Upload, enable/disable templates
- **Export Templates** - Download templates as JSON
- **Application Settings** - Configure PDF export and theme defaults

## 📄 Resume Sections

The form includes comprehensive sections:

- **Personal Information** - Name, contact details, summary
- **Work Experience** - Companies, positions, descriptions
- **Education** - Degrees, institutions, achievements
- **Skills** - Categorized skill sets
- **Certifications** - Professional certifications
- **Achievements** - Awards and accomplishments

## 🎨 Customizing Themes

Add new themes by:

1. **Define CSS custom properties** in `src/index.css`
2. **Add theme object** to the themes array in `App.jsx`
3. **Test across all components**

Example theme structure:
```css
.my-theme {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  --background-color: #your-color;
  /* ... other properties */
}
```

## 🖨️ PDF Export Features

- **High-quality rendering** with proper typography
- **Print-optimized styles** for professional output
- **Automatic page breaks** to avoid content cutoff
- **Custom filename** based on user's name
- **Theme-aware colors** (with print fallbacks)

## ♿ Accessibility

- **Semantic HTML** structure
- **ARIA labels** and roles
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Color contrast** compliance
- **Focus management** for better UX

## 🌟 Key Features Detail

### Real-time Preview
- Form changes instantly reflect in the preview
- Theme switching updates preview immediately
- Responsive preview for mobile testing

### Form Validation
- Required field indicators
- Email format validation
- URL format validation
- Date range validation

### Dynamic Sections
- Add/remove education entries
- Add/remove work experience
- Add/remove skills categories
- Add/remove certifications
- Add/remove achievements

## 🐛 Troubleshooting

### Common Issues

1. **PDF generation fails**
   - Check if html2pdf.js loaded correctly
   - Ensure preview element exists
   - Verify CSS styles are applied

2. **Theme not applying**
   - Check CSS custom properties syntax
   - Verify theme class is added to body
   - Ensure CSS variables are properly defined

3. **Mobile layout issues**
   - Test responsive breakpoints
   - Check viewport meta tag
   - Verify touch interactions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📋 Todo / Future Enhancements

- [ ] User authentication
- [ ] Cloud storage integration
- [ ] Resume templates marketplace
- [ ] Social sharing features
- [ ] Resume analytics
- [ ] Multi-language support
- [ ] Advanced PDF customization
- [ ] Resume import from LinkedIn
- [ ] Collaborative editing
- [ ] Resume version history

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vite Team** for the fast build tool
- **Lucide** for the beautiful icons
- **html2pdf.js** for PDF generation capabilities

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the PROJECT_INSTRUCTIONS.md file

---

**Built with ❤️ using React + Vite**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
