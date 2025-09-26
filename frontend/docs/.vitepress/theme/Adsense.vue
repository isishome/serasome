<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from "vue";

const props = defineProps({
  dataAdClient: {
    type: String,
    default: "ca-pub-5110777286519562",
  },
  dataAdSlot: {
    type: String,
    default: null,
  },
  dataAdFormat: {
    type: String,
    default: undefined,
  },
  dataAdtest: {
    type: Boolean,
    default: undefined,
  },
  dataFullWidthResponsive: {
    type: Boolean,
    default: undefined,
  },
  repeat: {
    type: Number,
    default: 5,
  },
});

const prod: boolean = import.meta.env.PROD;

const pushAdsense = () => {
  (window.adsbygoogle = window.adsbygoogle || []).push({});
};

const render = () => {
  void nextTick(() => {
    if (window.adsenseLoaded) pushAdsense();
    else window.addEventListener("adsense-loaded", pushAdsense);
  });
};

onMounted(() => {
  if (prod) render();
});

onUnmounted(() => {
  window.removeEventListener("adsense-loaded", pushAdsense);
});
</script>

<template>
  <ins
    class="adsbygoogle ins"
    :data-ad-client="dataAdClient"
    :data-ad-slot="dataAdSlot"
    :data-adtest="dataAdtest ? 'on' : null"
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

.ins[data-ad-status="unfilled"] {
  margin-top: 0;
  margin-bottom: 0;
}

.ins[data-ad-status="unfilled"] {
  padding: 0;
  background-color: inherit;
}
</style>
