<template>
  <div class="topup-page">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>充值配额</span>
          </template>
          
          <el-form :model="form" label-width="100px">
            <el-form-item label="兑换码">
              <el-input v-model="form.key" placeholder="请输入兑换码" style="width: 300px" />
              <el-button type="primary" @click="handleRedeem" :loading="loading" style="margin-left: 10px">
                兑换
              </el-button>
            </el-form-item>
          </el-form>
          
          <el-divider />
          
          <div class="invite-section">
            <h3>邀请好友</h3>
            <p>邀请链接：<el-link type="primary" :underline="false" @click="copyInviteLink">
              {{ inviteLink }}
            </el-link>
            <el-button type="primary" link @click="copyInviteLink" style="margin-left: 10px">复制</el-button>
            </p>
            <p class="tips">好友通过你的邀请链接注册，双方都将获得额度奖励</p>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <span>当前配额</span>
          </template>
          <div class="quota-info">
            <div class="quota-value">{{ formatQuota(userStore.user?.quota || 0) }}</div>
            <div class="quota-used">已使用: {{ formatQuota(userStore.user?.used_quota || 0) }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { redemptionApi } from '@/api'
import { formatQuota } from '@/utils/constants'

const userStore = useUserStore()
const loading = ref(false)
const form = reactive({ key: '' })

const inviteLink = computed(() => {
  const baseUrl = window.location.origin
  const affCode = userStore.user?.aff_code || ''
  return `${baseUrl}/register?aff=${affCode}`
})

const handleRedeem = async () => {
  if (!form.key) { ElMessage.warning('请输入兑换码'); return }
  loading.value = true
  try {
    const res = await redemptionApi.redeem(form.key)
    ElMessage.success('兑换成功！获得配额: ' + formatQuota(res.data))
    form.key = ''
    const userRes = await userStore.setUser(res.data)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const copyInviteLink = async () => {
  try {
    await navigator.clipboard.writeText(inviteLink.value)
    ElMessage.success('复制成功')
  } catch {
    ElMessage.error('复制失败')
  }
}

onMounted(() => {
  userStore.updateUser({})
})
</script>

<style lang="scss" scoped>
.topup-page {
  .invite-section {
    h3 { margin: 0 0 15px; }
    p { margin: 10px 0; }
    .tips { color: #999; font-size: 14px; }
  }
  
  .quota-info {
    text-align: center;
    .quota-value { font-size: 36px; font-weight: bold; color: #409eff; }
    .quota-used { color: #999; margin-top: 10px; }
  }
}
</style>
