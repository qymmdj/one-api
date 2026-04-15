<template>
  <div class="setting-page">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="系统设置" name="system">
        <el-form :model="systemForm" label-width="180px" class="setting-form">
          <el-divider content-position="left">基本设置</el-divider>
          <el-form-item label="系统名称">
            <el-input v-model="systemForm.SystemName" />
          </el-form-item>
          <el-form-item label="页脚">
            <el-input v-model="systemForm.Footer" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item label="新用户初始配额">
            <el-input-number v-model="quotaForNewUser" :min="0" />
          </el-form-item>
          <el-form-item label="邀请人奖励配额">
            <el-input-number v-model="quotaForInviter" :min="0" />
          </el-form-item>
          <el-form-item label="被邀请人奖励配额">
            <el-input-number v-model="quotaForInvitee" :min="0" />
          </el-form-item>
          
          <el-divider content-position="left">认证设置</el-divider>
          <el-form-item label="允许密码登录">
            <el-switch v-model="systemForm.PasswordLoginEnabled" />
          </el-form-item>
          <el-form-item label="允许注册">
            <el-switch v-model="systemForm.RegisterEnabled" />
          </el-form-item>
          <el-form-item label="启用GitHub OAuth">
            <el-switch v-model="systemForm.GitHubOAuthEnabled" />
          </el-form-item>
          <el-form-item label="启用邮箱验证">
            <el-switch v-model="systemForm.EmailVerificationEnabled" />
          </el-form-item>
          
          <el-divider content-position="left">渠道设置</el-divider>
          <el-form-item label="自动禁用渠道">
            <el-switch v-model="systemForm.AutomaticDisableChannelEnabled" />
          </el-form-item>
          <el-form-item label="渠道禁用阈值">
            <el-input-number v-model="channelDisableThreshold" :min="0" :max="10" :step="0.1" />
            <span style="margin-left: 10px">秒</span>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="saveSystemSettings" :loading="saving">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="运营设置" name="operation">
        <el-form :model="operationForm" label-width="180px" class="setting-form">
          <el-divider content-position="left">费率设置</el-divider>
          <el-form-item label="模型费率">
            <el-input v-model="operationForm.ModelRatio" type="textarea" :rows="5" placeholder='{"gpt-4": 1, "gpt-3.5-turbo": 0.5}' />
          </el-form-item>
          <el-form-item label="分组费率">
            <el-input v-model="operationForm.GroupRatio" type="textarea" :rows="3" placeholder='{"default": 1}' />
          </el-form-item>
          
          <el-divider content-position="left">充值设置</el-divider>
          <el-form-item label="充值链接">
            <el-input v-model="operationForm.TopUpLink" placeholder="https://..." />
          </el-form-item>
          <el-form-item label="Chat链接">
            <el-input v-model="operationForm.ChatLink" placeholder="https://..." />
          </el-form-item>
          <el-form-item label="每单元配额">
            <el-input-number v-model="quotaPerUnit" :min="0" :step="1000000" />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="saveOperationSettings" :loading="saving">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="其他设置" name="other">
        <el-form :model="otherForm" label-width="180px" class="setting-form">
          <el-divider content-position="left">邮件设置</el-divider>
          <el-form-item label="SMTP服务器">
            <el-input v-model="otherForm.SMTPServer" placeholder="smtp.example.com" />
          </el-form-item>
          <el-form-item label="SMTP端口">
            <el-input-number v-model="smtpPort" :min="0" :max="65535" />
          </el-form-item>
          <el-form-item label="SMTP账号">
            <el-input v-model="otherForm.SMTPAccount" />
          </el-form-item>
          <el-form-item label="SMTP密码">
            <el-input v-model="otherForm.SMTPToken" type="password" show-password />
          </el-form-item>
          <el-form-item label="发件人邮箱">
            <el-input v-model="otherForm.SMTPFrom" placeholder="noreply@example.com" />
          </el-form-item>
          
          <el-divider content-position="left">公告设置</el-divider>
          <el-form-item label="公告内容">
            <el-input v-model="otherForm.Notice" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item label="关于页面">
            <el-input v-model="otherForm.About" type="textarea" :rows="4" />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="saveOtherSettings" :loading="saving">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { optionApi } from '@/api'

