<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

withDefaults(defineProps<{ duration?: number }>(), {
  duration: 2000,
})

const router = useRouter()
function onLoaded() {
  router.push('/start')
}

onMounted(() => {
  setTimeout(() => {
    onLoaded()
  }, 1)
})
</script>

<template>
  <main
    class="animate__animated animate__fadeIn h-screen w-screen flex flex-col items-center justify-center opacity-90"
  >
    <NewYunLogo class="h-40 w-40" />
    <div class="font-bold">
      Made with <a href="https://advjs.org/" target="_blank">ADV.JS</a>
    </div>

    <!-- <StartLoading :assets="assets" @loaded="onLoaded" /> -->
  </main>
</template>

<route lang="yaml">
meta:
  layout: logo
</route>
