<template>
  <div class="redemption-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>兑换码管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>创建兑换码
          </el-button>
        </div>
      </template>
      
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="key" label="兑换码" min-width="180" />
        <el-table-column prop="name" label="名称" min-width="120" />
        <el-table-column prop="quota" label="配额" width="120">
          <template #default="{ row }">{{ formatQuota(row.quota) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="REDEMPTION_STATUS[row.status]?.type || 'info'">
              {{ REDEMPTION_STATUS[row.status]?.label || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" width="170">
          <template #default="{ row }">{{ formatDateTime(row.created_time) }}</template>
        </el-table-column>
        <el-table-column prop="redeemed_time" label="使用时间" width="170">
          <template #default="{ row }">{{ row.redeemed_time > 0 ? formatDateTime(row.redeemed_time) : '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleCopy(row.key)">复制</el-button>
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
    
    <el-dialog v-model="dialogVisible" title="创建兑换码" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="配额" prop="quota">
          <el-input-number v-model="form.quota" :min="0" :step="1000000" style="width: 100%" />
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input-number v-model="form.count" :min="1" :max="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { redemptionApi } from '@/api'
import { REDEMPTION_STATUS, formatQuota, formatDateTime } from '@/utils/constants'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()
const pagination = reactive({ page: 1, size: 20, total: 0 })
const form = reactive({ name: '', quota: 1000000, count: 1 })
const rules = { quota: [{ required: true, message: '请输入配额', trigger: 'blur' }] }

const loadData = async () => {
  loading.value = true
  try {
    const res = await redemptionApi.getList({ page: pagination.page, size: pagination.size })
    tableData.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) { console.error(error) }
  finally { loading.value = false }
}

const handleCopy = async (key) => {
  try { await navigator.clipboard.writeText(key); ElMessage.success('复制成功') } 
  catch { ElMessage.error('复制失败') }
}

const handleAdd = () => { Object.assign(form, { name: '', quota: 1000000, count: 1 }); dialogVisible.value = true }

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        for (let i = 0; i < form.count; i++) { await redemptionApi.add(form) }
        ElMessage.success('创建成功')
        dialogVisible.value = false
        loadData()
      } catch (error) { console.error(error) }
      finally { submitLoading.value = false }
    }
  })
}

const handleToggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 2 : 1
  try {
    await ElMessageBox.confirm(`确定要${newStatus === 1 ? '启用' : '禁用'}该兑换码吗？`, '提示', { type: 'warning' })
    await redemptionApi.update({ id: row.id, status: newStatus })
    ElMessage.success('操作成功')
    loadData()
  } catch (error) { if (error !== 'cancel') console.error(error) }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该兑换码吗？', '警告', { type: 'error' })
    await redemptionApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) { if (error !== 'cancel') console.error(error) }
}

onMounted(() => { loadData() })
</script>

<style lang="scss" scoped>
.redemption-page { .card-header { display: flex; justify-content: space-between; align-items: center; } }
</style>
