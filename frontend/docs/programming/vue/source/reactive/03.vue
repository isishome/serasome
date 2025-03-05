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
