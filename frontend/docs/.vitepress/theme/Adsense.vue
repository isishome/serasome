<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

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

const render = () => {
  repeat.value++
  if (repeat.value > props.repeat) clearTimeout(timer)
  else if (!!window?.adsbygoogle) (window.adsbygoogle || []).push({})
  else
    timer = setTimeout(() => {
      render()
    }, 200)
}

onMounted(() => {
  render()
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<template>
  <ins
    class="adsbygoogle ins"
    :data-ad-client="dataAdClient"
    :data-ad-slot="dataAdSlot"
    :data-adtest="dataAdtest"
    :data-ad-format="dataAdFormat"
    :data-full-width-responsive="dataFullWidthResponsive"
  ></ins>
</template>

<style scoped="module">
.ins {
  position: relative;
  min-height: 50px;
  background-color: var(--vp-carbon-ads-bg-color);
}

.ins[data-ad-status='unfilled'] {
  margin-top: 0;
  margin-bottom: 0;
}

.ins[data-ad-status='unfilled'] {
  padding: 0;
  background-color: inherit;
}
</style>
