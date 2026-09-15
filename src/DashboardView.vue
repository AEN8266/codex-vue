<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = computed(() => sessionStorage.getItem('codex-vue-username') || '用户')
function logout() {
  sessionStorage.removeItem('codex-vue-username')
  router.push({ name: 'login' })
}
</script>

<template>
  <main class="dashboard-page">
    <nav class="topbar"><div class="topbar-brand"><span class="logo">C</span><span>CODEX VUE</span></div><div class="profile"><span class="avatar">{{ username.slice(0, 1).toUpperCase() }}</span><span>{{ username }}</span><button @click="logout">退出登录</button></div></nav>
    <section class="dashboard-content">
      <div class="hero"><div><p class="eyebrow">OVERVIEW</p><h1>你好，{{ username }} <span>✦</span></h1><p>这里是你的工作空间。保持专注，把想法变成成果。</p></div><div class="hero-orb"></div></div>
      <section class="metrics"><article><p>今日任务</p><strong>12</strong><span>较昨日 +20%</span></article><article><p>进行中项目</p><strong>04</strong><span>一切进展顺利</span></article><article><p>本周效率</p><strong>86<span>%</span></strong><span>连续 5 天提升</span></article></section>
      <section class="workspace"><article class="activity"><header><div><p class="eyebrow">ACTIVITY</p><h2>最近动态</h2></div><button class="text-button">查看全部</button></header><div class="activity-row"><i class="blue"></i><div><b>完成了「登录与注册」模块</b><p>刚刚</p></div><em>已完成</em></div><div class="activity-row"><i class="purple"></i><div><b>创建了新的工作空间</b><p>今天 10:24</p></div><em>进行中</em></div><div class="activity-row"><i class="orange"></i><div><b>欢迎来到 Codex Vue</b><p>今天 09:10</p></div><em>新建</em></div></article><aside class="focus"><p class="eyebrow">FOCUS</p><h2>今日专注</h2><div class="progress"><div></div></div><p class="progress-label">3 / 5 项任务完成</p><button>继续工作 <span>→</span></button></aside></section>
    </section>
  </main>
</template>
