<template>
  <div class="user-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>添加用户
          </el-button>
        </div>
      </template>
      
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="display_name" label="显示名称" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="150" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 100 ? 'danger' : row.role === 10 ? 'warning' : 'info'">
              {{ USER_ROLES[row.role]?.label || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="USER_STATUS[row.status]?.type || 'info'">
              {{ USER_STATUS[row.status]?.label || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quota" label="配额" width="120">
          <template #default="{ row }">
            {{ formatQuota(row.quota) }}
          </template>
        </el-table-column>
        <el-table-column prop="used_quota" label="已用" width="100">
          <template #default="{ row }">
            {{ formatQuota(row.used_quota) }}
          </template>
        </el-table-column>
        <el-table-column prop="group" label="分组" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" link @click="handleTopup(row)">充值</el-button>
            <el-button :type="row.status === 1 ? 'warning' : 'success'" link @click="handleToggleStatus(row)">
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadData"
        @current-change="loadData"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>
    
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '添加用户'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="显示名称" prop="display_name">
          <el-input v-model="form.display_name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" style="width: 100%">
            <el-option :value="1" label="普通用户" />
            <el-option :value="10" label="管理员" />
            <el-option :value="100" label="超级管理员" />
          </el-select>
        </el-form-item>
        <el-form-item label="分组" prop="group">
          <el-input v-model="form.group" />
        </el-form-item>
        <el-form-item label="配额" prop="quota">
          <el-input-number v-model="form.quota" :min="0" :step="1000000" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
    
    <el-dialog v-model="topupDialogVisible" title="用户充值" width="400px">
      <el-form :model="topupForm" ref="topupFormRef" label-width="80px">
        <el-form-item label="用户">
          <el-input :value="topupForm.username" disabled />
        </el-form-item>
        <el-form-item label="配额">
          <el-input-number v-model="topupForm.quota" :min="0" :step="1000000" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="topupDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="topupLoading" @click="handleTopupSubmit">确定充值</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userApi } from '@/api'
import { USER_ROLES, USER_STATUS, formatQuota } from '@/utils/constants'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const topupDialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const topupLoading = ref(false)
const formRef = ref()
const topupFormRef = ref()

const pagination = reactive({ page: 1, size: 20, total: 0 })

const form = reactive({
  id: null, username: '', display_name: '', email: '', password: '', role: 1, group: 'default', quota: 0
})

const topupForm = reactive({ user_id: null, username: '', quota: 0 })

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur', min: 8 }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await userApi.getList({ page: pagination.page, size: pagination.size })
    tableData.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) { console.error(error) }
  finally { loading.value = false }
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { id: null, username: '', display_name: '', email: '', password: '', role: 1, group: 'default', quota: 0 })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, { id: row.id, username: row.username, display_name: row.display_name, email: row.email, password: '', role: row.role, group: row.group, quota: row.quota })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (isEdit.value) {
          await userApi.update(form)
          ElMessage.success('更新成功')
        } else {
          await userApi.add(form)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadData()
      } catch (error) { console.error(error) }
      finally { submitLoading.value = false }
    }
  })
}

const handleTopup = (row) => {
  Object.assign(topupForm, { user_id: row.id, username: row.username, quota: 0 })
  topupDialogVisible.value = true
}

const handleTopupSubmit = async () => {
  if (topupForm.quota <= 0) { ElMessage.warning('请输入有效配额'); return }
  topupLoading.value = true
  try {
    await userApi.topup({ user_id: topupForm.user_id, quota: topupForm.quota })
    ElMessage.success('充值成功')
    topupDialogVisible.value = false
    loadData()
  } catch (error) { console.error(error) }
  finally { topupLoading.value = false }
}

const handleToggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 2 : 1
  try {
    await ElMessageBox.confirm(`确定要${newStatus === 1 ? '启用' : '禁用'}该用户吗？`, '提示', { type: 'warning' })
    await userApi.update({ id: row.id, status: newStatus })
    ElMessage.success('操作成功')
    loadData()
  } catch (error) { if (error !== 'cancel') console.error(error) }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '警告', { type: 'error' })
    await userApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) { if (error !== 'cancel') console.error(error) }
}

onMounted(() => { loadData() })
</script>

<style lang="scss" scoped>
.user-page { .card-header { display: flex; justify-content: space-between; align-items: center; } }
</style>
