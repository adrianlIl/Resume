<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import {
  applyResolvedTheme,
  getThemePreference,
  getSystemTheme,
  setThemePreference,
  type ThemePreference,
  watchSystemThemeChange,
} from '../lib/theme'

const pref = ref<Exclude<ThemePreference, 'system'>>('dark')

let stopWatch: (() => void) | undefined

onMounted(() => {
  const stored = getThemePreference()
  // Migrate legacy "system" to a concrete theme, since UI only exposes light/dark.
  const next = stored === 'system' ? getSystemTheme() : stored
  pref.value = next
  applyResolvedTheme(next)
  stopWatch = watchSystemThemeChange((t) => {
    // If user chose dark/light, we don't follow system changes.
    void t
  })
})

onBeforeUnmount(() => {
  stopWatch?.()
})

function setPref(next: Exclude<ThemePreference, 'system'>) {
  pref.value = next
  setThemePreference(next)
}
</script>

<template>
  <div class="inline-flex items-center gap-1 rounded-full border px-1 py-1"
    :style="{ borderColor: `rgb(var(--border))`, background: `rgb(var(--card))` }"
  >
    <button
      type="button"
      class="rounded-full px-3 py-1 text-sm font-semibold transition"
      :class="
        pref === 'light'
          ? 'text-white'
          : 'text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]'
      "
      :style="pref === 'light' ? { background: `rgb(var(--accent))` } : {}"
      @click="setPref('light')"
    >
      Light
    </button>
    <button
      type="button"
      class="rounded-full px-3 py-1 text-sm font-semibold transition"
      :class="
        pref === 'dark'
          ? 'text-white'
          : 'text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]'
      "
      :style="pref === 'dark' ? { background: `rgb(var(--accent))` } : {}"
      @click="setPref('dark')"
    >
      Dark
    </button>
  </div>
</template>

