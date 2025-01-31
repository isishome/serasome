import { ref, onMounted, onUnmounted } from 'vue'

export function useResize(debounceTime = 200) {
  const width = ref(window?.innerWidth ?? 0)
  const height = ref(window?.innerHeight ?? 0)
  let timeoutId: NodeJS.Timeout

  const updateSize = () => {
    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      width.value = window.innerWidth
      height.value = window.innerHeight
    }, debounceTime)
  }

  onMounted(() => {
    window.addEventListener('resize', updateSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize)
    if (timeoutId) clearTimeout(timeoutId)
  })

  return { width, height }
}
