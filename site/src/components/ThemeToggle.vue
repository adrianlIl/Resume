<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  applyResolvedTheme,
  getThemePreference,
  resolveTheme,
  setThemePreference,
  type ThemePreference,
  watchSystemThemeChange,
} from '../lib/theme'

const pref = ref<ThemePreference>('system')

const resolved = computed(() => resolveTheme(pref.value))

let stopWatch: (() => void) | undefined

onMounted(() => {
  pref.value = getThemePreference()
  applyResolvedTheme(resolveTheme(pref.value))
  stopWatch = watchSystemThemeChange((t) => {
    if (pref.value === 'system') applyResolvedTheme(t)
  })
})

onBeforeUnmount(() => {
  stopWatch?.()
})

function setPref(next: ThemePreference) {
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
    <button
      type="button"
      class="rounded-full px-3 py-1 text-sm font-semibold transition"
      :class="
        pref === 'system'
          ? 'text-white'
          : 'text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]'
      "
      :style="pref === 'system' ? { background: `rgb(var(--accent))` } : {}"
      @click="setPref('system')"
    >
      System ({{ resolved }})
    </button>
  </div>
</template>

