<script setup lang="ts">
import { isDark } from '@advjs/core'
// todo: fix type
// @ts-expect-error vue-about-me
import VueAboutMe from 'vue-about-me'
import pkg from '../package.json'

import 'vue-about-me/style.css'

const copyright = {
  name: 'ADV.JS',
  repo: pkg.name,
  author: pkg.author.name,
}
</script>

<template>
  <VueAboutMe :is-dark="isDark" :copyright="copyright" />
</template>
