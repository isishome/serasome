---
title: Vue.js
titleTemplate: 반응형 기초
decscription: Vue.js의 시작과 끝인 반응형에 대해 알아봅시다.
---

# 반응형 기초

::: info 들어가며

- 반응형 코드는 Composition API 스타일과 `<script setup>` 구문을 활용하여 작성합니다.
- 함수는 es6의 **화살표 함수**를 사용합니다.
  :::

## Vue 반응형의 중요성

Vue.js 프레임워크는 반응형으로 시작하여 반응형으로 끝난다고 해도 과언이 아닙니다.\
그만큼 Vue.js에서 반응형은 가상돔과 더불어 가장 중요한 요소이기도 합니다.

### ref

Composition API에서 반응형 상태를 선언하는 권장 방법은 `ref()` 함수를 사용하는 것입니다

```ts
import { ref } from 'vue'

const count = ref<number>(0)
```

반응형 변수 `count`를 1씩 증가시키는 함수인 `increase`도 추가해 봅시다.

```ts
import { ref } from 'vue'

const count = ref<number>(0)

const increase = () => {
  count.value++
}
```

이제 템플릿에 버튼 요소를 추가하고 버튼을 누를 때마다 `increase` 함수를 호출하도록 해봅시다.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(0)

const increase = () => {
  count.value++
}
</script>

<template>
  <div>
    <button @click="increase">
      {{ count }}
    </button>
  </div>
</template>
```

위 코드로 만들어진 버튼을 클릭해 보세요.\
버튼 내부에 정의한 `count`값의 UI가 자동으로 리 렌더링 됩니다.

<ClientOnly>
<Example1 />
</ClientOnly>

<script setup lang="ts">
import Example1 from './source/reactive/01.vue';
</script>

::: info 반응형
`ref` 함수는 내부적으로 **Proxy** 객체를 사용하여 반응형으로 동작합니다.
`ref`로 생성된 변수의 `.value` 속성을 변경하면, 내부 감시자가 해당 변화를 감지하여 UI를 자동으로 다시 렌더링합니다.

- **`template` 내부에서는 `.value`를 사용하지 않아도 자동으로 언래핑 됩니다**
  :::
