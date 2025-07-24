# Copilot Instructions for Web Resume App

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a modern Resume Generator web application built with React and Vite. The app allows users to create professional resumes with multiple themes and templates.

## Key Features
- **Resume Form**: Users can input personal information, education, experience, skills, certifications, and achievements
- **Live Preview**: Real-time resume preview that updates as users type
- **Multiple Themes**: Support for various visual templates (Professional, Amazon, Netflix, Google, Dark Mode)
- **Admin Panel**: Administrators can add new templates and manage existing ones
- **PDF Export**: Users can download their resume as PDF using html2pdf.js
- **Mobile Ready**: Responsive design optimized for both desktop and mobile
- **Android Conversion**: Prepared for conversion to Android app using Capacitor

## Tech Stack
- **Frontend**: React 18 with Vite for fast development
- **Styling**: CSS with CSS custom properties (variables) for theming
- **PDF Generation**: html2pdf.js library
- **Icons**: Lucide React for consistent iconography
- **Mobile Conversion**: Capacitor for Android app conversion
- **State Management**: React hooks (useState, useEffect, useContext)

## Code Style Guidelines
- Use functional components with React hooks
- Implement CSS modules or styled-components for component-specific styling
- Use CSS custom properties for theme variables
- Follow responsive design principles (mobile-first approach)
- Implement proper form validation and error handling
- Use semantic HTML for accessibility
- Maintain clean component separation (presentation vs. logic)

## Component Structure
- `ResumeForm.jsx`: Handle user input and form validation
- `ResumeTemplate.jsx`: Render resume preview with theme support
- `LoadingScreen.jsx`: Display elegant loading animations
- `AdminPanel.jsx`: Manage templates and admin functions
- `ThemeProvider.jsx`: Handle theme switching and CSS variable management

## Theme System
- Use CSS custom properties for color schemes and styling
- Implement theme classes (e.g., `.professional-theme`, `.dark-theme`, `.amazon-theme`)
- Store theme configurations in JSON format for easy management
- Support dynamic theme switching without page reload

## Best Practices
- Prioritize performance and accessibility
- Implement proper error boundaries
- Use lazy loading for components when appropriate
- Ensure cross-browser compatibility
- Validate all user inputs
- Implement proper loading states
- Use TypeScript-style JSDoc comments for better IntelliSense
