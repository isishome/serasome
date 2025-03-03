<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(0)

const increase = () => {
  count.value++
}
</script>

<template>
  <div>
    <button @click="increase" style="all: revert">
      {{ count }}
    </button>
  </div>
</template>
