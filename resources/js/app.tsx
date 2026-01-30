import { createInertiaApp } from '@inertiajs/react';
import type { MantineColorsTuple } from '@mantine/core';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import DefaultLayout from './layouts/default-layout';

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
  resolve: async (name) => {
    const page = await resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
    (page as { default: { layout?: unknown } }).default.layout ??= (page: React.ReactNode) => <DefaultLayout>{page}</DefaultLayout>;
    return page;
  },
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <MantineProvider theme={theme} defaultColorScheme="light">
        <App {...props} />
      </MantineProvider>,
    );
  },
  progress: {
    color: '#4B5563',
  },
});
