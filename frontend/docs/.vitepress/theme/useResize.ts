import { ref, onMounted, onUnmounted } from 'vue'

export function useResize(debounceTime = 200) {
  const width = ref(import.meta.env.SSR ? 0 : window.innerWidth)
  const height = ref(import.meta.env.SSR ? 0 : window.innerHeight)
  let timeoutId: NodeJS.Timeout

  const updateSize = () => {
    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      width.value = import.meta.env.SSR ? 0 : window.innerWidth
      height.value = import.meta.env.SSR ? 0 : window.innerHeight
    }, debounceTime)
  }

  onMounted(() => {
    if (!import.meta.env.SSR) window.addEventListener('resize', updateSize)
  })

  onUnmounted(() => {
    if (!import.meta.env.SSR) window.removeEventListener('resize', updateSize)
    if (timeoutId) clearTimeout(timeoutId)
  })

  return { width, height }
}
