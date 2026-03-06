export type ResumeLink = {
  label: string
  url: string
}

export type ResumeBasics = {
  name: string
  headline: string
  summary: string
  location?: string
  email?: string
  phone?: string
  links: ResumeLink[]
}

export type ResumeExperience = {
  company: string
  role: string
  location?: string
  start: string
  end?: string
  highlights: string[]
}

export type ResumeProject = {
  name: string
  description: string
  links?: ResumeLink[]
  tech?: string[]
  highlights?: string[]
}

export type ResumeEducation = {
  school: string
  degree?: string
  department?: string
  start?: string
  end?: string
  highlights?: string[]
}

export type ResumeSkillGroup = {
  group: string
  skills: string[]
}

export type Resume = {
  basics: ResumeBasics
  experience: ResumeExperience[]
  projects: ResumeProject[]
  skills: ResumeSkillGroup[]
  education: ResumeEducation[]
}

export const resume: Resume = {
  basics: {
    name: 'Adrian',
    headline: '網頁前端工程師（Vue / RWD / API 串接）',
    summary:
      '我是 26 歲的前端工程師，具備經營管理背景，因對網頁開發的熱愛投入程式領域。目前負責切版、RWD 設計與 API 串接，並依據客戶需求進行功能開發與優化。我重視使用者體驗與程式碼品質，樂於跨部門協作，將需求轉化為直覺、美觀且實用的網頁介面。未來希望結合管理思維與前端專業，成為兼具技術與溝通能力的跨領域人才。',
    location: '台中市沙鹿區（可遠端）',
    email: 'c0979689101@gmail.com',
    phone: '0979-689-101',
    links: [
      { label: '西屯國小專案', url: 'https://fcu-11309-stes.dev-hub.io/' },
      {
        label: '西屯國小簡報',
        url: 'https://www.canva.com/design/DAGc-VUwRw4/az9tWZY3oCSzYKUuUk1jEg/edit',
      },
      { label: '全擊潮流公仔', url: 'https://www.cj-toys.com' },
    ],
  },
  experience: [
    {
      company: '首奕股份有限公司',
      role: '網頁前端工程師',
      location: '台中市西屯區',
      start: '2025/04',
      highlights: [
        '負責切版與製作響應式網頁（RWD），確保跨裝置良好體驗。',
        '與後端工程師協作，串接 API 並整合前後端資料。',
        '依據客戶需求進行功能開發與調整，確保專案如期符合預期。',
        '進行前端效能優化與跨瀏覽器相容性測試。',
        '與設計師及客戶溝通，提供前端技術可行性建議。',
      ],
    },
    {
      company: '逢甲大學｜Figma UI/UX 與 Vue.js 前端培訓班',
      role: '學員',
      location: '台中市西屯區',
      start: '2024/09',
      end: '2025/01',
      highlights: [
        '掌握 HTML / CSS / JavaScript 基礎，能實作互動功能與版面建置。',
        '運用 Figma 進行 UI 設計與原型製作，建立 UI/UX 設計思維。',
        '使用 Photoshop 進行視覺設計與圖像處理。',
        '接觸 Vue.js 框架，理解元件化開發與資料流概念。',
      ],
    },
    {
      company: '丹騏企業社／白姊股份有限公司',
      role: '直播助理',
      location: '台中市沙鹿區',
      start: '2024/06',
      end: '2024/09',
      highlights: [
        '操作直播後台系統，協助直播設定與技術支援。',
        '即時客服回應與秩序維護，處理異常狀況確保直播順暢。',
        '處理商品訂單與出貨追蹤，並協助整理直播數據與回饋。',
      ],
    },
  ],
  projects: [
    {
      name: '西屯國小專案',
      description: '網站專案練習，包含版面切版、RWD 與互動功能實作。',
      links: [
        { label: 'Live', url: 'https://fcu-11309-stes.dev-hub.io/' },
        {
          label: 'Slides',
          url: 'https://www.canva.com/design/DAGc-VUwRw4/az9tWZY3oCSzYKUuUk1jEg/edit',
        },
      ],
      tech: ['Vue', 'HTML', 'CSS', 'JavaScript', 'RWD', 'Figma'],
      highlights: ['以使用者體驗為導向調整版面與互動細節。'],
    },
    {
      name: '全擊潮流公仔（www.cj-toys.com）',
      description: '商業網站案例，協助前端頁面呈現與跨裝置體驗調整。',
      links: [{ label: 'Live', url: 'https://www.cj-toys.com' }],
      tech: ['HTML', 'CSS', 'JavaScript', 'RWD'],
    },
  ],
  skills: [
    {
      group: 'Frontend',
      skills: ['HTML5', 'CSS', 'RWD', 'JavaScript', 'Vue.js', 'Nuxt', 'Tailwind CSS'],
    },
    { group: 'Tooling', skills: ['GitHub', 'Figma', 'Photoshop'] },
    { group: 'Office', skills: ['Word', 'Excel', 'PowerPoint', 'Outlook'] },
  ],
  education: [
    {
      school: '亞洲大學',
      degree: '大學畢業',
      department: '經營管理學系',
      start: '2018/09',
      end: '2022/06',
      highlights: ['具備專案管理與團隊合作經驗，能以管理思維協助需求釐清與溝通協作。'],
    },
  ],
}

