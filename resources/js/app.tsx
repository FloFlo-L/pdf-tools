import { createInertiaApp } from '@inertiajs/react';
import type { MantineColorsTuple } from '@mantine/core';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import Footer from './components/footer';
import Navbar from './components/nav-bar';
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const myColor: MantineColorsTuple = ['#ffe8e9', '#ffd1d1', '#fba0a0', '#f76d6d', '#f44141', '#f22625', '#f21616', '#d8070b', '#c10007', '#a90003'];

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: 'myColor',
});

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <MantineProvider theme={theme}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="my-16 flex-1">
            <App {...props} />
          </main>
          <Footer />
        </div>
      </MantineProvider>,
    );
  },
  progress: {
    color: '#4B5563',
  },
});
