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
    default: undefined
  },
  width: {
    type: [Number, String],
    default: undefined
  },
  height: {
    type: [Number, String],
    default: undefined
  },
  dataAdFormat: {
    type: String,
    default: undefined
  },
  dataFullWidthResponsive: {
    type: Boolean,
    default: undefined
  }
})

const dataAdtest = computed(() =>
  import.meta.env.DEV || !!!props.dataAdSlot ? 'on' : undefined
)
const style = computed(() =>
  props.width && props.height
    ? `display: inline-block; width: ${props.width}px; height: ${props.height}px`
    : `display: block; width: 300px; height: 50px`
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
