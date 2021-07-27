const { description } = require('../../package');

module.exports = {
  title: 'v9s',
  description: description,
  base: '/v9s/',
  head: [
    ['meta', { name: 'theme-color', content: '#0078cf' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'icon', href: '/img/logo.png' }]
  ],

  locales: {
    '/': {
      lang: 'en-US'
    },
    '/ru/': {
      lang: 'ru-Ru'
    }
  },

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'https://github.com/vueent/v9s',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    sidebar: 'auto',
    locales: {
      '/': {
        selectText: 'Languages',
        label: 'English',
        ariaLabel: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        serviceWorker: {
          updatePopup: {
            message: 'New content is available.',
            buttonText: 'Refresh'
          }
        },
        algolia: {},
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide/' }
        ],
        sidebar: {
          '/guide/': [
            {
              title: 'Guide',
              collapsable: true,
              children: ['', 'tutorial', 'built-in-rules']
            }
          ]
        }
      },
      '/ru/': {
        selectText: 'Языки',
        label: 'Русский',
        ariaLabel: 'Языки',
        editLinkText: 'Редактировкать эту страницу на GitHub',
        serviceWorker: {
          updatePopup: {
            message: 'Доступна новая редакция.',
            buttonText: 'Обновить'
          }
        },
        algolia: {},
        nav: [
          { text: 'Главная', link: '/ru/' },
          { text: 'Руководство', link: '/ru/guide/' }
        ],
        sidebar: {
          '/ru/guide/': [
            {
              title: 'Руководство',
              collapsable: true,
              children: ['', 'tutorial', 'built-in-rules']
            }
          ]
        }
      }
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom']
};
