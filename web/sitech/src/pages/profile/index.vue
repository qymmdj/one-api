<template>
  <div class="profile-page">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>个人资料</span>
          </template>
          <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="form.username" disabled />
            </el-form-item>
            <el-form-item label="显示名称" prop="display_name">
              <el-input v-model="form.display_name" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleUpdate" :loading="loading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>修改密码</span>
          </template>
          <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="100px">
            <el-form-item label="当前密码" prop="old_password">
              <el-input v-model="pwdForm.old_password" type="password" show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="new_password">
              <el-input v-model="pwdForm.new_password" type="password" show-password />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirm_password">
              <el-input v-model="pwdForm.confirm_password" type="password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleChangePassword" :loading="pwdLoading">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>账户信息</span>
          </template>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="用户ID">{{ userStore.user?.id }}</el-descriptions-item>
            <el-descriptions-item label="用户名">{{ userStore.user?.username }}</el-descriptions-item>
            <el-descriptions-item label="角色">{{ USER_ROLES[userStore.user?.role]?.label }}</el-descriptions-item>
            <el-descriptions-item label="当前配额">{{ formatQuota(userStore.user?.quota) }}</el-descriptions-item>
            <el-descriptions-item label="已用配额">{{ formatQuota(userStore.user?.used_quota) }}</el-descriptions-item>
            <el-descriptions-item label="请求次数">{{ userStore.user?.request_count }}</el-descriptions-item>
            <el-descriptions-item label="用户组">{{ userStore.user?.group }}</el-descriptions-item>
            <el-descriptions-item label="邀请码">{{ userStore.user?.aff_code }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ formatDateTime(userStore.user?.created_time) }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { authApi } from '@/api'
import { USER_ROLES, formatQuota, formatDateTime } from '@/utils/constants'

const userStore = useUserStore()
const loading = ref(false)
const pwdLoading = ref(false)
const formRef = ref()
const pwdFormRef = ref()

const form = reactive({
  username: '',
  display_name: '',
  email: ''
})

const pwdForm = reactive({
  old_password: '',
  new_password: '',
  confirm_password: ''
})

const rules = {
  display_name: [
    { required: true, message: '请输入显示名称', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确邮箱', trigger: 'blur' }
  ]
}

const validateConfirmPwd = (rule, value, callback) => {
  if (value !== pwdForm.new_password) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}

const pwdRules = {
  old_password: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  new_password: [
    { required: true, message: '请输入新密码', trigger: 'blur', min: 8 }
  ],
  confirm_password: [
    { required: true, message: '请确认密码', trigger: 'blur', validator: validateConfirmPwd }
  ]
}

const handleUpdate = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await authApi.updateUser(form)
        ElMessage.success('更新成功')
        userStore.updateUser(form)
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}

const handleChangePassword = async () => {
  if (!pwdFormRef.value) return
  await pwdFormRef.value.validate(async (valid) => {
    if (valid) {
      pwdLoading.value = true
      try {
        await authApi.updatePassword({
          old_password: pwdForm.old_password,
          new_password: pwdForm.new_password
        })
        ElMessage.success('密码修改成功')
        pwdForm.old_password = ''
        pwdForm.new_password = ''
        pwdForm.confirm_password = ''
      } catch (error) {
        console.error(error)
      } finally {
        pwdLoading.value = false
      }
    }
  })
}

onMounted(() => {
  if (userStore.user) {
    form.username = userStore.user.username
    form.display_name = userStore.user.display_name
    form.email = userStore.user.email
  }
})
</script>

<style lang="scss" scoped>
.profile-page {
}
</style>
