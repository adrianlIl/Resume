<script setup lang="ts">
defineProps<{
  title: string
  kicker?: string
  right?: string
}>()
</script>

<template>
  <section
    class="print-avoid-break rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6"
  >
    <header class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
      <div>
        <p
          v-if="kicker"
          class="text-xs font-bold tracking-widest text-[rgb(var(--muted))]"
        >
          {{ kicker }}
        </p>
        <h2 class="text-xl font-semibold">{{ title }}</h2>
      </div>
      <p v-if="right" class="text-sm font-semibold text-[rgb(var(--muted))]">
        {{ right }}
      </p>
    </header>

    <div class="mt-4">
      <slot />
    </div>
  </section>
</template>

