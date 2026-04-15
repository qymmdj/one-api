<template>
  <div class="token-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>令牌管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>创建令牌
          </el-button>
        </div>
      </template>
      
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="名称" min-width="120" />
        <el-table-column prop="key" label="密钥" min-width="180">
          <template #default="{ row }">
            <span v-if="row.showKey">{{ row.key }}</span>
            <span v-else>••••••••••••••••</span>
            <el-button type="primary" link @click="toggleShowKey(row)">
              {{ row.showKey ? '隐藏' : '显示' }}
            </el-button>
            <el-button type="primary" link @click="copyKey(row.key)">复制</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="TOKEN_STATUS[row.status]?.type || 'info'">
              {{ TOKEN_STATUS[row.status]?.label || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remain_quota" label="剩余配额" width="120">
          <template #default="{ row }">
            <span v-if="row.unlimited_quota">∞</span>
            <span v-else>{{ formatQuota(row.remain_quota) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="used_quota" label="已用配额" width="120">
          <template #default="{ row }">
            {{ formatQuota(row.used_quota) }}
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" width="170">
          <template #default="{ row }">
            {{ formatDateTime(row.created_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="expired_time" label="过期时间" width="170">
          <template #default="{ row }">
            {{ formatDate(row.expired_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" link @click="handleReset(row)">重置</el-button>
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
    
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑令牌' : '创建令牌'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="令牌名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入令牌名称" />
        </el-form-item>
        <el-form-item label="模型限制" prop="models">
          <el-input v-model="form.models" placeholder="用逗号分隔，留空则不限制" />
        </el-form-item>
        <el-form-item label="令牌限额" prop="remain_quota">
          <el-input-number v-model="form.remain_quota" :min="0" :step="1000000" />
          <span style="margin-left: 10px; color: #999">0表示不限制</span>
        </el-form-item>
        <el-form-item label="无限配额">
          <el-switch v-model="form.unlimited_quota" />
        </el-form-item>
        <el-form-item label="过期时间" prop="expired_time">
          <el-date-picker
            v-model="form.expired_time"
            type="datetime"
            placeholder="选择过期时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="timestamp"
          />
          <span style="margin-left: 10px; color: #999">-1表示永不过期</span>
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
import { tokenApi } from '@/api'
import { TOKEN_STATUS, formatQuota, formatDate, formatDateTime } from '@/utils/constants'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref()

const pagination = reactive({ page: 1, size: 20, total: 0 })

const form = reactive({
  id: null,
  name: '',
  models: '',
  remain_quota: 0,
  unlimited_quota: false,
  expired_time: -1
})

const rules = {
  name: [{ required: true, message: '请输入令牌名称', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await tokenApi.getList({ page: pagination.page, size: pagination.size })
    tableData.value = (res.data?.list || []).map(item => ({ ...item, showKey: false }))
    pagination.total = res.data?.total || 0
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const toggleShowKey = (row) => {
  row.showKey = !row.showKey
}

const copyKey = async (key) => {
  try {
    await navigator.clipboard.writeText(key)
    ElMessage.success('复制成功')
  } catch {
    ElMessage.error('复制失败')
  }
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { id: null, name: '', models: '', remain_quota: 0, unlimited_quota: false, expired_time: -1 })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, {
    id: row.id,
    name: row.name,
    models: row.models || '',
    remain_quota: row.remain_quota,
    unlimited_quota: row.unlimited_quota,
    expired_time: row.expired_time
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (isEdit.value) {
          await tokenApi.update(form)
          ElMessage.success('更新成功')
        } else {
          await tokenApi.add(form)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        loadData()
      } catch (error) {
        console.error(error)
      } finally {
        submitLoading.value = false
      }
    }
  })
}

const handleReset = async (row) => {
  try {
    await ElMessageBox.confirm('确定要重置该令牌吗？重置后密钥将更换。', '提示', { type: 'warning' })
    await tokenApi.reset(row.id)
    ElMessage.success('重置成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') console.error(error)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该令牌吗？', '警告', { type: 'error' })
    await tokenApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') console.error(error)
  }
}

onMounted(() => { loadData() })
</script>

<style lang="scss" scoped>
.token-page {
  .card-header { display: flex; justify-content: space-between; align-items: center; }
}
</style>
