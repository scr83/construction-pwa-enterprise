import type { Preview } from '@storybook/react'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1e293b',
        },
        {
          name: 'mobile',
          value: '#f8fafc',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile1: {
          name: 'Mobile (iPhone 12)',
          styles: {
            width: '390px',
            height: '844px',
          },
        },
        mobile2: {
          name: 'Mobile (Galaxy S21)',
          styles: {
            width: '384px',
            height: '854px',
          },
        },
        tablet: {
          name: 'Tablet (iPad)',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '720px',
          },
        },
      },
    },
  },
}

export default preview