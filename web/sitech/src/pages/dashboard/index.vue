<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <el-icon :size="28"><Coin /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">当前配额</div>
              <div class="stat-value">{{ formatQuota(userStore.user?.quota || 0) }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
              <el-icon :size="28"><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">已使用配额</div>
              <div class="stat-value">{{ formatQuota(userStore.user?.used_quota || 0) }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
              <el-icon :size="28"><Connection /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">可用渠道</div>
              <div class="stat-value">{{ channelCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
              <el-icon :size="28"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">请求次数</div>
              <div class="stat-value">{{ userStore.user?.request_count || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>使用趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">近7天</el-radio-button>
                <el-radio-button label="month">近30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="chartRef" style="height: 350px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px" v-if="userStore.isAdmin">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>渠道状态</span>
          </template>
          <div class="channel-status">
            <div v-for="status in channelStats" :key="status.name" class="status-item">
              <el-tag :type="status.type" size="large">{{ status.label }}</el-tag>
              <span class="status-count">{{ status.count }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>快速操作</span>
          </template>
          <div class="quick-actions">
            <el-button type="primary" @click="router.push('/token')">创建令牌</el-button>
            <el-button type="success" @click="router.push('/topup')">充值配额</el-button>
            <el-button v-if="userStore.isAdmin" @click="router.push('/channel')">管理渠道</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { systemApi, channelApi } from '@/api'
import { formatQuota } from '@/utils/constants'
import * as echarts from 'echarts'

const router = useRouter()
const userStore = useUserStore()

const timeRange = ref('week')
const chartRef = ref()
const channelCount = ref(0)
const channelStats = ref([])
const chartInstance = ref()

const loadData = async () => {
  try {
    if (userStore.isAdmin) {
      const res = await systemApi.getHomeData()
      if (res.data) {
        channelCount.value = res.data.channel_count || 0
        channelStats.value = res.data.channel_stats || []
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const loadChannels = async () => {
  if (!userStore.isAdmin) {
    channelCount.value = '-'
    return
  }
  try {
    const res = await channelApi.getAll()
    channelCount.value = res.data?.length || 0
  } catch (error) {
    console.error(error)
  }
}

const initChart = () => {
  if (!chartRef.value) return
  chartInstance.value = echarts.init(chartRef.value)
  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'line',
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(102, 126, 234, 0.5)' },
          { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
        ])
      }
    }]
  }
  chartInstance.value.setOption(option)
}

onMounted(() => {
  loadData()
  loadChannels()
  initChart()
})
</script>

<style lang="scss" scoped>
.dashboard {
  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
      
      .stat-info {
        flex: 1;
        
        .stat-label {
          color: #999;
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
      }
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .channel-status {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 10px;
      
      .status-count {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
  
  .quick-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}
</style>
