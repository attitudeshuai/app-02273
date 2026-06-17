<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">苏轼社交网络</h1>
          <p class="hero-subtitle">探索北宋文豪的人际关系世界</p>
          <p class="hero-description">
            展现苏轼与家人、朋友、学生、同僚之间的复杂社交网络，
            深入了解这位千古文豪的人生轨迹与社会关系。
          </p>
        </div>
        <div class="hero-image">
          <img src="/cover/avater.png" alt="苏轼" />
          <div class="hero-badge">
            <span class="badge-year">1037-1101</span>
            <span class="badge-name">苏东坡</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Network Graph Section -->
    <section class="network-section">
      <div class="section-header">
        <h2 class="section-title">关系网络图</h2>
      </div>
      <div ref="chartRef" class="network-chart"></div>
    </section>

    <!-- Relation Types Section -->
    <section class="relation-types-section">
      <div class="relation-grid">
        <div 
          v-for="type in relationTypes" 
          :key="type.id" 
          class="relation-card"
          :style="{ borderColor: type.color }"
          @click="goToPersons(type.id)"
        >
          <div class="relation-icon" :style="{ backgroundColor: type.color }">
            <el-icon :size="24"><component :is="type.icon" /></el-icon>
          </div>
          <div class="relation-info">
            <h4 class="relation-name">{{ type.name }}</h4>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="features-grid">
        <div class="feature-card" @click="router.push('/timeline')">
          <div class="feature-icon">
            <el-icon :size="32"><Timer /></el-icon>
          </div>
          <h3 class="feature-title">生平时间线</h3>
          <p class="feature-desc">
            按时间顺序展示苏轼一生的重要事件，包括出生、科举、贬谪、创作等关键节点。
          </p>
        </div>
        <div class="feature-card" @click="router.push('/persons')">
          <div class="feature-icon">
            <el-icon :size="32"><User /></el-icon>
          </div>
          <h3 class="feature-title">人物详情</h3>
          <p class="feature-desc">
            查看每位历史人物的详细信息，包括生平简介、主要成就、与苏轼的关系等。
          </p>
        </div>
      </div>
    </section>

    <!-- Quote Section -->
    <section class="quote-section">
      <div class="quote-card">
        <el-icon class="quote-icon"><ChatDotRound /></el-icon>
        <blockquote class="quote-text">
          "人生到处知何似，应似飞鸿踏雪泥。泥上偶然留指爪，鸿飞那复计东西。"
        </blockquote>
        <p class="quote-source">—— 苏轼《和子由渑池怀旧》</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Timer, User, ChatDotRound } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useNetworkStore } from '@/stores/network'
import { relationTypes } from '@/data/socialNetwork'

const router = useRouter()
const networkStore = useNetworkStore()
const chartRef = ref(null)
let chartInstance = null

const goToPersons = (relationType) => {
  router.push({ path: '/persons', query: { relationType } })
}

// 获取关系类型颜色
const getTypeColor = (type) => {
  const t = relationTypes.find(r => r.id === type)
  return t ? t.color : '#999'
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  // 构建节点数据
  const nodes = networkStore.allPersons.map(p => ({
    id: p.id,
    name: p.name,
    symbolSize: p.id === 'sushi' ? 60 : 35,
    category: p.category,
    itemStyle: {
      color: p.id === 'sushi' ? '#8B4513' : getTypeColor(p.category)
    }
  }))

  // 构建边数据
  const links = networkStore.allRelations.map(r => ({
    source: r.source,
    target: r.target,
    lineStyle: {
      color: getTypeColor(r.type),
      width: 2
    }
  }))

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        if (params.dataType === 'node') {
          const person = networkStore.allPersons.find(p => p.id === params.data.id)
          return `<strong>${person?.name}</strong><br/>${person?.description?.slice(0, 50) || ''}...`
        }
        return ''
      }
    },
    series: [{
      type: 'graph',
      layout: 'force',
      roam: true,
      draggable: true,
      label: {
        show: true,
        position: 'bottom',
        fontSize: 12,
        color: '#333'
      },
      force: {
        repulsion: 300,
        edgeLength: [100, 200],
        gravity: 0.1
      },
      data: nodes,
      links: links,
      emphasis: {
        focus: 'adjacency',
        lineStyle: { width: 4 }
      }
    }]
  }

  chartInstance.setOption(option)
  
  // 点击节点跳转
  chartInstance.on('click', (params) => {
    if (params.dataType === 'node') {
      router.push({ path: '/persons', query: { search: params.data.name } })
    }
  })
}

