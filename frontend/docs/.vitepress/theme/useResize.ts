import { ref, onMounted, onUnmounted } from 'vue'

export function useResize(debounceTime = 200) {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)
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
