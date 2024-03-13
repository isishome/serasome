import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  sitemap: {
    hostname: 'https://serasome.com'
  },
  locales: {
    root: {
      title: 'Sera\'s Something',
      description: '세라의 특별한... 모든 것들',
      label: '한국어',
      lang: 'ko',
      themeConfig: {
        nav: [
          { text: '홈', link: '/' },
          { text: '프로그래밍', link: '/programming/vue/intro/' },
          { text: 'IT 기기', link: '/it/y700-2th/intro/' }
        ],
        logo: '/images/logo.svg',
        notFound: {
          title: '페이지를 찾을 수 없습니다',
          quote: '방문하시려는 페이지의 주소가 잘못 입력되었거나, 페이지의 주소가 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다. 입력하신 주소가 정확한지 다시 한번 확인해 주시기 바랍니다.',
          linkLabel: '홈으로 이동',
          linkText: '홈으로 가기'
        },
        sidebar: {
          '/programming/': [
            {
              text: 'Vue.js',
              collapsed: false,
              items: [
                { text: '준비중', link: '/programming/vue/intro/' },
              ]
            },
            // {
            //   text: 'Vue Router',
            //   collapsed: false,
            //   items: [
            //     { text: '소개', link: '/programming/vue-router/', docFooterText: 'Vue Router 소개' }
            //   ]
            // },
            // {
            //   text: 'Pinia',
            //   collapsed: false,
            //   items: [
            //     { text: '소개', link: '/programming/pinia/' }
            //   ]
            // },
            {
              text: 'Quasar Framework',
              collapsed: false,
              items: [
                { text: 'Sera\'s Quasar Framework', link: 'https://quasar.serasome.com', docFooterText: 'Sera\'s Quasar Framework' }
              ]
            }
          ],
          '/it/': [
            {
              text: '레노버 리전 Y700 2세대',
              collapsed: false,
              items: [
                { text: '소개', link: '/it/y700-2th/intro/' },
                { text: '구성품 및 악세서리', link: '/it/y700-2th/components/' },
                { text: '글로벌 롬 업데이트', link: '/it/y700-2th/global-rom/' }
              ]
            }
          ]
        },
        darkModeSwitchLabel: '화면 모드',
        lightModeSwitchTitle: '라이트 모드',
        darkModeSwitchTitle: '다크 모드',
        sidebarMenuLabel: '메뉴',
        outlineTitle: '이 페이지에서',
        returnToTopLabel: '맨 위로'
        // socialLinks: [
        //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        // ]
      }
    },
    // en: {
    //   title: 'English Test Site',
    //   description: 'English Test Description',
    //   label: 'English',
    //   lang: 'en',
    //   themeConfig: {
    //     nav: [
    //       { text: 'Home', link: '/en/' }
    //     ]
    //   }
    // }

  },
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/favicon/site.webmanifest' }]
  ],
  themeConfig: {
    footer: {
      message: 'Made with VitePress.',
      copyright: 'Copyright © 2024-present SeraSome'
    }
  },
  outDir: './../front'
})
