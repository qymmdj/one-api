<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <img src="@/assets/images/logo.svg" alt="Logo" class="logo" />
        <h1>注册账号</h1>
        <p>加入 AI网关</p>
      </div>
      
      <el-form ref="formRef" :model="form" :rules="rules" class="register-form">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" size="large" />
        </el-form-item>
        
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="邮箱" prefix-icon="Message" size="large" />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" size="large" show-password />
        </el-form-item>
        
        <el-form-item prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码" prefix-icon="Lock" size="large" show-password />
        </el-form-item>
        
        <el-form-item prop="verificationCode" v-if="emailVerificationEnabled">
          <el-input v-model="form.verificationCode" placeholder="邮箱验证码" prefix-icon="CircleCheck" size="large">
            <template #append>
              <el-button @click="sendCode" :disabled="codeCountdown > 0">
                {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="inviteCode">
          <el-input v-model="form.inviteCode" placeholder="邀请码（可选）" prefix-icon="Ticket" size="large" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" class="register-button" @click="handleRegister">
            注册
          </el-button>
        </el-form-item>
        
        <div class="register-footer">
          <span>已有账号？</span>
          <el-link type="primary" @click="router.push('/login')">立即登录</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { authApi } from '@/api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref()
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  verificationCode: '',
  inviteCode: ''
})

const emailVerificationEnabled = ref(false)
const codeCountdown = ref(0)
const loading = ref(false)

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 12, message: '用户名长度为3-12个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度为8-20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  verificationCode: [
    { required: emailVerificationEnabled, message: '请输入验证码', trigger: 'blur' }
  ]
}

onMounted(() => {
  if (userStore.isLoggedIn) {
    router.push('/dashboard')
  }
})

const sendCode = async () => {
  if (codeCountdown.value > 0) return
  if (!form.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }
  try {
    await authApi.sendVerifyCode(form.email)
    ElMessage.success('验证码已发送')
    codeCountdown.value = 60
    const timer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.error(error)
  }
}

const handleRegister = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const data = { ...form }
        delete data.confirmPassword
        await authApi.register(data)
        ElMessage.success('注册成功，请登录')
        router.push('/login')
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}

const handleImageError = (e) => {
  e.target.style.display = 'none'
}
</script>

<style lang="scss" scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  
  .register-header {
    text-align: center;
    margin-bottom: 30px;
    
    .logo {
      height: 60px;
      margin-bottom: 10px;
    }
    
    h1 {
      font-size: 24px;
      color: #333;
      margin: 0 0 10px;
    }
    
    p {
      color: #999;
      font-size: 14px;
    }
  }
  
  .register-form {
    .register-button {
      width: 100%;
    }
    
    .register-footer {
      text-align: center;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
