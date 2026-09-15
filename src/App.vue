<script setup>
import { computed, ref } from 'vue'

const mode = ref('login')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const success = ref(false)
const loading = ref(false)
const title = computed(() => mode.value === 'login' ? '欢迎回来' : '创建账号')

function switchMode(nextMode) {
  mode.value = nextMode
  password.value = ''
  confirmPassword.value = ''
  message.value = ''
}

async function submit() {
  if (!username.value.trim() || !password.value) {
    success.value = false
    message.value = '请输入用户名和密码'
    return
  }
  if (mode.value === 'register' && password.value !== confirmPassword.value) {
    success.value = false
    message.value = '两次输入的密码不一致'
    return
  }
  loading.value = true
  message.value = ''
  try {
    const response = await fetch(`/api/auth/${mode.value === 'login' ? 'login' : 'register'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value.trim(), password: password.value }),
    })
    const result = await response.json()
    success.value = response.ok
    message.value = result.message || '请求失败，请稍后重试'
    if (response.ok && mode.value === 'register') switchMode('login')
  } catch {
    success.value = false
    message.value = '无法连接服务，请确认 npm run dev 已启动'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page"><section class="card" aria-labelledby="form-title">
    <div class="logo">C</div><p class="brand">CODEX VUE</p><h1 id="form-title">{{ title }}</h1>
    <p class="subtext">{{ mode === 'login' ? '登录后继续使用服务' : '注册一个新账号开始使用' }}</p>
    <div class="tabs"><button :class="{ active: mode === 'login' }" type="button" @click="switchMode('login')">登录</button><button :class="{ active: mode === 'register' }" type="button" @click="switchMode('register')">注册</button></div>
    <form @submit.prevent="submit">
      <label>用户名<input v-model="username" autocomplete="username" placeholder="请输入用户名" /></label>
      <label>密码<input v-model="password" type="password" autocomplete="current-password" placeholder="请输入密码（至少 6 位）" /></label>
      <label v-if="mode === 'register'">确认密码<input v-model="confirmPassword" type="password" autocomplete="new-password" placeholder="请再次输入密码" /></label>
      <button class="submit" type="submit" :disabled="loading">{{ loading ? '处理中…' : mode === 'login' ? '登录' : '注册' }}</button>
    </form>
    <p v-if="message" class="message" :class="{ success }" role="status">{{ message }}</p>
    <p class="hint">账号密码由本地服务加密后保存在 SQLite 数据库。</p>
  </section></main>
</template>
