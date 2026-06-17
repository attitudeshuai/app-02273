<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo" @click="router.push('/')">
        <div class="logo-icon">苏</div>
        <div class="logo-text">
          <span class="title">苏轼社交网络</span>
        </div>
      </div>
      
      <nav class="nav-menu">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: route.path === item.path }"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.name }}</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNetworkStore } from '@/stores/network'

const router = useRouter()
const route = useRoute()
const networkStore = useNetworkStore()

const searchKeyword = ref('')

const menuItems = [
  { name: '首页', path: '/', icon: 'HomeFilled' },
  { name: '时间线', path: '/timeline', icon: 'Timer' },
  { name: '人物列表', path: '/persons', icon: 'User' },
  { name: '关于', path: '/about', icon: 'InfoFilled' }
]
</script>

<style lang="scss" scoped>
.app-header {
  background: linear-gradient(135deg, $primary-dark 0%, $primary-color 100%);
  box-shadow: $shadow-md;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: $spacing-md $spacing-lg;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-lg;
}

.logo {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  cursor: pointer;
  transition: transform $transition-fast;

  &:hover {
    transform: scale(1.02);
  }
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: $bg-light;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: $font-family-title;
  font-size: 24px;
  color: $primary-color;
  font-weight: bold;
}

.logo-text {
  display: flex;
  flex-direction: column;

  .title {
    font-family: $font-family-title;
    font-size: $font-size-xl;
    color: $bg-light;
    font-weight: bold;
    line-height: 1.2;
  }

  .subtitle {
    font-size: $font-size-xs;
    color: rgba(255, 255, 255, 0.7);
  }
}

.nav-menu {
  display: flex;
  gap: $spacing-sm;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  color: rgba(255, 255, 255, 0.85);
  border-radius: $radius-md;
  transition: all $transition-fast;
  font-size: $font-size-sm;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .el-icon {
    font-size: 18px;
  }
}

.header-actions {
  display: flex;
  align-items: center;
}

.search-input {
  width: 200px;

  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    box-shadow: none;

    &:hover, &.is-focus {
      background: rgba(255, 255, 255, 0.25);
    }
  }

  :deep(.el-input__inner) {
    color: white;

    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
  }

  :deep(.el-input__prefix) {
    color: rgba(255, 255, 255, 0.7);
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    padding: $spacing-sm $spacing-md;
  }

  .nav-menu {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: $spacing-sm;
  }

  .nav-item span {
    display: none;
  }

  .search-input {
    width: 150px;
  }
}
</style>
