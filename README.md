# PDF Tools

Free and easy-to-use online PDF tools that make you more productive.

**Live Demo:** [https://pdf-tools-production-7595.up.railway.app](https://pdf-tools-production-7595.up.railway.app/)

![Deploy on Railway](https://railway.com/button.svg)

## Features

- **Sign PDF** - Add your signature to any PDF document
- **Merge PDF** - Combine multiple PDF files into one (coming soon)
- **Split PDF** - Split a PDF into multiple files (coming soon)
- **Compress PDF** - Reduce the size of your PDF files (coming soon)
- **Convert to PNG** - Convert PDF pages to PNG images (coming soon)
- **Convert to JPG** - Convert PDF pages to JPG images (coming soon)

## Tech Stack

### Backend

- **PHP 8.5**
- **Laravel 12** - PHP framework

### Frontend

- **React 19** - UI library
- **Inertia.js v2** - Modern monolith architecture
- **TypeScript** - Type safety
- **Mantine 8** - React components library
- **Tailwind CSS 4** - Utility-first CSS framework

### Development Tools

- **Vite 7** - Build tool
- **Pest 4** - Testing framework
- **Laravel Pint** - Code style fixer
- **ESLint** - JavaScript linter
- **Prettier** - Code formatter

## Installation

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

## Development

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

## Testing

```bash
php artisan test
```

## Code Formatting

```bash
# PHP
vendor/bin/pint

# JavaScript/TypeScript
npm run format
npm run lint
```

## Author

Made by [Florian Lescribaa](https://github.com/FloFlo-L)

## License

This project is open-sourced software.
