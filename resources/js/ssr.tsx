import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { MantineProvider, createTheme } from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { renderToString } from 'react-dom/server';
import DefaultLayout from './layouts/default-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const myColor: MantineColorsTuple = ['#ffe8e9', '#ffd1d1', '#fba0a0', '#f76d6d', '#f44141', '#f22625', '#f21616', '#d8070b', '#c10007', '#a90003'];

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: 'myColor',
});

createServer((page) =>
  createInertiaApp({
    page,
    render: renderToString,
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
      const pageComponent = await resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
      (pageComponent as { default: { layout?: unknown } }).default.layout ??= (page: React.ReactNode) => <DefaultLayout>{page}</DefaultLayout>;
      return pageComponent;
    },
    setup: ({ App, props }) => (
      <MantineProvider theme={theme} defaultColorScheme="light">
        <App {...props} />
      </MantineProvider>
    ),
  }),
);
