# 📄 PDF Tools

Free and easy-to-use online PDF tools that make you more productive.

**🌐 Live Demo:** [https://pdf-tools-production-7595.up.railway.app](https://pdf-tools-production-7595.up.railway.app/)

![Deploy on Railway](https://railway.com/button.svg)

## ✨ Features

- ✍️ **Sign PDF** - Add your signature to any PDF document
- 🔀 **Merge PDF** - Combine multiple PDF files into one (coming soon)
- ✂️ **Split PDF** - Split a PDF into multiple files (coming soon)
- 🗜️ **Compress PDF** - Reduce the size of your PDF files (coming soon)
- 🖼️ **Convert to PNG** - Convert PDF pages to PNG images (coming soon)
- 📷 **Convert to JPG** - Convert PDF pages to JPG images (coming soon)

## 🌍 Internationalization

Translations are handled via Laravel's built-in lang files (`lang/en`, `lang/fr`) shared to the frontend through Inertia.js props and consumed with a custom `useTranslation` hook.

## 🛠️ Tech Stack

### Backend

- <img src="https://cdn.simpleicons.org/php" height="16" alt="PHP" /> **PHP 8.5**
- <img src="https://cdn.simpleicons.org/laravel" height="16" alt="Laravel" /> **Laravel 12** - PHP framework

### Frontend

- <img src="https://cdn.simpleicons.org/react" height="16" alt="React" /> **React 19** - UI library
- <img src="https://cdn.simpleicons.org/inertia" height="16" alt="Inertia.js" /> **Inertia.js v2** - Modern monolith architecture
- <img src="https://cdn.simpleicons.org/typescript" height="16" alt="TypeScript" /> **TypeScript** - Type safety
- <img src="https://cdn.simpleicons.org/mantine" height="16" alt="Mantine" /> **Mantine 8** - React components library
- <img src="https://cdn.simpleicons.org/tailwindcss" height="16" alt="Tailwind CSS" /> **Tailwind CSS 4** - Utility-first CSS framework

### Development Tools

- <img src="https://cdn.simpleicons.org/vite" height="16" alt="Vite" /> **Vite 7** - Build tool
- 🧪 **Pest 4** - Testing framework
- 🎯 **Laravel Pint** - Code style fixer
- <img src="https://cdn.simpleicons.org/eslint" height="16" alt="ESLint" /> **ESLint** - JavaScript linter
- <img src="https://cdn.simpleicons.org/prettier" height="16" alt="Prettier" /> **Prettier** - Code formatter

## 🚀 Installation

### Prerequisites

- PHP 8.5+
- Composer
- Node.js 20+
- npm

### Setup

1. Clone the repository

```bash
git clone https://github.com/FloFlo-L/pdf-tools.git
cd pdf-tools
```

2. Install PHP dependencies

```bash
composer install
```

3. Install Node.js dependencies

```bash
npm install
```

4. Copy the environment file

```bash
cp .env.example .env
```

5. Generate application key

```bash
php artisan key:generate
```

6. Build frontend assets

```bash
npm run build
```

## 💻 Development

Start the development server:

```bash
composer run dev
```

Or run separately:

```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Vite dev server
npm run dev
```

## 🧪 Testing

```bash
php artisan test
```

## 🎨 Code Formatting

```bash
# PHP
vendor/bin/pint

# JavaScript/TypeScript
npm run format
npm run lint
```

## 👤 Author

Made by [Florian Lescribaa](https://github.com/FloFlo-L)

## 📝 License

This project is open-sourced software licensed under the [MIT License](LICENSE.md).
