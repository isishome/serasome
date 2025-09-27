<script setup lang="ts">
import { ref, computed, watch } from "vue";
import DefaultTheme from "vitepress/theme";
import Adsense from "./Adsense.vue";
import { useResize } from "./useResize";
import { useRoute } from "vitepress";

const { Layout } = DefaultTheme;
const prod = process.env.NODE_ENV === "production";
const { width } = useResize();
const route = useRoute();

const topAdKey = ref<number>(0);
const bottomAdKey = ref<number>(0);
const rightAdKey = ref<number>(0);

const size = computed(() =>
  width.value < 320
    ? "width:300px;max-height:50px;"
    : width.value < 468
    ? "width:300px;max-height:100px;"
    : width.value < 728
    ? "width:468px;height:60px;"
    : "width:728px;height:90px;"
);

const routeName = computed(() => route.path);

watch([size, routeName], ([valSize, valName], [oldSize, oldName]) => {
  if (valSize !== oldSize || valName !== oldName) {
    topAdKey.value++;
    bottomAdKey.value++;
    rightAdKey.value++;
  }
});
</script>

<template>
  <Layout>
    <template #doc-before>
      <div class="flex-center">
        <ClientOnly>
          <Adsense
            justify="center"
            :style="`display:inline-block;${size}`"
            data-ad-slot="7595465749"
            :data-adtest="!prod"
            :key="`top-${topAdKey}`"
          />
        </ClientOnly>
      </div>
    </template>
    <template #aside-ads-before>
      <div class="flex-right">
        <ClientOnly>
          <Adsense
            v-if="width >= 1280"
            style="display: inline-block; width: 160px; height: 600px"
            data-ad-slot="7901796235"
            :data-adtest="!prod"
            :key="`right-${rightAdKey}`"
          />
        </ClientOnly>
      </div>
    </template>
    <template #doc-after>
      <div class="flex-center" style="margin-top: 16px">
        <ClientOnly>
          <Adsense
            v-if="width < 1280"
            justify="center"
            style="display: block; width: 100%"
            data-ad-slot="2989257893"
            :data-adtest="!prod"
            data-ad-format="auto"
            data-full-width-responsive="true"
            :key="`bottom-${bottomAdKey}`"
          />
        </ClientOnly>
      </div>
    </template>
  </Layout>
</template>
<style scoped="module">
.flex-center {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

@media (max-width: 600px) {
  .flex-center {
    margin-bottom: 16px;
  }
}

.flex-right {
  margin-top: 32px;
}
</style>
