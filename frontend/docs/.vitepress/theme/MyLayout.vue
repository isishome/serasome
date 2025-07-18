<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Adsense from './Adsense.vue'
import { useResize } from './useResize'
import { useRoute } from 'vitepress'

const { Layout } = DefaultTheme
const prod = process.env.NODE_ENV === 'production'
const { width } = useResize()
const route = useRoute()

const loaded = ref(false)
const topAdKey = ref<number>(0)
const bottomAdKey = ref<number>(0)
const rightAdKey = ref<number>(0)

const size = computed(() =>
  width.value < 320
    ? 'width:300px;max-height:100px;'
    : width.value < 468
    ? 'width:320px;max-height:100px;'
    : width.value < 728
    ? 'width:468px;height:60px;'
    : 'width:728px;height:90px;'
)
const sizeBottom = computed(() =>
  width.value < 300
    ? 'display:inline-block;width:250px;height:250px;'
    : width.value < 336
    ? 'display:inline-block;width:300px;height:250px;'
    : width.value < 468
    ? 'display:inline-block;width:336px;height:280px;'
    : width.value < 728
    ? 'display:inline-block;width:468px;height:60px;'
    : 'display:inline-block;width:728px;height:90px;'
)
const routeName = computed(() => route.path)

watch([size, routeName], ([valSize, valName], [oldSize, oldName]) => {
  if (valSize !== oldSize || valName !== oldName) {
    topAdKey.value++
    bottomAdKey.value++
    rightAdKey.value++
  }
})

onMounted(() => {
  loaded.value = true
})
</script>

<template>
  <Layout>
    <template #doc-before>
      <div class="flex-center">
        <Adsense
          v-if="loaded"
          justify="center"
          :style="size"
          data-ad-slot="7595465749"
          :data-adtest="!prod"
          data-ad-format="horizontal"
          :data-full-width-responsive="false"
          :key="`top-${topAdKey}`"
        />
      </div>
    </template>
    <template #aside-ads-before>
      <div class="flex-right">
        <Adsense
          v-if="loaded && width >= 1280"
          style="display: inline-block; width: 160px; height: 600px"
          data-ad-slot="7901796235"
          :data-adtest="!prod"
          :data-full-width-responsive="false"
          :key="`right-${rightAdKey}`"
        />
      </div>
    </template>
    <template #doc-after>
      <div class="flex-center" style="margin-top: 16px">
        <Adsense
          v-if="loaded && width < 1280"
          justify="center"
          :style="sizeBottom"
          data-ad-slot="2989257893"
          :data-adtest="!prod"
          data-ad-format="horizontal"
          :data-full-width-responsive="true"
          :key="`bottom-${bottomAdKey}`"
        />
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
