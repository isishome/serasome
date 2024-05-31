import { defineConfig, type HeadConfig } from 'vitepress'

const prod = process.env.NODE_ENV === 'production'
const heads: HeadConfig[] = [
  ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
  ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
  ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap' }],
  ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' }],
  ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' }],
  ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' }],
  ['link', { rel: 'manifest', href: '/favicon/site.webmanifest' }]
]

if (prod) {
  heads.push(['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-CYSQREKHK7' }],
    ['script', {}, "window.dataLayer = window.dataLayer || [];\nfunction gtag(){ dataLayer.push(arguments); }\ngtag('js', new Date());\n\ngtag('config', 'G-CYSQREKHK7');"],
    ["script", { async: '', src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5110777286519562", crossorigin: 'anonymous' }])
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  transformPageData: (pageData) => {
    const canonicalUrl = `https://serasome.com/${pageData.relativePath}`.replace(/index\.md$/, '').replace(/\.(md|html)$/, '')

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(['meta', { property: 'og:title', content: pageData.title }])
    pageData.frontmatter.head.push(['meta', { property: 'og:description', content: pageData.description }])
    pageData.frontmatter.head.push(['meta', { property: 'og:image', content: 'https://serasome.com/images/og.jpg' }])
    pageData.frontmatter.head.push(['meta', { property: 'og:url', content: canonicalUrl }])
    pageData.frontmatter.head.push(['link', { rel: 'canonical', href: canonicalUrl }])
  },
  sitemap: {
    hostname: 'https://serasome.com'
  },
  locales: {
    root: {
      title: 'Sera\'s Something',
      description: '프로그래밍 & IT & 그밖에 관심 있는 모든 것',
      label: '한국어',
      lang: 'ko',
      themeConfig: {
        nav: [
          { text: '홈', link: '/' },
          { text: '프로그래밍', link: '/programming/docker/intro' },
          { text: 'IT 기기', link: '/it/y700/global-rom' }
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
              text: 'Docker',
              collapsed: true,
              items: [
                { text: 'Docker란 무엇인가?', link: '/programming/docker/intro' },
                { text: 'Docker 설치하기', link: '/programming/docker/install' },
                { text: 'Docker 명령어', link: '/programming/docker/command' },
                { text: 'Dockerfile 작성하기', link: '/programming/docker/file' },
                {
                  text: 'Docker로 웹서버 구축하기 ', collapsed: true,
                  items: [
                    { text: '왜 Docker 웹서버인가?', link: '/programming/docker/webserver/why' },
                    { text: 'Docker 호스트 준비', link: '/programming/docker/webserver/host' },
                    {
                      text: 'Jenkins 컨테이너', link: '/programming/docker/webserver/jenkins', collapsed: true,
                      items: [
                        { text: 'Github와 Jenkins 연동하기', link: '/programming/docker/webserver/github-jenkins' }
                      ]
                    },
                    { text: 'Nginx 컨테이너', link: '/programming/docker/webserver/nginx' },
                    { text: 'Node.js App 컨테이너', link: '/programming/docker/webserver/nodejs' },
                    { text: '정적 사이트', link: '/programming/docker/webserver/static' },
                    //{ text: '장애 원인과 해결 방안', link: '/programming/docker/webserver/resolve' }
                  ]
                }
              ]
            },
            {
              text: 'Vue.js',
              collapsed: true,
              items: [
                { text: '준비중', link: '/programming/vue/intro' },
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
              collapsed: true,
              items: [
                { text: 'Sera\'s Quasar Framework', link: 'https://quasar.serasome.com', docFooterText: 'Sera\'s Quasar Framework' }
              ]
            }
          ],
          '/it/': [
            {
              text: '레노버 리전 Y700 2세대',
              collapsed: true,
              items: [
                { text: '소개', link: '/it/y700/intro' },
                { text: '구성품 및 리뷰', link: '/it/y700/components' },
                { text: '글로벌 롬 설치', link: '/it/y700/global-rom' },
                { text: '글로벌 롬 ota 수동 업데이트', link: '/it/y700/global-rom-update' },
                { text: '기본 설정', link: '/it/y700/settings' },
                { text: '다양한 기능', link: '/it/y700/features' },
                { text: '전용 펜(AP500U) 리뷰', link: '/it/y700/pen' },
                { text: '전용 액세서리 리뷰', link: '/it/y700/accessories' }
              ]
            },
            {
              text: 'AULA F87 Pro',
              collapsed: true,
              items: [
                { text: '소개', link: '/it/f87pro/intro' },
                { text: '구성품 및 리뷰', link: '/it/f87pro/components' }
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
  head: heads,
  themeConfig: {
    footer: {
      message: 'Made with VitePress.',
      copyright: 'Copyright © 2024-present SeraSome'
    }
  },
  cleanUrls: true,
  markdown: {
    image: {
      lazyLoading: true
    }
  },
  outDir: './../dist'
})
