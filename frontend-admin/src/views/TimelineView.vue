<template>
  <div class="timeline-view">
    <div class="view-header">
      <h1 class="view-title">
        <el-icon><Timer /></el-icon>
        苏轼生平时间线
      </h1>
      <p class="view-subtitle">
        从1037年出生到1101年去世，苏轼跌宕起伏的一生
      </p>
    </div>

    <!-- 时间线筛选 -->
    <div class="filter-bar">
      <el-radio-group v-model="activeFilter" size="default">
        <el-radio-button label="all">全部事件</el-radio-button>
        <el-radio-button label="career">仕途</el-radio-button>
        <el-radio-button label="literature">文学</el-radio-button>
        <el-radio-button label="family">家庭</el-radio-button>
        <el-radio-button label="political">政治</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 时间线 -->
    <div class="timeline-container">
      <div class="timeline-line"></div>
      
      <div 
        v-for="(event, index) in filteredEvents" 
        :key="event.year"
        class="timeline-item"
        :class="[event.type, { left: index % 2 === 0, right: index % 2 !== 0 }]"
      >
        <div class="timeline-dot" :class="event.type">
          <el-icon><component :is="getEventIcon(event.type)" /></el-icon>
        </div>
        
        <div class="timeline-card">
          <div class="card-header">
            <span class="event-year">{{ event.year }}年</span>
            <el-tag :type="getTagType(event.type)" size="small">
              {{ getEventTypeName(event.type) }}
            </el-tag>
          </div>
          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-description">{{ event.description }}</p>
          
          <!-- 年龄计算 -->
          <div class="event-age">
            苏轼时年 {{ event.year - 1037 }} 岁
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Timer, OfficeBuilding, Reading, House, Warning, Star, Sunrise, Moon } from '@element-plus/icons-vue'
import { timelineEvents } from '@/data/socialNetwork'

const activeFilter = ref('all')

const filteredEvents = computed(() => {
  if (activeFilter.value === 'all') {
    return timelineEvents
  }
  return timelineEvents.filter(e => e.type === activeFilter.value)
})

const getEventIcon = (type) => {
  const icons = {
    birth: 'Sunrise',
    death: 'Moon',
    career: 'OfficeBuilding',
    literature: 'Reading',
    family: 'House',
    political: 'Warning'
  }
  return icons[type] || 'Star'
}

const getTagType = (type) => {
  const types = {
    birth: 'success',
    death: 'info',
    career: 'primary',
    literature: 'warning',
    family: 'danger',
    political: ''
  }
  return types[type] || ''
}

const getEventTypeName = (type) => {
  const names = {
    birth: '出生',
    death: '去世',
    career: '仕途',
    literature: '文学',
    family: '家庭',
    political: '政治'
  }
  return names[type] || '其他'
}

</script>

<style lang="scss" scoped>
.timeline-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.view-header {
  text-align: center;

  .view-title {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    font-family: $font-family-title;
    font-size: $font-size-xxl;
    color: $text-primary;
    margin-bottom: $spacing-sm;

    .el-icon {
      color: $primary-color;
    }
  }

  .view-subtitle {
    color: $text-muted;
    font-size: $font-size-md;
  }
}

.filter-bar {
  display: flex;
  justify-content: center;
  padding: $spacing-md;
  border-radius: $radius-lg;
}

.timeline-container {
  position: relative;
  padding: $spacing-xl 0;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, $primary-color, $secondary-color);
  transform: translateX(-50%);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  width: 50%;
  padding: $spacing-md;
  
  &.left {
    padding-right: $spacing-xl;
    text-align: right;

    .timeline-card {
      margin-left: auto;
    }
  }

  &.right {
    left: 50%;
    padding-left: $spacing-xl;
    text-align: left;
  }
}

.timeline-dot {
  position: absolute;
  top: $spacing-lg;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 1;
  box-shadow: $shadow-md;

  .left & {
    right: -20px;
  }

  .right & {
    left: -20px;
  }

  &.birth { background: #2ECC71; }
  &.death { background: #7F8C8D; }
  &.career { background: #3498DB; }
  &.literature { background: #F39C12; }
  &.family { background: #E74C3C; }
  &.political { background: #9B59B6; }
}

.timeline-card {
  max-width: 400px;
  background: $bg-light;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-md;
  border: 1px solid $border-light;
  transition: all $transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .event-year {
    font-family: $font-family-title;
    font-size: $font-size-lg;
    color: $primary-color;
    font-weight: bold;
  }

  .event-title {
    font-size: $font-size-md;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  .event-description {
    font-size: $font-size-sm;
    color: $text-secondary;
    line-height: 1.6;
    margin-bottom: $spacing-sm;
  }

  .event-age {
    font-size: $font-size-xs;
    color: $text-muted;
    padding-top: $spacing-sm;
    border-top: 1px dashed $border-light;
  }
}

.timeline-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-md;
  margin-top: $spacing-lg;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  background: $bg-light;
  border-radius: $radius-lg;
  padding: $spacing-md;
  box-shadow: $shadow-sm;

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;

    &.career { background: #3498DB; }
    &.literature { background: #F39C12; }
    &.family { background: #E74C3C; }
    &.political { background: #9B59B6; }
  }

  .stat-info {
    display: flex;
    flex-direction: column;

    .stat-value {
      font-size: $font-size-xl;
      font-weight: bold;
      color: $text-primary;
    }

    .stat-label {
      font-size: $font-size-xs;
      color: $text-muted;
    }
  }
}

@media (max-width: 768px) {
  .timeline-line {
    left: 20px;
  }

  .timeline-item {
    width: 100%;
    padding-left: 60px !important;
    padding-right: $spacing-md !important;
    text-align: left !important;

    &.left, &.right {
      left: 0;

      .timeline-card {
        margin-left: 0;
      }
    }
  }

  .timeline-dot {
    left: 0 !important;
    right: auto !important;
  }

  .timeline-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
