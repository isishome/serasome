<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";

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
    default: null,
  },
  dataFullWidthResponsive: {
    type: Boolean,
    default: null,
  },
  repeat: {
    type: Number,
    default: 5,
  },
});

const prod: boolean = import.meta.env.PROD;
let timer: NodeJS.Timeout;
const repeat = ref(0);
const dataAdtest = computed(() =>
  import.meta.env.DEV || !!!props.dataAdSlot ? "on" : null
);

const render = () => {
  repeat.value++;
  if (repeat.value > props.repeat) clearTimeout(timer);
  else if (!!window?.adsbygoogle) (window.adsbygoogle || []).push({});
  else timer = setTimeout(render, 400);
};

const load = () => {
  const adURL = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${props.dataAdClient}`;
  const script = document.createElement("script");
  script.src = adURL;

  script.async = true;
  script.crossOrigin = "anonymous";

  if (!document.head.querySelector(`script[src="${adURL}"]`)) {
    script.onload = () => {
      render();
    };

    document.head.appendChild(script);
  } else render();
};

onMounted(() => {
  if (prod) load();
});

onUnmounted(() => {
  clearTimeout(timer);
});
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

.ins[data-ad-status="unfilled"] {
  margin-top: 0;
  margin-bottom: 0;
}

.ins[data-ad-status="unfilled"] {
  padding: 0;
  background-color: inherit;
}
</style>
