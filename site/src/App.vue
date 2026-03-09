<script setup lang="ts">
import ThemeToggle from './components/ThemeToggle.vue'
import { resume } from './resume/resume'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const heroKicker = 'HELLO'

function takeSentences(input: string, maxSentences: number) {
  const s = input.trim()
  if (!s) return ''

  // Match sentence terminators for zh/en.
  const seps = new Set(['。', '.', '！', '!', '？', '?'])
  let out = ''
  let count = 0
  for (let i = 0; i < s.length; i++) {
    const ch = s.charAt(i)
    out += ch
    if (seps.has(ch)) {
      count++
      if (count >= maxSentences) break
    }
  }
  return out.trim() || s
}

const quickIntro = computed(() => {
  return takeSentences(resume.basics.summary, 1)
})

const intro2 = computed(() => takeSentences(resume.basics.summary, 2))

const techList = computed(() => {
  const fromSkills = resume.skills.flatMap((g) => g.skills)
  const fromProjects = resume.projects.flatMap((p) => p.tech ?? [])
  const all = [...fromSkills, ...fromProjects].map((x) => x.trim()).filter(Boolean)
  return Array.from(new Set(all)).slice(0, 28)
})

const softSkills = [
  '跨部門溝通',
  '需求釐清',
  '團隊協作',
  '主動回報',
  '時間管理',
  '問題拆解',
  '自我驅動',
  '細節敏感度',
]

const cursorDot = ref<HTMLDivElement | null>(null)
const cursorRing = ref<HTMLDivElement | null>(null)

let cleanupFns: Array<() => void> = []

function getGsap() {
  const w = window as any
  return {
    gsap: w.gsap as any | undefined,
    ScrollTrigger: w.ScrollTrigger as any | undefined,
  }
}

function setupIntroAndScrollAnimations() {
  const { gsap, ScrollTrigger } = getGsap()
  if (!gsap || !ScrollTrigger) return

  gsap.registerPlugin(ScrollTrigger)

  gsap.fromTo(
    '.js-hero-fade-up',
    { y: 36, opacity: 0, filter: 'blur(6px)' },
    {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.05,
      ease: 'power3.out',
      stagger: 0.08,
      delay: 0.1,
      clearProps: 'filter',
    },
  )

  const revealEls = Array.from(
    document.querySelectorAll<HTMLElement>('[data-reveal]'),
  )

  for (const el of revealEls) {
    const mode = el.dataset.reveal
    const from: Record<string, any> = { opacity: 0, duration: 0.9, ease: 'power3.out' }

    if (mode === 'left') from.x = -48
    else if (mode === 'right') from.x = 48
    else if (mode === 'scale') from.scale = 0.92
    else from.y = 24

    gsap.from(el, {
      ...from,
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        end: 'bottom 50%',
        toggleActions: 'play none none reverse',
      },
    })
  }

  const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('.js-parallax'))
  const root = document.querySelector<HTMLElement>('#app')
  if (root) {
    for (const el of parallaxEls) {
      const depth = Number(el.dataset.depth ?? '0.2')
      gsap.to(el, {
        y: depth * 220,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })
    }
  }
}

function setupCustomCursor() {
  const finePointer = window.matchMedia?.('(pointer: fine)').matches
  if (!finePointer) return

  const dot = cursorDot.value
  const ring = cursorRing.value
  if (!dot || !ring) return

  const { gsap } = getGsap()

  const setVisible = (v: boolean) => {
    dot.style.opacity = v ? '1' : '0'
    ring.style.opacity = v ? '1' : '0'
  }

  setVisible(false)

  const onMove = (e: MouseEvent) => {
    setVisible(true)
    if (gsap) {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power3.out' })
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.18, ease: 'power3.out' })
      return
    }

    dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    ring.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
  }

  const onLeave = () => setVisible(false)
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mouseleave', onLeave)

  const hoverTargets = Array.from(
    document.querySelectorAll<HTMLElement>('a, button, [data-cursor="link"]'),
  )

  const onEnterInteractive = () => ring.classList.add('is-hover')
  const onExitInteractive = () => ring.classList.remove('is-hover')

  for (const t of hoverTargets) {
    t.addEventListener('mouseenter', onEnterInteractive)
    t.addEventListener('mouseleave', onExitInteractive)
    t.addEventListener('focus', onEnterInteractive)
    t.addEventListener('blur', onExitInteractive)
  }

  cleanupFns.push(() => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseleave', onLeave)
    for (const t of hoverTargets) {
      t.removeEventListener('mouseenter', onEnterInteractive)
      t.removeEventListener('mouseleave', onExitInteractive)
      t.removeEventListener('focus', onEnterInteractive)
      t.removeEventListener('blur', onExitInteractive)
    }
  })
}

