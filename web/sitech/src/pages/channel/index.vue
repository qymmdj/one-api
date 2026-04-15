<template>
  <div class="channel-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>渠道管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>添加渠道
          </el-button>
        </div>
      </template>
      
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="名称" min-width="120" />
        <el-table-column prop="type" label="类型" width="140">
          <template #default="{ row }">
            {{ CHANNEL_TYPES[row.type]?.label || '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="CHANNEL_STATUS[row.status]?.type || 'info'">
              {{ CHANNEL_STATUS[row.status]?.label || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="group" label="分组" width="100" />
        <el-table-column prop="response_time" label="响应时间" width="100">
          <template #default="{ row }">
            {{ row.response_time ? row.response_time + 'ms' : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="余额" width="100">
          <template #default="{ row }">
            ${{ row.balance?.toFixed(2) || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="used_quota" label="已用配额" width="120">
          <template #default="{ row }">
            {{ formatQuota(row.used_quota) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleTest(row)">测试</el-button>
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button 
              :type="row.status === 1 ? 'warning' : 'success'" 
              link 
              @click="handleToggleStatus(row)"
            >
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
    
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑渠道' : '添加渠道'" 
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="渠道名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入渠道名称" />
        </el-form-item>
        <el-form-item label="渠道类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择渠道类型" style="width: 100%">
            <el-option
              v-for="item in CHANNEL_TYPES"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="API Key" prop="key">
          <el-input v-model="form.key" type="password" show-password placeholder="请输入API Key" />
        </el-form-item>
        <el-form-item label="Base URL" prop="base_url">
          <el-input v-model="form.base_url" placeholder="留空使用默认地址" />
        </el-form-item>
        <el-form-item label="模型列表" prop="models">
          <el-input v-model="form.models" placeholder="用逗号分隔，如：gpt-3.5-turbo,gpt-4" />
        </el-form-item>
        <el-form-item label="分组" prop="group">
          <el-input v-model="form.group" placeholder="默认分组" />
        </el-form-item>
        <el-form-item label="模型映射" prop="model_mapping">
          <el-input 
            v-model="form.model_mapping" 
            type="textarea" 
            :rows="2"
            placeholder='JSON格式，如：{"gpt-4": "gpt-4-32k"}' 
          />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input-number v-model="form.priority" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input-number v-model="form.weight" :min="0" />
        </el-form-item>
        <el-form-item label="系统提示词" prop="system_prompt">
          <el-input v-model="form.system_prompt" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="其他配置" prop="config">
          <el-input v-model="form.config" type="textarea" :rows="2" placeholder="JSON格式" />
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
import { channelApi } from '@/api'
import { CHANNEL_TYPES, CHANNEL_STATUS, formatQuota } from '@/utils/constants'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref()

const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

const form = reactive({
  id: null,
  name: '',
  type: 1,
  key: '',
  base_url: '',
  models: '',
  group: 'default',
  model_mapping: '',
  priority: 0,
  weight: 0,
  system_prompt: '',
  config: ''
})

const rules = {
  name: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择渠道类型', trigger: 'change' }],
  key: [{ required: true, message: '请输入API Key', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await channelApi.getList({
      page: pagination.page,
      size: pagination.size
    })
    tableData.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: null,
    name: '',
    type: 1,
    key: '',
    base_url: '',
    models: '',
    group: 'default',
    model_mapping: '',
    priority: 0,
    weight: 0,
    system_prompt: '',
    config: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, {
    id: row.id,
    name: row.name,
    type: row.type,
    key: '',
    base_url: row.base_url || '',
    models: row.models || '',
    group: row.group || 'default',
    model_mapping: row.model_mapping || '',
    priority: row.priority || 0,
    weight: row.weight || 0,
    system_prompt: row.system_prompt || '',
    config: row.config || ''
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        const data = { ...form }
        if (isEdit.value) {
          await channelApi.update(data)
          ElMessage.success('更新成功')
        } else {
          await channelApi.add(data)
          ElMessage.success('添加成功')
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

const handleTest = async (row) => {
  try {
    ElMessage.info('正在测试渠道...')
    const res = await channelApi.test(row.id)
    if (res.code === 0) {
      ElMessage.success('测试成功！响应时间: ' + res.data.response_time + 'ms')
    } else {
      ElMessage.error('测试失败: ' + res.message)
    }
  } catch (error) {
    ElMessage.error('测试失败')
  }
}

const handleToggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 2 : 1
  try {
    await ElMessageBox.confirm(
      `确定要${newStatus === 1 ? '启用' : '禁用'}该渠道吗？`,
      '提示',
      { type: 'warning' }
    )
    await channelApi.updateStatus(row.id, newStatus)
    ElMessage.success('操作成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该渠道吗？', '警告', { type: 'error' })
    await channelApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.channel-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
