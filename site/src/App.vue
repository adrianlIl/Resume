<script setup lang="ts">
import ThemeToggle from './components/ThemeToggle.vue'
import { resume } from './resume/resume'
import ExperienceSection from './components/sections/ExperienceSection.vue'
import ProjectsSection from './components/sections/ProjectsSection.vue'
import SkillsSection from './components/sections/SkillsSection.vue'
import EducationSection from './components/sections/EducationSection.vue'

function printPdf() {
  window.print()
}
</script>

<template>
  <div class="min-h-dvh">
    <div class="mx-auto max-w-5xl px-6 py-10">
      <header class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-semibold tracking-wide text-[rgb(var(--muted))]">
            Resume
          </p>
          <h1 class="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">
            {{ resume.basics.name }}
          </h1>
          <p class="mt-2 text-base font-semibold text-[rgb(var(--fg))]">
            {{ resume.basics.headline }}
          </p>
          <p class="mt-3 max-w-2xl text-base leading-relaxed text-[rgb(var(--muted))]">
            {{ resume.basics.summary }}
          </p>
          <div class="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
            <a v-if="resume.basics.email" :href="`mailto:${resume.basics.email}`">
              {{ resume.basics.email }}
            </a>
            <a v-if="resume.basics.phone" :href="`tel:${resume.basics.phone}`">
              {{ resume.basics.phone }}
            </a>
            <span v-if="resume.basics.location" class="text-[rgb(var(--muted))]">
              {{ resume.basics.location }}
            </span>
            <a
              v-for="l in resume.basics.links"
              :key="l.url"
              :href="l.url"
              target="_blank"
              rel="noreferrer"
            >
              {{ l.label }}
            </a>
          </div>
        </div>

        <div class="no-print flex flex-wrap items-center justify-start gap-3 sm:justify-end">
          <button
            type="button"
            class="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2 text-sm font-semibold text-[rgb(var(--fg))] transition hover:brightness-95"
            @click="printPdf"
          >
            Print / PDF
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main class="mt-10 grid gap-6">
        <ExperienceSection v-if="resume.experience.length" :items="resume.experience" />
        <ProjectsSection v-if="resume.projects.length" :items="resume.projects" />
        <SkillsSection v-if="resume.skills.length" :items="resume.skills" />
        <EducationSection v-if="resume.education.length" :items="resume.education" />
      </main>

      <footer class="mt-10 text-sm text-[rgb(var(--muted))]">
        <p>
          Tip: 之後我會加「列印/輸出 PDF」友善版面（A4/Letter）。
        </p>
      </footer>
    </div>
  </div>
</template>
