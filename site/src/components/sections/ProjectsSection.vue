<script setup lang="ts">
import SectionCard from '../SectionCard.vue'
import type { ResumeProject } from '../../resume/resume'

const props = defineProps<{
  items: ResumeProject[]
}>()
</script>

<template>
  <SectionCard title="作品集" kicker="BUILD">
    <div class="grid gap-5 md:grid-cols-2">
      <article
        v-for="(p, idx) in props.items"
        :key="`${p.name}-${idx}`"
        class="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-5"
      >
        <header class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <h3 class="text-lg font-semibold leading-snug">{{ p.name }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">
              {{ p.description }}
            </p>
          </div>
        </header>

        <div v-if="p.tech?.length" class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="t in p.tech"
            :key="t"
            class="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs font-semibold text-[rgb(var(--muted))]"
          >
            {{ t }}
          </span>
        </div>

        <ul
          v-if="p.highlights?.length"
          class="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed"
        >
          <li v-for="(h, j) in p.highlights" :key="j">
            {{ h }}
          </li>
        </ul>

        <div v-if="p.links?.length" class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <a
            v-for="l in p.links"
            :key="l.url"
            :href="l.url"
            target="_blank"
            rel="noreferrer"
            class="font-semibold"
          >
            {{ l.label }}
          </a>
        </div>
      </article>
    </div>
  </SectionCard>
</template>

