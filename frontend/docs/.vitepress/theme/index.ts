// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Adsense from './Adsense.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => {
        return (!import.meta.env.SSR && window?.innerWidth
          ? window?.innerWidth
          : 0) < 1280
          ? h(Adsense, {
              dataAdSlot: '7595465749',
              width: 728,
              height: 90
            })
          : undefined
      },
      'aside-ads-before': () => {
        return (!import.meta.env.SSR && window?.innerWidth
          ? window?.innerWidth
          : 0) >= 1280
          ? h(Adsense, {
              dataAdSlot: '7901796235',
              width: 160,
              height: 600
            })
          : undefined
        // https://vitepress.dev/guide/extending-default-theme#layout-slots
      }
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
