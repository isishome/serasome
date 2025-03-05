---
title: Vue.js
titleTemplate: 계산된 속성
decscription: Vue.js에서 말하는 계산된 속성은 무엇이며 어디에 사용되는지 알아봅시다.
---

<script setup lang="ts">
import Example3 from './source/reactive/03.vue';
</script>

# 계산된 속성

::: info 들어가며

- 예제 코드는 Composition API 스타일과 정확한 타입 체크를 위해 `<script setup lang="ts">` 구문을 활용하여 작성합니다.
- 함수는 es6의 **화살표 함수**를 사용합니다.
  :::

## 계산된 속성을 쓰는 이유?

`Vue.js`로 컴포넌트를 작성하다 보면, 템플릿이 복잡해지는 경우가 종종 있습니다. 이는 데이터 조건에 따라 다양한 UI를 표시해야 할 때, 요소에 너무 많은 논리가 포함되기 때문입니다.\
따라서 반응형 데이터를 포함하는 복잡한 논리의 경우, **계산된 속성**을 사용하는 것이 좋습니다.

## computed()

템플릿 내 표현식은 매우 편리하지만 간단한 작업을 위한 것입니다. 템플릿에 너무 많은 논리를 넣으면 비대해져 유지 관리가 어려워질 수 있습니다. 다음 예제와 같이 사용자 데이터가 있고, 템플릿에 사용자의 정보(접속 여부, 서적 수)에 따라 UI를 표시해야 할 경우:

```ts
import { reactive } from 'vue'

type User = {
  id: number
  name: string
  status: 'ONLINE' | 'OFFLINE'
  books?: number
}

const users = reactive<Array<User>>([
  { id: 1, name: '홍길동', status: 'OFFLINE', books: 2 },
  { id: 2, name: '김철수', status: 'ONLINE' },
  { id: 3, name: '박영호', status: 'OFFLINE', books: 5 }
])
```

아래와 같이 템플릿에 논리를 추가해야 합니다. 상태뿐만 아니라 객체 내부에 배열이나 더 깊은 논리적 구조가 필요한 경우 템플릿은 더욱더 복잡해집니다.

```html
<template>
  <ul>
    <li
      v-for="user in users"
      :key="user.id"
      :style="{ color: user.status === 'ONLINE' ? 'green' : '' }"
    >
      <div>{{ user.name }}</div>
      <div v-show="user.books">서적 : {{ user.books }}</div>
    </li>
  </ul>
</template>
```

이제 템플릿에 사용자 접속 여부를 처리하는 `style` 구문을 계산된 속성으로 변경해 봅시다.

```ts
import { reactive, computed } from 'vue'
...
const style = computed(() => (user: User) => ({ color: user.status === 'ONLINE' ? 'green' : '' }))
```

```html
<template>
  <ul>
    <li v-for="user in users" :key="user.id" :style="style(user)">
      <div>{{ user.name }}</div>
      <div v-show="user.books">서적 : {{ user.books }}</div>
    </li>
  </ul>
</template>
```

여기에서 `style`이라는 계산된 속성을 선언했습니다. `computed()` 함수에서 반환된 값은 **ref**와 유사하게, 계산된 결과에 `style.value`로 접근할 수 있습니다. **ref**는 템플릿에서 자동으로 언래핑되기 때문에 템플릿 표현식에서 `.value` 없이 참조할 수 있습니다.

**계산된 속성**은 내부에 의존된 반응형 값들을 자동으로 추적합니다. **Vue**는 `style`의 값이 `user.status`에 의존한다는 것을 알고 있으므로, `user.status` 변경되면 `style`을 바인딩해 의존하는 모든 것을 업데이트합니다.

간단히 말해, **계산된 속성**은 <u>**읽기 전용인 반응형 속성**</u>이라고 볼 수 있습니다.

더 나아가 **SFC** (Single File Component)의 장점을 이용하여 스타일을 추가로 지정해 봅시다.

```ts
const style = computed(() => (user: User) => ({ color: user.status === 'ONLINE' ? 'green' : '' })) // [!code --]
const onlineClass = computed(() => (user: User) => (user.status === 'ONLINE' ? 'online' : '')) // [!code ++]
```

이제 계산된 속성인 `onlineClass`는 **style 객체**를 반환하는 대신 `online`이라는 스타일 클래스명을 반환합니다. `.online` 스타일도 추가해 줍니다.

```css
.online {
  color: green;
}
```

사용자 정보가 아래와 같이 표시됩니다.
<ClientOnly>
<Example3 />
</ClientOnly>

전체소스:

```vue
<script setup lang="ts">
import { reactive, computed } from "vue";

type User = {
  id: number;
  name: string;
  status: "ONLINE" | "OFFLINE";
  books?: number;
};

const users = reactive<Array<User>>([
  { id: 1, name: "홍길동", status: "OFFLINE", books: 2 },
  { id: 2, name: "김철수", status: "ONLINE" },
  { id: 3, name: "박영호", status: "OFFLINE", books: 5 },
]);
const onlineClass = computed(
  () => (user: User) => user.status === "ONLINE" ? "online" : ""
);
</script>

<template>
  <ul>
    <li v-for="user in users" :key="user.id" :class="onlineClass(user)">
      <div>{{ user.name }}</div>
      <div v-show="user.books">서적 : {{ user.books }}</div>
    </li>
  </ul>
</template>

<style scoped>
.online {
  color: green;
}
</style>

```
