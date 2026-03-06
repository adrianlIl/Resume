<script setup lang="ts">
import SectionCard from '../SectionCard.vue'
import type { ResumeExperience } from '../../resume/resume'

const props = defineProps<{
  items: ResumeExperience[]
}>()

function rangeText(start: string, end?: string) {
  return end ? `${start} — ${end}` : `${start} — Present`
}
</script>

<template>
  <SectionCard title="工作經驗" kicker="WORK">
    <ol class="grid gap-6">
      <li
        v-for="(x, idx) in props.items"
        :key="`${x.company}-${x.role}-${idx}`"
        class="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-5"
      >
        <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <div class="min-w-0">
            <p class="text-base font-semibold">
              {{ x.role }}
              <span class="font-normal text-[rgb(var(--muted))]"> @ </span>
              <span class="text-[rgb(var(--fg))]">{{ x.company }}</span>
            </p>
            <p v-if="x.location" class="mt-1 text-sm text-[rgb(var(--muted))]">
              {{ x.location }}
            </p>
          </div>
          <p class="text-sm font-semibold text-[rgb(var(--muted))]">
            {{ rangeText(x.start, x.end) }}
          </p>
        </div>

        <ul class="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
          <li v-for="(h, j) in x.highlights" :key="j">
            {{ h }}
          </li>
        </ul>
      </li>
    </ol>
  </SectionCard>
</template>

