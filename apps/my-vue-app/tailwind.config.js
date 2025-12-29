/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{tsx,ts,jsx,js,vue}'
  ],
  prefix: 'tw-',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1890ff',
          success: '#52c41a',
          warning: '#faad14',
          error: '#f5222d',
          info: '#1890ff',
          border: '#d9d9d9',
          bg: '#f5f5f5',
          light: '#fafafa',
        }
      },
      spacing: {
        '4.5': '1.125rem',
      }
    }
  },
  plugins: [],
};
