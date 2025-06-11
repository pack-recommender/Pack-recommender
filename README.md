# Packrecommender

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.3.

## 🚀 Deployment

Pushing changes to the `main` branch will automatically trigger a deployment via [Netlify](https://www.netlify.com/).

🔗 **Live URL**: [https://packrecommender.netlify.app/](https://packrecommender.netlify.app/)

## 🧪 Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

## ⚙️ Code Scaffolding

Generate a new component, directive, pipe, service, etc.:

```bash
ng generate component component-name
# or
ng generate directive|pipe|service|class|guard|interface|enum|module
```

## 🛠️ Build

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## 🌐 Internationalization

Text strings are loaded from JSON files located in `src/assets/i18n`. English (`en.json`) is used by default and Hebrew translations are available in `he.json`. Use the language dropdown in the app header to switch languages.

To add a new language:

1. Create a new `<lang>.json` file under `src/assets/i18n` following the existing structure.
2. Add the language code and label in `LanguageService` so it appears in the dropdown.

## 📚 Further Help

Use `ng help` or refer to the [Angular CLI Documentation](https://angular.dev/tools/cli) for more information.
