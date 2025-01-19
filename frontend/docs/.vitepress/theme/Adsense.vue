<script setup lang="ts">
import { computed, ref, onBeforeMount, onMounted, onUnmounted } from 'vue'

declare global {
  interface Window {
    adsbygoogle: any
  }
}

const props = defineProps({
  dataAdClient: {
    type: String,
    default: 'ca-pub-5110777286519562'
  },
  dataAdSlot: {
    type: String,
    default: null
  },
  width: {
    type: [Number, String],
    default: null
  },
  height: {
    type: [Number, String],
    default: null
  },
  dataAdFormat: {
    type: String,
    default: null
  },
  dataFullWidthResponsive: {
    type: Boolean,
    default: null
  },
  repeat: {
    type: Number,
    default: 5
  }
})

let timer: NodeJS.Timeout
const repeat = ref(0)
const dataAdtest = computed(() =>
  import.meta.env.DEV || !!!props.dataAdSlot ? 'on' : null
)
const style = computed(() =>
  props.width && props.height
    ? `display: block; width: ${props.width}px; height: ${props.height}px`
    : null
)

const render = () => {
  repeat.value++
  if (repeat.value > props.repeat) clearTimeout(timer)
  else if (!!window?.adsbygoogle) (window.adsbygoogle || []).push({})
  else
    timer = setTimeout(() => {
      render()
    }, 200)
}

onBeforeMount(() => {
  const adURL = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${props.dataAdClient}`
  const script = document.createElement('script')
  script.src = adURL

  script.async = true
  script.crossOrigin = 'anonymous'

  if (!document.head.querySelector(`script[src="${adURL}"]`))
    document.head.appendChild(script)
})

onMounted(() => {
  render()
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<template>
  <div class="wrap">
    <div class="ads-wrap">
      <ins
        class="adsbygoogle"
        :style="style"
        :data-ad-client="dataAdClient"
        :data-ad-slot="dataAdSlot"
        :data-adtest="dataAdtest"
        :data-ad-format="dataAdFormat"
        :data-full-width-responsive="dataFullWidthResponsive"
      ></ins>
    </div>
  </div>
</template>

<style scoped="module">
.wrap {
  margin-top: 24px;
  margin-bottom: 24px;
}

.ads-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
  font-weight: 500;
  background-color: var(--vp-carbon-ads-bg-color);
}

.wrap:has(.ins[data-ad-status='unfilled']) {
  margin-top: 0;
  margin-bottom: 0;
}

.ads-wrap:has(.ins[data-ad-status='unfilled']) {
  padding: 0;
  background-color: inherit;
}
</style>
