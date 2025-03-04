<script setup lang="ts">
import { reactive } from 'vue'

type State = {
  count: number
}

const state = reactive<State>({ count: 0 })
</script>

<template>
  <div>
    <button @click="state.count++" style="all: revert">
      {{ state.count }}
    </button>
  </div>
</template>