const activeTab = ref('system')
const saving = ref(false)

const systemForm = reactive({
  SystemName: '', Footer: '', PasswordLoginEnabled: true, RegisterEnabled: true,
  GitHubOAuthEnabled: false, EmailVerificationEnabled: false, AutomaticDisableChannelEnabled: true
})

const operationForm = reactive({
  ModelRatio: '', GroupRatio: '', TopUpLink: '', ChatLink: ''
})

const otherForm = reactive({
  SMTPServer: '', SMTPAccount: '', SMTPToken: '', SMTPFrom: '', Notice: '', About: ''
})

const quotaForNewUser = ref(0)
const quotaForInviter = ref(0)
const quotaForInvitee = ref(0)
const channelDisableThreshold = ref(5)
const quotaPerUnit = ref(1000000)
const smtpPort = ref(587)

const loadSettings = async () => {
  try {
    const res = await optionApi.getAll()
    const data = res.data || {}
    Object.assign(systemForm, {
      SystemName: data.SystemName || '',
      Footer: data.Footer || '',
      PasswordLoginEnabled: data.PasswordLoginEnabled === 'true',
      RegisterEnabled: data.RegisterEnabled === 'true',
      GitHubOAuthEnabled: data.GitHubOAuthEnabled === 'true',
      EmailVerificationEnabled: data.EmailVerificationEnabled === 'true',
      AutomaticDisableChannelEnabled: data.AutomaticDisableChannelEnabled === 'true'
    })
    quotaForNewUser.value = parseInt(data.QuotaForNewUser) || 0
    quotaForInviter.value = parseInt(data.QuotaForInviter) || 0
    quotaForInvitee.value = parseInt(data.QuotaForInvitee) || 0
    channelDisableThreshold.value = parseFloat(data.ChannelDisableThreshold) || 5
    
    Object.assign(operationForm, {
      ModelRatio: data.ModelRatio || '',
      GroupRatio: data.GroupRatio || '',
      TopUpLink: data.TopUpLink || '',
      ChatLink: data.ChatLink || ''
    })
    quotaPerUnit.value = parseFloat(data.QuotaPerUnit) || 1000000
    
    Object.assign(otherForm, {
      SMTPServer: data.SMTPServer || '',
      SMTPAccount: data.SMTPAccount || '',
      SMTPToken: data.SMTPToken || '',
      SMTPFrom: data.SMTPFrom || '',
      Notice: data.Notice || '',
      About: data.About || ''
    })
    smtpPort.value = parseInt(data.SMTPPort) || 587
  } catch (error) { console.error(error) }
}

const saveSystemSettings = async () => {
  saving.value = true
  try {
    const data = {
      ...systemForm,
      QuotaForNewUser: quotaForNewUser.value,
      QuotaForInviter: quotaForInviter.value,
      QuotaForInvitee: quotaForInvitee.value,
      ChannelDisableThreshold: channelDisableThreshold.value
    }
    await optionApi.update(data)
    ElMessage.success('保存成功')
  } catch (error) { console.error(error) }
  finally { saving.value = false }
}

const saveOperationSettings = async () => {
  saving.value = true
  try {
    const data = { ...operationForm, QuotaPerUnit: quotaPerUnit.value }
    await optionApi.update(data)
    ElMessage.success('保存成功')
  } catch (error) { console.error(error) }
  finally { saving.value = false }
}

const saveOtherSettings = async () => {
  saving.value = true
  try {
    const data = { ...otherForm, SMTPPort: smtpPort.value }
    await optionApi.update(data)
    ElMessage.success('保存成功')
  } catch (error) { console.error(error) }
  finally { saving.value = false }
}

onMounted(() => { loadSettings() })
</script>

<style lang="scss" scoped>
.setting-page {
  .setting-form { max-width: 800px; }
}
</style>