// 窗口大小变化时重绘
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style lang="scss" scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

// Hero Section
.hero-section {
  background: $bg-light;
  border-radius: $radius-xl;
  padding: 25px;
  box-shadow: $shadow-lg;
  border: 1px solid $border-light;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: $spacing-xl;
}

.hero-text {
  flex: 1;

  .hero-title {
    font-family: $font-family-title;
    font-size: 48px;
    color: $primary-color;
    margin-bottom: $spacing-sm;
  }

  .hero-subtitle {
    font-size: $font-size-xl;
    color: $text-secondary;
    margin-bottom: $spacing-md;
  }

  .hero-description {
    color: $text-muted;
    line-height: 1.8;
  }
}

.hero-image {
  position: relative;
  flex-shrink: 0;

  img {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    object-fit: cover;
    border: 6px solid $primary-color;
    box-shadow: $shadow-lg;
  }

  .hero-badge {
    position: absolute;
    bottom: 0;
    right: -20px;
    background: $primary-color;
    color: white;
    padding: $spacing-sm;
    border-radius: $radius-lg;
    text-align: center;
    box-shadow: $shadow-md;

    .badge-year {
      display: block;
      font-size: $font-size-xs;
      opacity: 0.8;
    }

    .badge-name {
      display: block;
      font-family: $font-family-title;
      font-size: $font-size-lg;
      font-weight: bold;
    }
  }
}

// Section Header
.section-header {
  text-align: center;
  margin-bottom: $spacing-lg;

  .section-title {
    font-family: $font-family-title;
    font-size: $font-size-xxl;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  .section-subtitle {
    color: $text-muted;
    font-size: $font-size-md;
  }
}

// Network Section
.network-section {
  background: $bg-light;
  border-radius: $radius-xl;
  padding: $spacing-lg;
  box-shadow: $shadow-md;

  .network-chart {
    width: 100%;
    height: 500px;
  }
}

// Relation Types Section
.relation-types-section {
  .relation-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-md;
  }
}

.relation-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  background: $bg-light;
  border-radius: $radius-lg;
  padding: $spacing-md;
  border-left: 4px solid;
  box-shadow: $shadow-sm;
  transition: all $transition-fast;
  cursor: pointer;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateX(4px);
  }

  .relation-icon {
    width: 48px;
    height: 48px;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .relation-info {
    .relation-name {
      font-size: $font-size-md;
      color: $text-primary;
      margin-bottom: $spacing-xs;
    }

    .relation-count {
      font-size: $font-size-sm;
      color: $text-muted;
    }
  }
}

// Features Section
.features-section {
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-lg;
  }
}

.feature-card {
  background: $bg-light;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-md;
  border: 1px solid $border-light;
  cursor: pointer;
  transition: all $transition-normal;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
  }

  .feature-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, $primary-color, $primary-light);
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: $spacing-md;
  }

  .feature-title {
    font-size: $font-size-lg;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  .feature-desc {
    color: $text-muted;
    font-size: $font-size-sm;
    line-height: 1.6;
  }
}

// Quote Section
.quote-section {
  .quote-card {
    background: linear-gradient(135deg, $primary-dark, $primary-color);
    border-radius: $radius-xl;
    padding: $spacing-xl;
    text-align: center;
    color: white;

    .quote-icon {
      font-size: 48px;
      opacity: 0.3;
      margin-bottom: $spacing-md;
    }

    .quote-text {
      font-family: $font-family-title;
      font-size: $font-size-xl;
      line-height: 1.8;
      margin-bottom: $spacing-md;
    }

    .quote-source {
      font-size: $font-size-sm;
      opacity: 0.8;
    }
  }
}

// Responsive
@media (max-width: 1200px) {
  .relation-types-section .relation-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column-reverse;
    text-align: center;
  }

  .hero-image img {
    width: 180px;
    height: 180px;
  }

  .network-section .network-chart {
    height: 350px;
  }

  .features-section .features-grid,
  .relation-types-section .relation-grid {
    grid-template-columns: 1fr;
  }
}
</style>