function rangeText(start: string, end?: string) {
  return end ? `${start} — ${end}` : `${start} — Present`
}

onMounted(async () => {
  await nextTick()
  setupIntroAndScrollAnimations()
  const { ScrollTrigger } = getGsap()
  ScrollTrigger?.refresh?.()
  setupCustomCursor()
})

onBeforeUnmount(() => {
  for (const fn of cleanupFns) fn()
  cleanupFns = []
})
</script>

<template>
  <div class="relative min-h-dvh overflow-x-clip w-full">
    <!-- Parallax background -->
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 overflow-hidden w-screen">
      <div
        class="js-parallax absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(var(--accent)/0.35),transparent_60%)] blur-2xl"
        data-depth="0.25"
      />
      <div
        class="js-parallax absolute top-40 -left-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.22),transparent_60%)] blur-2xl"
        data-depth="0.18"
      />
      <div
        class="js-parallax absolute top-[740px] -right-36 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(167,139,250,0.18),transparent_60%)] blur-2xl"
        data-depth="0.22"
      />
      <div class="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0)_0%,rgba(2,6,23,0.35)_35%,rgba(2,6,23,0.65)_100%)]" />
      <div class="grid-mask absolute inset-0 opacity-30" />
      <div class="noise absolute inset-0 opacity-35" />
    </div>

    <!-- Nav -->
    <nav class="sticky top-0 z-40 border-b border-[rgb(var(--border)/0.5)] bg-[rgb(var(--bg)/0.72)] backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" class="group inline-flex items-center gap-2 font-semibold tracking-tight">
          <span class="inline-block h-2.5 w-2.5 rounded-full bg-[rgb(var(--accent))] shadow-[0_0_0_6px_rgb(var(--accent)/0.12)] transition group-hover:shadow-[0_0_0_10px_rgb(var(--accent)/0.16)]" />
          <span class="text-sm text-[rgb(var(--fg))]">{{ resume.basics.name }}</span>
        </a>

        <div class="hidden items-center gap-6 text-sm font-semibold text-[rgb(var(--muted))] md:flex">
          <a href="#about" class="hover:text-[rgb(var(--fg))]">關於我</a>
          <a href="#experience" class="hover:text-[rgb(var(--fg))]">經歷</a>
          <a href="#stack" class="hover:text-[rgb(var(--fg))]">技術棧</a>
          <a href="#projects" class="hover:text-[rgb(var(--fg))]">作品集</a>
          <a href="#contact" class="hover:text-[rgb(var(--fg))]">聯絡</a>
        </div>

        <div class="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <header id="top" class="mx-auto max-w-[1600px] px-6 pb-10 pt-14 md:pb-16 md:pt-20">
      <div class="grid items-start gap-10 md:grid-cols-[1.15fr_.85fr]">
        <div>
          <p class="js-hero-fade-up inline-flex items-center gap-2 text-xs font-bold tracking-[0.24em] text-[rgb(var(--muted))]">
            <span class="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))]" />
            {{ heroKicker }}
          </p>
          <h1 class="js-hero-fade-up mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-[rgb(var(--fg))] sm:text-5xl md:text-6xl">
            {{ resume.basics.name }}
          </h1>
          <p class="js-hero-fade-up mt-4 text-base font-semibold text-[rgb(var(--fg))] sm:text-lg">
            {{ resume.basics.headline }}
          </p>
          <p class="js-hero-fade-up mt-4 max-w-2xl text-base leading-relaxed text-[rgb(var(--muted))]">
            {{ quickIntro }}
          </p>

          <div class="js-hero-fade-up mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              class="inline-flex items-center justify-center rounded-full bg-[rgb(var(--accent))] px-5 py-2.5 text-sm font-bold text-[rgb(var(--bg))] shadow-[0_10px_30px_rgb(var(--accent)/0.18)] transition hover:brightness-105 active:brightness-95"
              data-cursor="link"
            >
              看作品
            </a>
            <a
              href="#contact"
              class="inline-flex items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card)/0.65)] px-5 py-2.5 text-sm font-bold text-[rgb(var(--fg))] backdrop-blur transition hover:bg-[rgb(var(--card)/0.9)]"
              data-cursor="link"
            >
              聯絡我
            </a>
          </div>

          <div class="js-hero-fade-up mt-7 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-[rgb(var(--muted))]">
            <span v-if="resume.basics.location" class="inline-flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent)/0.75)]" />
              {{ resume.basics.location }}
            </span>
            <a v-if="resume.basics.email" :href="`mailto:${resume.basics.email}`" class="hover:text-[rgb(var(--fg))]">
              {{ resume.basics.email }}
            </a>
            <a v-if="resume.basics.phone" :href="`tel:${resume.basics.phone}`" class="hover:text-[rgb(var(--fg))]">
              {{ resume.basics.phone }}
            </a>
          </div>
        </div>

        <div class="js-hero-fade-up self-start rounded-3xl border border-[rgb(var(--border)/0.75)] bg-[rgb(var(--card)/0.55)] p-6 backdrop-blur">
          <p class="text-xs font-bold tracking-[0.24em] text-[rgb(var(--muted))]">
            HIGHLIGHTS
          </p>
          <ul class="mt-4 space-y-2.5 text-sm leading-relaxed text-[rgb(var(--fg))]">
            <li class="flex gap-3">
              <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]" />
              <span>以使用者體驗為核心，做出直覺、流暢、可維護的介面。</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]" />
              <span>熟悉 RWD、元件化、與 API 串接，並重視效能與細節。</span>
            </li>
            <li class="flex gap-3">
              <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]" />
              <span>能與設計/後端/客戶順暢溝通，把需求落地成成果。</span>
            </li>
          </ul>

          <div class="mt-5 border-t border-[rgb(var(--border)/0.7)] pt-4">
            <p class="text-xs font-bold tracking-[0.24em] text-[rgb(var(--muted))]">
              LINKS
            </p>
            <div class="mt-2.5 flex flex-wrap gap-2">
              <a
                v-for="l in resume.basics.links"
                :key="l.url"
                :href="l.url"
                target="_blank"
                rel="noreferrer"
                class="chip"
                data-cursor="link"
              >
                {{ l.label }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto grid max-w-[1600px] gap-14 px-6 pb-20 md:gap-20 md:pb-28">
      <!-- About -->
      <section id="about" class="scroll-mt-24">
        <div class="grid gap-8 w-full">
          <div data-reveal="left" class="rounded-3xl border border-[rgb(var(--border)/0.8)] bg-[rgb(var(--card)/0.45)] p-4 sm:p-7 backdrop-blur w-full max-w-[1650px]">
            <p class="text-xs font-bold tracking-[0.24em] text-[rgb(var(--muted))]">
              ABOUT ME
            </p>
            <h2 class="mt-3 text-xl sm:text-2xl font-semibold tracking-tight text-[rgb(var(--fg))]">
              我把設計感與工程落地放在同一個優先順序
            </h2>
            <p class="mt-4 text-sm sm:text-base leading-relaxed text-[rgb(var(--muted))]">
              {{ intro2 }}
            </p>
            <p class="mt-4 text-xs sm:text-sm leading-relaxed text-[rgb(var(--muted))]">
              {{ resume.basics.summary }}
            </p>
          </div>

          <div data-reveal="right" class="rounded-3xl border border-[rgb(var(--border)/0.8)] bg-[rgb(var(--card)/0.45)] p-4 sm:p-7 backdrop-blur w-full">
            <p class="text-xs font-bold tracking-[0.24em] text-[rgb(var(--muted))]">
              WHAT I DO
            </p>
            <div class="mt-5 grid gap-3 w-full">
              <div class="feature-row">
                <div class="feature-dot" />
                <div class="min-w-0 break-words w-full">
                  <p class="font-semibold text-[rgb(var(--fg))] text-sm sm:text-base">響應式網頁設計（RWD）</p>
                  <p class="mt-1 text-xs sm:text-sm leading-relaxed text-[rgb(var(--muted))] break-words">
                    切版與製作響應式網頁，確保跨裝置（桌面、平板、手機）的良好使用者體驗。
                  </p>
                </div>
              </div>
              <div class="feature-row">
                <div class="feature-dot" />
                <div class="min-w-0 break-words w-full">
                  <p class="font-semibold text-[rgb(var(--fg))] text-sm sm:text-base">API 串接與前後端整合</p>
                  <p class="mt-1 text-xs sm:text-sm leading-relaxed text-[rgb(var(--muted))] break-words">
                    與後端工程師協作，串接 API 並整合前後端資料，確保資料流順暢運作。
                  </p>
                </div>
              </div>
              <div class="feature-row">
                <div class="feature-dot" />
                <div class="min-w-0 break-words w-full">
                  <p class="font-semibold text-[rgb(var(--fg))] text-sm sm:text-base">功能開發與效能優化</p>
                  <p class="mt-1 text-xs sm:text-sm leading-relaxed text-[rgb(var(--muted))] break-words">
                    依據客戶需求進行功能開發與調整，並進行前端效能優化與跨瀏覽器相容性測試。
                  </p>
                </div>
              </div>
              <div class="feature-row">
                <div class="feature-dot" />
                <div class="min-w-0 break-words w-full">
                  <p class="font-semibold text-[rgb(var(--fg))] text-sm sm:text-base">跨部門溝通協作</p>
                  <p class="mt-1 text-xs sm:text-sm leading-relaxed text-[rgb(var(--muted))] break-words">
                    與設計師及客戶溝通，提供前端技術可行性建議，將需求轉化為實用的網頁介面。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          data-reveal="scale"
          class="mt-8 rounded-3xl border border-[rgb(var(--border)/0.8)] bg-[rgb(var(--card)/0.45)] p-7 backdrop-blur"
        >
          <p class="text-xs font-bold tracking-[0.24em] text-[rgb(var(--muted))]">
            SOFT SKILLS
          </p>
          <h3 class="mt-3 text-lg font-semibold tracking-tight text-[rgb(var(--fg))]">
            溝通協作與做事方式
          </h3>
          <div class="mt-5 grid gap-2">
            <div
              v-for="s in softSkills"
              :key="s"
              class="flex items-center gap-3 rounded-2xl border border-[rgb(var(--border)/0.75)] bg-[rgb(var(--bg)/0.25)] px-4 py-3"
            >
              <span class="h-2 w-2 rounded-full bg-[rgb(var(--accent))] shadow-[0_0_0_10px_rgb(var(--accent)/0.10)]" />
              <span class="text-sm font-semibold text-[rgb(var(--fg))]">
                {{ s }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Experience -->
      <section id="experience" class="scroll-mt-24">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div data-reveal="left">
            <p class="text-xs font-bold tracking-[0.24em] text-[rgb(var(--muted))]">
              EXPERIENCE
            </p>
            <h2 class="mt-3 text-2xl font-semibold tracking-tight text-[rgb(var(--fg))]">
              工作經歷
            </h2>
          </div>
          <p data-reveal="right" class="text-sm font-semibold text-[rgb(var(--muted))]">
            強調你做過的事與產出
          </p>
        </div>

        <ol v-if="resume.experience.length" class="mt-7 grid gap-5">
          <li
            v-for="(x, idx) in resume.experience"
            :key="`${x.company}-${x.role}-${idx}`"
            data-reveal="scale"
            class="project-card"
          >
            <div class="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
              <div class="min-w-0">
                <p class="text-base font-semibold text-[rgb(var(--fg))]">
                  {{ x.role }}
                  <span class="font-normal text-[rgb(var(--muted))]"> @ </span>
                  <span class="text-[rgb(var(--fg))]">{{ x.company }}</span>
                </p>
                <p v-if="x.location" class="mt-1 text-sm font-semibold text-[rgb(var(--muted))]">
                  {{ x.location }}
                </p>
              </div>
              <p class="project-badge shrink-0">
                {{ rangeText(x.start, x.end) }}
              </p>
            </div>

            <ul v-if="x.highlights?.length" class="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[rgb(var(--fg))]">
              <li v-for="(h, j) in x.highlights" :key="j">
                {{ h }}
              </li>
            </ul>
          </li>
        </ol>

        <div v-else data-reveal="scale" class="project-card mt-7 flex flex-col items-center justify-center py-14 text-center">
          <p class="text-[rgb(var(--muted))]">尚未填寫工作經歷。</p>
        </div>
      </section>

      <!-- Tech marquee -->
      <section id="stack" class="scroll-mt-24">
        <div data-reveal="scale" class="rounded-3xl border border-[rgb(var(--border)/0.8)] bg-[rgb(var(--card)/0.35)] p-7 backdrop-blur">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="text-xs font-bold tracking-[0.24em] text-[rgb(var(--muted))]">
                TECH STACK
              </p>
              <h2 class="mt-3 text-2xl font-semibold tracking-tight text-[rgb(var(--fg))]">
                主要技術與工具
              </h2>
            </div>
            <p class="text-sm font-semibold text-[rgb(var(--muted))]">
              White + <span class="text-[rgb(var(--accent))]">Neon Green</span>
            </p>
          </div>

          <div class="mt-7 marquee-mask">
            <div class="marquee-track" aria-hidden="true">
              <div class="marquee-row">
                <span v-for="t in techList" :key="`a-${t}`" class="marquee-chip">{{ t }}</span>
              </div>
              <div class="marquee-row">
                <span v-for="t in techList" :key="`b-${t}`" class="marquee-chip">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Projects -->
      <section id="projects" class="scroll-mt-24">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div data-reveal="left">
            <p class="text-xs font-bold tracking-[0.24em] text-[rgb(var(--muted))]">
              PROJECTS
            </p>
            <h2 class="mt-3 text-2xl font-semibold tracking-tight text-[rgb(var(--fg))]">
              專案作品集
            </h2>
          </div>
          <p data-reveal="right" class="text-sm font-semibold text-[rgb(var(--muted))]">
            每個卡片都有 hover 質感與微動效
          </p>
        </div>

        <div class="mt-7 grid gap-5">
          <template v-if="resume.projects.length">
            <article
              v-for="(p, idx) in resume.projects"
              :key="`${p.name}-${idx}`"
              data-reveal="scale"
              class="project-card"
            >
              <header class="flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <h3 class="text-lg font-semibold leading-snug text-[rgb(var(--fg))]">
                    {{ p.name }}
                  </h3>
                  <p class="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">
                    {{ p.description }}
                  </p>
                </div>
                <span v-if="p.links?.length" class="project-badge shrink-0">LIVE</span>
              </header>

              <div v-if="p.tech?.length" class="mt-4 flex flex-wrap gap-2">
                <span v-for="t in p.tech" :key="t" class="chip chip-muted">{{ t }}</span>
              </div>

              <ul v-if="p.highlights?.length" class="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[rgb(var(--fg))]">
                <li v-for="(h, j) in p.highlights" :key="j">
                  {{ h }}
                </li>
              </ul>

              <div v-if="p.links?.length" class="mt-5 flex flex-wrap gap-3">
                <a
                  v-for="l in p.links"
                  :key="l.url"
                  :href="l.url"
                  target="_blank"
                  rel="noreferrer"
                  class="project-link"
                  data-cursor="link"
                >
                  {{ l.label }}
                </a>
              </div>
            </article>
          </template>
          <div v-else data-reveal="scale" class="project-card col-span-full flex flex-col items-center justify-center py-14 text-center">
            <p class="text-[rgb(var(--muted))]">尚無專案，之後會陸續補上。</p>
          </div>
        </div>
      </section>

      <!-- Contact -->
      <section id="contact" class="scroll-mt-24">
        <div data-reveal="left" class="rounded-3xl border border-[rgb(var(--border)/0.8)] bg-[rgb(var(--card)/0.45)] p-7 backdrop-blur">
          <div class="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p class="text-xs font-bold tracking-[0.24em] text-[rgb(var(--muted))]">
                CONTACT
              </p>
              <h2 class="mt-3 text-2xl font-semibold tracking-tight text-[rgb(var(--fg))]">
                一起把想法做成漂亮的成品
              </h2>
              <p class="mt-3 max-w-2xl text-base leading-relaxed text-[rgb(var(--muted))]">
                想聊聊合作、外包、或任何有趣的專案，都歡迎寄信或打電話給我。
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <a
                v-if="resume.basics.email"
                :href="`mailto:${resume.basics.email}`"
                class="contact-pill"
                data-cursor="link"
              >
                {{ resume.basics.email }}
              </a>
              <a
                v-if="resume.basics.phone"
                :href="`tel:${resume.basics.phone}`"
                class="contact-pill"
                data-cursor="link"
              >
                {{ resume.basics.phone }}
              </a>
            </div>
          </div>

          <div class="mt-7 flex flex-wrap gap-2">
            <a
              v-for="l in resume.basics.links"
              :key="`contact-${l.url}`"
              :href="l.url"
              target="_blank"
              rel="noreferrer"
              class="chip"
              data-cursor="link"
            >
              {{ l.label }}
            </a>
          </div>
        </div>
      </section>
    </main>

    <footer class="mx-auto max-w-[1600px] px-6 pb-10 text-sm text-[rgb(var(--muted))]">
      <p class="border-t border-[rgb(var(--border)/0.65)] pt-8">
        © {{ new Date().getFullYear() }} {{ resume.basics.name }} · Built with Tailwind + GSAP
      </p>
    </footer>

    <!-- Custom cursor -->
    <div ref="cursorDot" class="cursor-dot" aria-hidden="true" />
    <div ref="cursorRing" class="cursor-ring" aria-hidden="true" />
  </div>
</template>
