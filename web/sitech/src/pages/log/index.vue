<template>
  <div class="log-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>日志记录</span>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="日志类型">
          <el-select v-model="searchForm.type" placeholder="全部" clearable style="width: 120px">
            <el-option :value="1" label="充值" />
            <el-option :value="2" label="消费" />
            <el-option :value="3" label="管理" />
            <el-option :value="4" label="系统" />
            <el-option :value="5" label="测试" />
          </el-select>
        </el-form-item>
        <el-form-item label="模型">
          <el-input v-model="searchForm.model_name" placeholder="请输入模型名" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="用户名" v-if="userStore.isAdmin">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item label="渠道" v-if="userStore.isAdmin">
          <el-select v-model="searchForm.channel" placeholder="全部" clearable style="width: 120px">
            <el-option v-for="ch in channels" :key="ch.id" :value="ch.id" :label="ch.name" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="用户" width="100" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="LOG_TYPES[row.type]?.type || 'info'" size="small">
              {{ LOG_TYPES[row.type]?.label || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="model_name" label="模型" width="150" />
        <el-table-column prop="quota" label="配额" width="100">
          <template #default="{ row }">
            {{ row.quota > 0 ? '+' + formatQuota(row.quota) : formatQuota(row.quota) }}
          </template>
        </el-table-column>
        <el-table-column prop="prompt_tokens" label="输入" width="70" />
        <el-table-column prop="completion_tokens" label="输出" width="70" />
        <el-table-column prop="channel_id" label="渠道" width="60" />
        <el-table-column prop="elapsed_time" label="耗时" width="80">
          <template #default="{ row }">{{ row.elapsed_time }}ms</template>
        </el-table-column>
        <el-table-column prop="created_at" label="时间" width="170">
          <template #default="{ row }">{{ formatDateTime(row.created_at) }}</template>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { logApi } from '@/api'
import { LOG_TYPES, formatQuota, formatDateTime } from '@/utils/constants'

const userStore = useUserStore()
const loading = ref(false)
const tableData = ref([])
const channels = ref([])
const searchForm = reactive({ type: '', model_name: '', username: '', channel: '' })
const pagination = reactive({ page: 1, size: 20, total: 0 })

const loadData = async () => {
  loading.value = true
  try {
    const params = { page: pagination.page, size: pagination.size, ...searchForm }
    Object.keys(params).forEach(key => !params[key] && delete params[key])
    let res
    if (userStore.isAdmin) {
      res = await logApi.getList(params)
    } else {
      res = await logApi.getSelfList(params)
    }
    if (Array.isArray(res.data)) {
      tableData.value = res.data || []
      pagination.total = res.data?.length || 0
    } else {
      tableData.value = res.data?.list || res.data || []
      pagination.total = res.data?.total || (Array.isArray(res.data) ? res.data.length : 0)
    }
  } catch (error) { console.error(error) }
  finally { loading.value = false }
}

const loadChannels = async () => {
  if (!userStore.isAdmin) {
    channels.value = []
    return
  }
  try {
    const res = await logApi.getChannels()
    channels.value = res.data || []
  } catch (error) { console.error(error) }
}

const handleReset = () => {
  if (userStore.isAdmin) {
    Object.assign(searchForm, { type: '', model_name: '', username: '', channel: '' })
  } else {
    Object.assign(searchForm, { type: '', model_name: '' })
  }
  loadData()
}

onMounted(() => { loadData(); loadChannels() })
</script>

<style lang="scss" scoped>
.log-page { .card-header { display: flex; justify-content: space-between; } .search-form { margin-bottom: 15px; } }
</style>
