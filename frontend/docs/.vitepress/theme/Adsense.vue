<script setup lang="ts">
import { computed, onMounted } from 'vue'

declare global {
  interface Window {
    adsbygoogle: any
  }
}

const props = defineProps({
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
  }
})

const dataAdtest = computed(() =>
  import.meta.env.DEV || !!!props.dataAdSlot ? 'on' : null
)
const style = computed(() =>
  props.width && props.height
    ? `display: block; width: ${props.width}px; height: ${props.height}px`
    : null
)

const render = () => {
  if (!!!props.dataAdSlot) return
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
        :style="style"
        data-ad-client="ca-pub-5110777286519562"
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
</style>
