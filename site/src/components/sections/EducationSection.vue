<script setup lang="ts">
import SectionCard from '../SectionCard.vue'
import type { ResumeEducation } from '../../resume/resume'

const props = defineProps<{
  items: ResumeEducation[]
}>()

function rangeText(start?: string, end?: string) {
  if (!start && !end) return ''
  if (start && end) return `${start} — ${end}`
  return start || end || ''
}
</script>

<template>
  <SectionCard title="學歷" kicker="STUDY">
    <ol class="grid gap-4">
      <li
        v-for="(e, idx) in props.items"
        :key="`${e.school}-${idx}`"
        class="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-5"
      >
        <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <div class="min-w-0">
            <h3 class="text-base font-semibold">{{ e.school }}</h3>
            <p class="mt-1 text-sm text-[rgb(var(--muted))]">
              <span v-if="e.degree">{{ e.degree }}</span>
              <span v-if="e.degree && e.department"> · </span>
              <span v-if="e.department">{{ e.department }}</span>
            </p>
          </div>
          <p v-if="rangeText(e.start, e.end)" class="text-sm font-semibold text-[rgb(var(--muted))]">
            {{ rangeText(e.start, e.end) }}
          </p>
        </div>

        <ul
          v-if="e.highlights?.length"
          class="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed"
        >
          <li v-for="(h, j) in e.highlights" :key="j">
            {{ h }}
          </li>
        </ul>
      </li>
    </ol>
  </SectionCard>
</template>

