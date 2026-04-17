<template>
  <el-container class="main-layout">
    <el-aside :width="isCollapse ? '56px' : '180px'" class="sidebar" :class="{ collapse: isCollapse }">
      <div class="logo">
        <img v-show="isCollapse" :src="logo[1]" alt="Logo" />
        <object
          v-show="!isCollapse"
          id="logo-svg"
          type="image/svg+xml"
          :data="logo[0]"
          style="pointer-events: none; width: 200px; height: 80px;"
        ></object>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        :router="true"
        :collapse="isCollapse"
        background-color="transparent"
        text-color="#4d5a72"
        active-text-color="#0050d8"
        :collapse-transition="false"
      >
        <el-tooltip v-if="isCollapse" content="总览" placement="right">
          <el-menu-item index="/dashboard">
            <img :src="isActive('/dashboard') ? menuIcons.dashboard.active : menuIcons.dashboard.normal" alt="总览" class="menu-icon" />
            <span>总览</span>
          </el-menu-item>
        </el-tooltip>
        <el-menu-item v-else index="/dashboard">
          <img :src="isActive('/dashboard') ? menuIcons.dashboard.active : menuIcons.dashboard.normal" alt="总览" class="menu-icon" />
          <span>总览</span>
        </el-menu-item>
        
        <el-tooltip v-if="isCollapse && userStore.isAdmin" content="渠道管理" placement="right">
          <el-menu-item index="/channel">
            <img :src="isActive('/channel') ? menuIcons.channel.active : menuIcons.channel.normal" alt="渠道管理" class="menu-icon" />
            <span>渠道管理</span>
          </el-menu-item>
        </el-tooltip>
        <el-menu-item v-else index="/channel" v-if="userStore.isAdmin">
          <img :src="isActive('/channel') ? menuIcons.channel.active : menuIcons.channel.normal" alt="渠道管理" class="menu-icon" />
          <span>渠道管理</span>
        </el-menu-item>
        
        <el-tooltip v-if="isCollapse" content="令牌管理" placement="right">
          <el-menu-item index="/token">
            <img :src="isActive('/token') ? menuIcons.token.active : menuIcons.token.normal" alt="令牌管理" class="menu-icon" />
            <span>令牌管理</span>
          </el-menu-item>
        </el-tooltip>
        <el-menu-item v-else index="/token">
          <img :src="isActive('/token') ? menuIcons.token.active : menuIcons.token.normal" alt="令牌管理" class="menu-icon" />
          <span>令牌管理</span>
        </el-menu-item>
        
        <el-tooltip v-if="isCollapse" content="日志" placement="right">
          <el-menu-item index="/log">
            <img :src="isActive('/log') ? menuIcons.log.active : menuIcons.log.normal" alt="日志" class="menu-icon" />
            <span>日志</span>
          </el-menu-item>
        </el-tooltip>
        <el-menu-item v-else index="/log">
          <img :src="isActive('/log') ? menuIcons.log.active : menuIcons.log.normal" alt="日志" class="menu-icon" />
          <span>日志</span>
        </el-menu-item>
        
        <el-tooltip v-if="isCollapse && userStore.isAdmin" content="兑换码" placement="right">
          <el-menu-item index="/redemption">
            <img :src="isActive('/redemption') ? menuIcons.redemption.active : menuIcons.redemption.normal" alt="兑换码" class="menu-icon" />
            <span>兑换码</span>
          </el-menu-item>
        </el-tooltip>
        <el-menu-item v-else index="/redemption" v-if="userStore.isAdmin">
          <img :src="isActive('/redemption') ? menuIcons.redemption.active : menuIcons.redemption.normal" alt="兑换码" class="menu-icon" />
          <span>兑换码</span>
        </el-menu-item>
        
        <el-tooltip v-if="isCollapse" content="充值" placement="right">
          <el-menu-item index="/topup">
            <img :src="isActive('/topup') ? menuIcons.topup.active : menuIcons.topup.normal" alt="充值" class="menu-icon" />
            <span>充值</span>
          </el-menu-item>
        </el-tooltip>
        <el-menu-item v-else index="/topup">
          <img :src="isActive('/topup') ? menuIcons.topup.active : menuIcons.topup.normal" alt="充值" class="menu-icon" />
          <span>充值</span>
        </el-menu-item>
        
        <el-tooltip v-if="isCollapse && userStore.isAdmin" content="用户管理" placement="right">
          <el-menu-item index="/user">
            <img :src="isActive('/user') ? menuIcons.user.active : menuIcons.user.normal" alt="用户管理" class="menu-icon" />
            <span>用户管理</span>
          </el-menu-item>
        </el-tooltip>
        <el-menu-item v-else index="/user" v-if="userStore.isAdmin">
          <img :src="isActive('/user') ? menuIcons.user.active : menuIcons.user.normal" alt="用户管理" class="menu-icon" />
          <span>用户管理</span>
        </el-menu-item>
        
        <el-tooltip v-if="isCollapse && userStore.isAdmin" content="系统设置" placement="right">
          <el-menu-item index="/setting">
            <img :src="isActive('/setting') ? menuIcons.setting.active : menuIcons.setting.normal" alt="系统设置" class="menu-icon" />
            <span>系统设置</span>
          </el-menu-item>
        </el-tooltip>
        <el-menu-item v-else index="/setting" v-if="userStore.isAdmin">
          <img :src="isActive('/setting') ? menuIcons.setting.active : menuIcons.setting.normal" alt="系统设置" class="menu-icon" />
          <span>系统设置</span>
        </el-menu-item>
        
        <el-tooltip v-if="isCollapse" content="个人资料" placement="right">
          <el-menu-item index="/profile">
            <img :src="isActive('/profile') ? menuIcons.profile.active : menuIcons.profile.normal" alt="个人资料" class="menu-icon" />
            <span>个人资料</span>
          </el-menu-item>
        </el-tooltip>
        <el-menu-item v-else index="/profile">
          <img :src="isActive('/profile') ? menuIcons.profile.active : menuIcons.profile.normal" alt="个人资料" class="menu-icon" />
          <span>个人资料</span>
        </el-menu-item>
      </el-menu>
      
      <div class="welcome" :class="{ collapse: isCollapse }">
        <p class="welcome-title">您好，{{ userStore.user?.username }}！</p>
        <p class="welcome-intro">欢迎使用 统一模型网关</p>
      </div>
    </el-aside>
    
    <el-container class="main-container">
      <el-header class="header">
        <div class="header-left">
          <div class="collapse-btn" @click="toggleCollapse">
            <i :class="{ 'collapse-icon': true, collapse: isCollapse }"></i>
          </div>
          <el-input
            v-model="searchKey"
            placeholder="请输入"
            class="search-input"
          >
            <template #prefix>
              <img src="@/assets/images/icon-search.svg" alt="search" class="search-icon" />
            </template>
          </el-input>
        </div>
        <div class="header-right">
          <div class="oper-items">
            <div class="oper-item msg">
              <img src="@/assets/images/icon-msg.svg" alt="消息" />
              <span class="badge">12</span>
            </div>
            <div class="oper-item doc">
              <img src="@/assets/images/icon-doc.svg" alt="使用手册" />
            </div>
          </div>
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="userAvatar">
                {{ userStore.user?.username?.charAt(0)?.toUpperCase() }}
              </el-avatar>
              <span class="username">{{ userStore.user?.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人资料
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessageBox } from 'element-plus'
import { ArrowDown, SwitchButton, User } from '@element-plus/icons-vue'
import iconLogo1 from '@/assets/images/icon-logo.svg'
import iconLogo2 from '@/assets/images/icon-logo2.png'

import iconMenu1 from '@/assets/images/icon-menu1.svg'
import iconMenu1_1 from '@/assets/images/icon-menu1-1.svg'
import iconMenu2 from '@/assets/images/icon-menu2.svg'
import iconMenu2_1 from '@/assets/images/icon-menu2-1.svg'
import iconMenu3 from '@/assets/images/icon-menu3.svg'
import iconMenu3_1 from '@/assets/images/icon-menu3-1.svg'
import iconMenu4 from '@/assets/images/icon-menu4.svg'
import iconMenu4_1 from '@/assets/images/icon-menu4-1.svg'
import iconMenu5 from '@/assets/images/icon-menu5.svg'
import iconMenu5_1 from '@/assets/images/icon-menu5-1.svg'
import iconMenu6 from '@/assets/images/icon-menu6.svg'
import iconMenu6_1 from '@/assets/images/icon-menu6-1.svg'
import iconMenu7 from '@/assets/images/icon-menu7.svg'
import iconMenu7_1 from '@/assets/images/icon-menu7-1.svg'
import iconMenu8 from '@/assets/images/icon-menu8.svg'
import iconMenu8_1 from '@/assets/images/icon-menu8-1.svg'
import iconMenu9 from '@/assets/images/icon-menu9.svg'
import iconMenu9_1 from '@/assets/images/icon-menu9-1.svg'
import iconMenu10 from '@/assets/images/icon-menu10.svg'
import iconMenu10_1 from '@/assets/images/icon-menu10-1.svg'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const userAvatar = ref('')
const searchKey = ref('')
const isCollapse = ref(false)
const logo = [iconLogo1, iconLogo2]

const menuIcons = {
  dashboard: { normal: iconMenu10, active: iconMenu10_1 },
  channel: { normal: iconMenu1, active: iconMenu1_1 },
  token: { normal: iconMenu2, active: iconMenu2_1 },
  log: { normal: iconMenu3, active: iconMenu3_1 },
  redemption: { normal: iconMenu4, active: iconMenu4_1 },
  topup: { normal: iconMenu5, active: iconMenu5_1 },
  user: { normal: iconMenu6, active: iconMenu6_1 },
  setting: { normal: iconMenu7, active: iconMenu7_1 },
  profile: { normal: iconMenu8, active: iconMenu8_1 },
}

const activeMenu = computed(() => route.path)

const isActive = (path) => route.path === path

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = async (command) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      userStore.clearUser()
      router.push('/login')
    } catch {}
  } else if (command === 'profile') {
    router.push('/profile')
  }
}
</script>

