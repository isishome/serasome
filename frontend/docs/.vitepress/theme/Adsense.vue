<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

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
  justify: {
    type: String,
    default: 'start'
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

onMounted(() => {
  render()
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<template>
  <div class="wrap" :style="`justify-content: ${justify}`">
    <ins
      v-bind="$attrs"
      class="adsbygoogle ins"
      :data-ad-client="dataAdClient"
      :data-ad-slot="dataAdSlot"
      :data-adtest="dataAdtest"
      :data-ad-format="dataAdFormat"
      :data-full-width-responsive="dataFullWidthResponsive"
    ></ins>
  </div>
</template>

<style scoped="module">
.wrap {
  margin-top: 0;
  margin-bottom: 36px;
  display: flex;
}

@media (max-width: 600px) {
  .wrap {
    margin-bottom: 24px;
  }
}

.ins {
  position: relative;
  min-height: 50px;
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
