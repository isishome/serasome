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
        return (window.innerWidth ?? 0) < 1280
          ? h(
              'ClientOnly',
              h(Adsense, {
                dataAdSlot: '7595465749',
                dataAdFormat: 'auto',
                dataFullWidthResponsive: true
              })
            )
          : undefined
      },
      'aside-ads-before': () => {
        return (window.innerWidth ?? 0) >= 1280
          ? h(
              'ClientOnly',
              h(Adsense, {
                dataAdSlot: '7901796235',
                width: 160,
                height: 600
              })
            )
          : undefined
        // https://vitepress.dev/guide/extending-default-theme#layout-slots
      }
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