<style lang="scss" scoped>
.main-layout {
  height: 100vh;
  background: 
    url('@/assets/images/bg-page.png') center top/100% 100vh no-repeat fixed,
    linear-gradient(0deg, #fff 0%, #eaf2ff 100%);
}

.sidebar {
  background: linear-gradient(180deg, #ecf4ff 0%, #f0f6ff 100%);
  overflow-x: hidden;
  transition: width 0.35s ease;
  border-right: 1px solid #e8eef4;
  position: relative;
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: -120px;
    left: 50%;
    width: 200px;
    height: 200px;
    background: url('@/assets/images/bg-circle1.png') center center/100% no-repeat;
    opacity: 0.5;
    transform: translateX(-50%);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -100px;
    right: -50px;
    width: 170px;
    height: 170px;
    background: url('@/assets/images/bg-circle3.png') center center/100% no-repeat;
    opacity: 0.5;
  }

  .logo {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #0050d8;
    font-size: 18px;
    font-weight: bold;
    border-bottom: 1px solid #e8eef4;
    position: relative;
    z-index: 1;

    img {
      height: 80px;
    }

    object {
      width: 200px;
      height: 80px;
    }
  }

  .sidebar-menu {
    border-right: none;
    position: relative;
    z-index: 1;
    flex: 1;
    padding: 12px 0;
    
    .el-menu-item {
      height: 40px;
      line-height: 40px;
      margin: 0 8px 4px;
      border-radius: 6px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 12px;
      
      &:hover {
        background-color: #f0f0f0 !important;
      }
      
      &.is-active {
        background: #e8e8e8 !important;
        
        span {
          color: #333;
        }
        
        .menu-icon {
          opacity: 0.8;
        }
      }
      
      .menu-icon {
        width: 18px;
        height: 18px;
        margin-right: 10px;
        flex-shrink: 0;
      }
      
      span {
        color: #4d5a72;
        font-size: 13px;
      }
    }
  }

  .welcome {
    position: relative;
    box-sizing: border-box;
    width: 160px;
    padding: 15px 10px;
    margin: 20px auto;
    border-radius: 15px;
    text-align: center;
    color: #94a6c8;
    background: #ecf4ff;
    transition: all 0.35s ease;
    z-index: 1;
    
    &::before {
      content: '';
      position: absolute;
      top: -70px;
      left: 50%;
      width: 100%;
      height: 70px;
      background: url('@/assets/images/xiaosi.gif') center top/88px auto no-repeat;
      transform: translateX(-50%);
    }
    
    &-title {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #4d5a72;
    }
    
    &-intro {
      margin: 7px 0 0;
      font-size: 12px;
    }
    
    &.collapse {
      width: 1px;
      height: 1px;
      padding: 0;
      background: none;
      
      &::before {
        width: 50px;
        height: 50px;
        background-size: 100% auto;
        top: -50px;
      }
      
      p {
        display: none;
      }
    }
  }
  
  &.collapse {
    .sidebar-menu {
      .el-menu-item {
        justify-content: center;
        padding: 0;
        
        span {
          display: none;
        }
        
        .menu-icon {
          margin-right: 0;
        }
      }
    }
  }
}

.main-container {
  flex: 1;
  background: transparent;
}

.header {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: saturate(180%) blur(6px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: none;
  position: relative;
  z-index: 10;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -120px;
    left: 60%;
    z-index: -1;
    width: 170px;
    height: 170px;
    background: url('@/assets/images/bg-circle3.png') center center/100% no-repeat;
  }
  
  &::after {
    left: 20%;
    width: 200px;
    height: 200px;
    background-image: url('@/assets/images/bg-circle1.png');
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .collapse-btn {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    background: #eff4ff url('@/assets/images/icon-collapse.svg') center center/20px auto no-repeat;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      box-shadow: 0 0 5px 2px #e6e6e6;
    }
    
    .collapse-icon {
      width: 30px;
      height: 30px;
      border-radius: 6px;
      background: #eff4ff url('@/assets/images/icon-collapse.svg') center center/20px auto no-repeat;
      transition: transform 0.3s;
      
      &.collapse {
        transform: rotate(180deg);
      }
    }
  }

  .search-input {
    width: 240px;
    border-radius: 6px;
    
    :deep(.el-input__wrapper) {
      border-radius: inherit;
      background-color: #eff4ff;
      box-shadow: none;
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 0 5px 2px #e6e6e6;
      }
      
      &.is-focus {
        box-shadow:
          0 0 0 1px #0050d8 inset,
          0 0 5px 2px #e6e6e6;
      }
    }
    
    :deep(.el-input__inner::placeholder) {
      color: #94a6c8;
    }
  }

  .search-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .oper-items {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .oper-item {
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      
      img {
        width: 20px;
        height: 20px;
      }
      
      &.msg {
        .badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          border-radius: 8px;
          background: #ff4d4f;
          color: #fff;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      
      .username {
        font-size: 14px;
        color: #4d5a72;
      }
    }
  }
}

.main-content {
  padding: 20px;
  overflow-y: auto;
  background: transparent;
}
</style>
