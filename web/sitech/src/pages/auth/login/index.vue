<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="@/assets/images/logo.svg" alt="Logo" class="logo" />
        <h1>AI网关</h1>
        <p>统一 API 接入平台</p>
      </div>
      
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
        
        <div class="login-footer">
          <el-link type="primary" @click="router.push('/register')">注册账号</el-link>
          <el-link type="info" @click="showResetDialog = true">忘记密码？</el-link>
        </div>
        
        <el-divider>其他登录方式</el-divider>
        
        <div class="oauth-buttons">
          <el-button v-if="oauthConfig.github" circle @click="oauthLogin('github')">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </el-button>
          <el-button v-if="oauthConfig.wechat" circle @click="oauthLogin('wechat')">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.03-.406-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
            </svg>
          </el-button>
          <el-button v-if="oauthConfig.lark" circle @click="oauthLogin('lark')">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19.5 12c0-.34-.028-.674-.082-1H12v2h7.306c-.03.336-.048.676-.048 1.018 0 2.578 1.898 4.68 4.4 5.112v-2.232c-1.378-.432-2.46-1.68-2.46-3.208v-.69h1.702zM8.518 7.128c0-.928.188-1.808.524-2.616A4.97 4.97 0 007.12 7.2a5.005 5.005 0 00-3.73 7.368c0 1.768.924 3.335 2.332 4.26v-2.074a2.993 2.993 0 01-1.544-2.684c0-.948.444-1.798 1.134-2.372-.11-.22-.174-.462-.174-.72v-.83zM4.742 15.3c-.768-.768-1.24-1.846-1.24-2.97 0-2.256 1.75-4.086 3.91-4.086.466 0 .916.082 1.336.232V9.57c-.378-.114-.774-.178-1.182-.178-1.964 0-3.558 1.546-3.558 3.442 0 .574.142 1.114.39 1.592.254.488.618.904 1.062 1.218v2.114l-.718-.492z"/>
            </svg>
          </el-button>
        </div>
      </el-form>
    </div>
    
    <el-dialog v-model="showResetDialog" title="找回密码" width="400px">
      <el-form :model="resetForm" :rules="resetRules" ref="resetFormRef">
        <el-form-item prop="email">
          <el-input v-model="resetForm.email" placeholder="请输入注册邮箱" prefix-icon="Message" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showResetDialog = false">取消</el-button>
        <el-button type="primary" :loading="resetLoading" @click="handleReset">发送验证码</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { authApi } from '@/api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref()
const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const loading = ref(false)
const showResetDialog = ref(false)
const resetFormRef = ref()
const resetForm = reactive({ email: '' })
const resetRules = { email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }] }
const resetLoading = ref(false)

const oauthConfig = ref({
  github: false,
  wechat: false,
  lark: false
})

onMounted(() => {
  // 检查是否有用户信息，有则直接跳转
  if (userStore.isLoggedIn) {
    router.push('/dashboard')
  }
})

const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await authApi.login(loginForm)
        userStore.setUser(res.data || res)
        ElMessage.success('登录成功')
        const redirect = route.query.redirect || '/dashboard'
        router.push(redirect)
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}

const handleReset = async () => {
  if (!resetFormRef.value) return
  await resetFormRef.value.validate(async (valid) => {
    if (valid) {
      resetLoading.value = true
      try {
        await authApi.sendVerifyCode(resetForm.email)
        ElMessage.success('验证码已发送')
        showResetDialog.value = false
      } catch (error) {
        console.error(error)
      } finally {
        resetLoading.value = false
      }
    }
  })
}

const oauthLogin = (type) => {
  window.location.href = `/api/oauth/${type}`
}

const handleImageError = (e) => {
  e.target.style.display = 'none'
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  
  .login-header {
    text-align: center;
    margin-bottom: 30px;
    
    .logo {
      height: 60px;
      margin-bottom: 10px;
    }
    
    h1 {
      font-size: 28px;
      color: #333;
      margin: 0 0 10px;
    }
    
    p {
      color: #999;
      font-size: 14px;
    }
  }
  
  .login-form {
    .login-button {
      width: 100%;
    }
    
    .login-footer {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }
    
    .oauth-buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
      
      .el-button {
        width: 40px;
        height: 40px;
      }
    }
  }
}
</style>
