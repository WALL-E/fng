const RANGE_TO_LIMIT = {
  '7': 7,
  '30': 30,
  '365': 365,
  '0': 0,
}

const chartEl = document.getElementById('chart')
let chart
let lang = 'zh'
const i18n = {
  zh: {
    title: '恐慌与贪婪指数',
    source: '数据来源：alternative.me',
    copyright: '版权归属：TRAE',
    ranges: { '7': '最近一周', '30': '最近一月', '365': '最近一年', '0': 'MAX' },
    legend: { fear: '恐慌', greed: '贪婪', other: '其他' },
  },
  en: {
    title: 'Fear & Greed Index',
    source: 'Source: alternative.me',
    copyright: 'Copyright: TRAE',
    ranges: { '7': 'Last 7d', '30': 'Last 30d', '365': 'Last 1y', '0': 'MAX' },
    legend: { fear: 'Fear', greed: 'Greed', other: 'Other' },
  },
}
function applyLang() {
  const t = i18n[lang]
  document.title = t.title
  const titleEl = document.querySelector('header strong')
  const sourceEl = document.querySelector('.source')
  const copyrightEl = document.querySelector('.copyright')
  if (titleEl) titleEl.textContent = t.title
  if (sourceEl) sourceEl.textContent = t.source
  if (copyrightEl) copyrightEl.textContent = t.copyright
  document.querySelectorAll('.range button').forEach((btn) => {
    const key = btn.dataset.limit
    btn.textContent = t.ranges[key]
  })
  const legendItems = document.querySelectorAll('.legend .legend-item')
  if (legendItems[0]) legendItems[0].lastChild.nodeValue = t.legend.fear
  if (legendItems[1]) legendItems[1].lastChild.nodeValue = t.legend.greed
  if (legendItems[2]) legendItems[2].lastChild.nodeValue = t.legend.other
}

async function fetchData(limit) {
  const url = `https://api.alternative.me/fng/?limit=${limit}`
  const res = await fetch(url)
  const json = await res.json()
  const data = Array.isArray(json?.data) ? json.data : []
  const sorted = data.slice().sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
  return sorted.map((d) => ({
    value: Number(d.value),
    date: new Date(Number(d.timestamp) * 1000),
    label: d.value_classification,
  }))
}

function fmtDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function render(dataset) {
  const labels = dataset.map((d) => fmtDate(d.date))
  const values = dataset.map((d) => d.value)
  const classifications = dataset.map((d) => String(d.label).toLowerCase())

  const isFearIndex = (i) => classifications[i]?.includes('fear')
  const isGreedIndex = (i) => classifications[i]?.includes('greed')

  const data = {
    labels,
    datasets: [
      {
        label: '恐慌指数',
        data: values,
        tension: 0.25,
        fill: true,
        pointRadius: 0,
        segment: {
          borderColor: (ctx) => {
            const i = ctx.p0DataIndex
            const j = ctx.p1DataIndex
            if (isGreedIndex(i) || isGreedIndex(j)) return '#52c41a'
            if (isFearIndex(i) || isFearIndex(j)) return '#ff4d4f'
            return '#1677ff'
          },
          backgroundColor: (ctx) => {
            const i = ctx.p0DataIndex
            const j = ctx.p1DataIndex
            if (isGreedIndex(i) || isGreedIndex(j)) return 'rgba(82, 196, 26, 0.25)'
            if (isFearIndex(i) || isFearIndex(j)) return 'rgba(255, 77, 79, 0.25)'
            return 'rgba(22, 119, 255, 0.15)'
          },
        },
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 8, right: 8, bottom: 8, left: 8 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (ctx) => {
            const i = ctx.dataIndex
            const val = ctx.parsed.y
            const c = String(classifications[i]).toLowerCase()
            const label = c.includes('greed') ? (lang === 'zh' ? i18n.zh.legend.greed : i18n.en.legend.greed)
              : c.includes('fear') ? (lang === 'zh' ? i18n.zh.legend.fear : i18n.en.legend.fear)
              : (lang === 'zh' ? i18n.zh.legend.other : i18n.en.legend.other)
            return `${val} (${label})`
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        suggestedMin: 0,
        suggestedMax: 100,
        grid: { color: '#eee' },
      },
    },
  }

  if (chart) chart.destroy()
  chart = new Chart(chartEl, { type: 'line', data, options })
}

async function load(limit) {
  const data = await fetchData(limit)
  render(data)
}

document.querySelectorAll('.range button').forEach((btn) => {
  btn.addEventListener('click', async () => {
    document.querySelectorAll('.range button').forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
    const limit = RANGE_TO_LIMIT[btn.dataset.limit]
    await load(limit)
  })
})
document.querySelectorAll('.lang button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang button').forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
    lang = btn.dataset.lang
    applyLang()
  })
})

load(7)
applyLang()