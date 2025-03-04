---
title: Vue.js
titleTemplate: 반응형 기초
decscription: Vue.js의 시작과 끝인 반응형에 대해 알아봅시다.
---

<script setup lang="ts">
import Example1 from './source/reactive/01.vue';
import Example2 from './source/reactive/02.vue';
</script>

# 반응형 기초

::: info 들어가며

- 반응형 코드는 Composition API 스타일과 정확한 타입체크를 위해 `<script setup lang="ts">` 구문을 활용하여 작성합니다.
- 함수는 es6의 **화살표 함수**를 사용합니다.
  :::

## Vue 반응형의 중요성

Vue.js 프레임워크는 반응형으로 시작하여 반응형으로 끝난다고 해도 과언이 아닙니다.\
그만큼 Vue.js에서 반응형은 가상돔과 더불어 가장 중요한 요소이기도 합니다.

## ref()

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

::: info ref() 반응형
`ref()` 함수는 내부적으로 **Proxy** 객체를 사용하여 반응형으로 동작합니다.
`ref()`로 생성된 변수의 `.value` 속성을 변경하면, 내부 감시자가 해당 변화를 감지하여 DOM을 적절하게 업데이트합니다.

- **`template` 내부에서는 `.value`를 사용하지 않아도 자동으로 언래핑 됩니다**
  :::

보통 `ref()`는 string, number, boolean, undefined, null, bigint, symbol과 같은 원시타입을 반응형으로 만들 때 사용됩니다.

그렇다면 객체나 배열과 같은 `Object` 타입에는 어떤 함수를 사용할까요?

## reactive()

`reactive()`는 반응 상태를 선언하는 또다른 API 입니다. 내부 값을 특수 객체로 감싸는 `ref()`와 달리 `reactive()`는 객체 자체를 반응형으로 만듭니다.

```ts
import { reactive } from 'vue'

type State = {
  count: number
}

const state = reactive<State>({ count: 0 })
```

`ref()`에서 사용한 예제를 수정해서 아래와 같이 작성해 봅시다.

```vue
<script setup lang="ts">
import { reactive } from 'vue'

type State = {
  count: number
}

const state = reactive<State>({ count: 0 })
</script>

<template>
  <div>
    <button @click="state.count++">
      {{ state.count }}
    </button>
  </div>
</template>
```

위 코드로 만들어진 버튼을 클릭해 보세요.\
`ref()`에서 만든 예제와 동일하게 동작합니다.

<ClientOnly>
<Example2 />
</ClientOnly>

::: info reactive() 반응형
`reactive()` 함수는 객체 자체를 반응형으로 만듭니다.
보통은 깊은 객체나 배열을 다룰 때 사용합니다. 간단한 구조: 예를 들어 위 예제와 같은 객체의 경우 얕은 참조 API 함수인 `shallowReactive()`를 사용하는 것이 성능에 도움을 줄 수 있습니다.
:::

## 그 외 반응형 API 함수들

반응형 API를 더 이해하고 싶은 경우, 예를 들어 계산된 속성이나 반응형 데이터를 감지하고 특정한 동작을 하고싶은 경우 아래와 같은 API 함수들을 사용할 수도 있습니다.

- computed()
- readonly()
- watchEffect()
- watchPostEffect()
- watchSyncEffect()
- watch()
- onWatcherCleanup()

만약 성능까지 고려한 개발이 필요한 경우 반응형이 필요한 객체나 원시 데이터에 따라(**얕은 데이터 구조**) 아래와 같은 API 함수들을 사용할 수도 있습니다.

- shallowRef()
- shallowReactive()
- shallowReadonly()

그리고 특정한 기능을 갖는 반응형 API 함수들도 있습니다.

- triggerRef()
- customRef()
- toRaw()
- markRaw()
- effectScope()
- getCurrentScope()
- onScopeDispose()

반응형 API에 대한 자세한 설명은 공식 사이트의 [반응형 API: 핵심](https://ko.vuejs.org/api/reactivity-core.html)과 [반응형 API: 고급](https://ko.vuejs.org/api/reactivity-advanced.html)을 참고하세요.

::: warning 얕은 참조 사용 시 주의사항
얕은 데이터 구조는 컴포넌트에서 루트 수준 상태로만 사용해야 합니다. 내부 깊숙이까지 반응형으로 동작하는 객체 내부에 중첩하는 경우, 반응형 동작에 일관성이 없는 트리가 생성되어 이해와 디버그가 어려울 수 있으니, 중첩하여 사용하면 안됩니다.
:::
