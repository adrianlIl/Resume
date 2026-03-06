<script setup lang="ts">
import SectionCard from '../SectionCard.vue'
import type { ResumeSkillGroup } from '../../resume/resume'

const props = defineProps<{
  items: ResumeSkillGroup[]
}>()
</script>

<template>
  <SectionCard title="技能" kicker="STACK">
    <div class="grid gap-5 md:grid-cols-2">
      <div
        v-for="(g, idx) in props.items"
        :key="`${g.group}-${idx}`"
        class="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-5"
      >
        <h3 class="text-sm font-bold tracking-wide text-[rgb(var(--muted))]">
          {{ g.group }}
        </h3>
        <div class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="s in g.skills"
            :key="s"
            class="rounded-full bg-[rgb(var(--card))] px-3 py-1 text-xs font-semibold"
            :style="{ border: `1px solid rgb(var(--border))` }"
          >
            {{ s }}
          </span>
        </div>
      </div>
    </div>
  </SectionCard>
</template>

