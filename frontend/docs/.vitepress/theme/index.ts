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
      'doc-before': () => {
        return (!import.meta.env.SSR && window?.innerWidth
          ? window?.innerWidth
          : 0) < 1280
          ? h(Adsense, {
              dataAdSlot: '7595465749',
              width: 728,
              height: 90,
              dataAdFormat: 'horizontal',
              dataFullWidthResponsive: false
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
              height: 600,
              dataFullWidthResponsive: false
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
