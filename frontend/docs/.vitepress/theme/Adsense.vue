<script setup lang="ts">
import { onMounted } from 'vue'

declare global {
  interface Window {
    adsbygoogle: any
  }
}

defineProps({
  dataAdSlot: {
    type: String,
    default: '7901796235'
  },
  width: {
    type: [Number, String],
    default: 160
  },
  height: {
    type: [Number, String],
    default: 600
  }
})

const dataAdtest = import.meta.env.DEV

const render = () => {
  ;(window.adsbygoogle || []).push({})
}

onMounted(() => {
  if (document.readyState !== 'complete')
    window.addEventListener('load', render)
  else render()
})
</script>

<template>
  <div class="wrap">
    <div class="ads-wrap">
      <ins
        class="adsbygoogle"
        :style="`display: inline-block; width: ${width}px; height: ${height}px`"
        data-ad-client="ca-pub-5110777286519562"
        :data-ad-slot="dataAdSlot"
        :data-adtest="dataAdtest ? 'on' : null"
      ></ins>
    </div>
  </div>
</template>

<style scoped="module">
.wrap {
  margin-top: 24px;
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
</style>
