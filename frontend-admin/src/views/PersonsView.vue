<template>
  <div class="persons-view">
    <div class="view-header">
      <h1 class="view-title">
        <el-icon><User /></el-icon>
        人物列表
      </h1>
      <p class="view-subtitle">
        苏轼社交网络中的 {{ networkStore.allPersons.length }} 位历史人物
      </p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filter-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索人物姓名"
        prefix-icon="Search"
        clearable
        class="search-input"
        @input="handleSearch"
      />
      
      <el-select 
        v-model="categoryFilter" 
        placeholder="按类别筛选" 
        clearable
        class="category-select"
      >
        <el-option label="全部类别" value="" />
        <el-option 
          v-for="cat in categories" 
          :key="cat.id" 
          :label="cat.name" 
          :value="cat.id"
        />
      </el-select>

      <el-select 
        v-model="sortBy" 
        placeholder="排序方式"
        class="sort-select"
      >
        <el-option label="默认排序" value="default" />
        <el-option label="按姓名" value="name" />
        <el-option label="按出生年份" value="birth" />
      </el-select>

      <div class="filter-actions">
        <el-button 
          :type="networkStore.compareMode ? 'success' : 'primary'" 
          :icon="networkStore.compareMode ? 'Close' : 'ScaleToOriginal'"
          @click="toggleCompareMode"
        >
          {{ networkStore.compareMode ? '退出对比' : '人脉对比' }}
        </el-button>
      </div>
    </div>

    <!-- 对比模式提示栏 -->
    <div v-if="networkStore.compareMode" class="compare-bar">
      <div class="compare-info">
        <el-icon><ScaleToOriginal /></el-icon>
        <span>对比模式：请选择两位人物进行对比</span>
        <el-tag v-if="networkStore.comparePersons.length > 0" type="success" effect="dark">
          已选 {{ networkStore.comparePersons.length }} / 2
        </el-tag>
      </div>
      <div class="compare-actions">
        <el-button 
          v-if="networkStore.comparePersons.length === 2" 
          type="success" 
          icon="View"
          @click="showCompareDialog = true"
        >
          查看对比结果
        </el-button>
        <el-button 
          v-if="networkStore.comparePersons.length > 0" 
          icon="RefreshLeft"
          @click="networkStore.clearCompare()"
        >
          清空选择
        </el-button>
      </div>
    </div>

    <!-- 人物卡片列表 -->
    <div class="persons-grid">
      <div 
        v-for="person in displayPersons" 
        :key="person.id"
        class="person-card"
        :class="{ 
          center: person.id === 'sushi',
          'compare-selected': networkStore.isInCompare(person.id),
          'compare-disabled': networkStore.compareMode && networkStore.comparePersons.length >= 2 && !networkStore.isInCompare(person.id)
        }"
        @click="handleCardClick(person)"
      >
        <div class="card-header">
          <el-tag 
            :color="getCategoryColor(person.category)" 
            effect="dark" 
            size="small"
            class="category-tag"
          >
            {{ getCategoryName(person.category) }}
          </el-tag>
          <div v-if="networkStore.compareMode && networkStore.isInCompare(person.id)" class="compare-badge">
            <el-icon><Check /></el-icon>
          </div>
        </div>

        <div class="card-body">
          <h3 class="person-name">{{ person.name }}</h3>
          <div class="person-meta">
            <span v-if="person.courtesy">字 {{ person.courtesy }}</span>
            <span v-if="person.title">号 {{ person.title }}</span>
          </div>
          <div class="person-life" v-if="person.birth">
            {{ person.birth }} - {{ person.death || '?' }}
          </div>
          <p class="person-desc">{{ truncateText(person.description, 60) }}</p>
        </div>

        <div class="card-footer">
          <div class="relation-count">
            <el-icon><Connection /></el-icon>
            <span>{{ getRelationCount(person.id) }} 条关系</span>
          </div>
          <el-button type="primary" link size="small" v-if="!networkStore.compareMode">
            查看详情 <el-icon><ArrowRight /></el-icon>
          </el-button>
          <el-tag v-else-if="networkStore.isInCompare(person.id)" type="success" effect="dark" size="small">
            已选择
          </el-tag>
          <el-tag v-else type="info" effect="plain" size="small">
            点击选择
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty 
      v-if="displayPersons.length === 0" 
      description="没有找到匹配的人物"
    />

    <!-- 人物详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      :title="selectedPerson?.name"
      width="600px"
      class="person-dialog"
    >
      <PersonDetail 
        v-if="selectedPerson"
        :person="selectedPerson"
        @close="detailVisible = false"
        @select-person="handleSelectPerson"
      />
    </el-dialog>

    <!-- 人脉对比弹窗 -->
    <el-dialog
      v-model="showCompareDialog"
      title="人脉关系对比"
      width="900px"
      class="compare-dialog"
      @close="handleCompareClose"
    >
      <PersonCompare 
        :person1="networkStore.comparePersons[0]"
        :person2="networkStore.comparePersons[1]"
        @select-person="handleCompareSelectPerson"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { User, Connection, ArrowRight, ScaleToOriginal, Check, RefreshLeft, View, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useNetworkStore } from '@/stores/network'
import PersonDetail from '@/components/network/PersonDetail.vue'
import PersonCompare from '@/components/network/PersonCompare.vue'

const route = useRoute()
const networkStore = useNetworkStore()

const searchKeyword = ref('')
const categoryFilter = ref('')
const relationTypeFilter = ref('')
const sortBy = ref('default')
const detailVisible = ref(false)
const selectedPerson = ref(null)
const showCompareDialog = ref(false)

const categories = [
  { id: 'center', name: '中心人物', color: '#8B4513' },
  { id: 'family', name: '家人', color: '#E74C3C' },
  { id: 'friend', name: '挚友', color: '#3498DB' },
  { id: 'student', name: '学生', color: '#2ECC71' },
  { id: 'colleague', name: '同僚', color: '#F39C12' },
  { id: 'political', name: '政敌', color: '#9B59B6' },
  { id: 'mentor', name: '师长', color: '#1ABC9C' }
]

// 监听 URL 参数变化
watch(() => route.query.relationType, (newVal) => {
  const val = Array.isArray(newVal) ? newVal[0] : newVal
  relationTypeFilter.value = val || ''
  if (val) {
    categoryFilter.value = relationTypeFilter.value
  }
}, { immediate: true })

watch(() => route.query.search, (newVal) => {
  const val = Array.isArray(newVal) ? newVal[0] : newVal
  if (val) {
    searchKeyword.value = val
    networkStore.setSearchKeyword(val)
  }
}, { immediate: true })

// 监听 store 中的搜索关键词
watch(() => networkStore.searchKeyword, (newVal) => {
  searchKeyword.value = newVal
}, { immediate: true })

// 获取与某关系类型相关的所有人物ID
const getPersonIdsByRelationType = (relationType) => {
  const personIds = new Set()
  const relations = networkStore.allRelations
  relations
    .filter(r => r.type === relationType)
    .forEach(r => {
      personIds.add(r.source)
      personIds.add(r.target)
    })
  return personIds
}

const displayPersons = computed(() => {
  let result = [...networkStore.allPersons]

  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(keyword)
    )
  }

  // 类别过滤
  if (categoryFilter.value) {
    result = result.filter(p => p.category === categoryFilter.value)
  }

  // 关系类型过滤
  if (relationTypeFilter.value) {
    const personIds = getPersonIdsByRelationType(relationTypeFilter.value)
    result = result.filter(p => personIds.has(p.id))
  }

  // 排序
  if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name, 'zh'))
  } else if (sortBy.value === 'birth') {
    result.sort((a, b) => (a.birth || 0) - (b.birth || 0))
  }

  return result
})

const getCategoryColor = (category) => {
  const cat = categories.find(c => c.id === category)
  return cat ? cat.color : '#999'
}

const getCategoryName = (category) => {
  const cat = categories.find(c => c.id === category)
  return cat ? cat.name : '其他'
}

const getRelationCount = (personId) => {
  return networkStore.allRelations.filter(r => 
    r.source === personId || r.target === personId
  ).length
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

const handleSearch = (value) => {
  networkStore.setSearchKeyword(value)
}

const showPersonDetail = (person) => {
  selectedPerson.value = person
  detailVisible.value = true
}

const handleSelectPerson = (person) => {
  selectedPerson.value = person
}

const toggleCompareMode = () => {
  networkStore.toggleCompareMode()
  showCompareDialog.value = false
}

const handleCardClick = (person) => {
  if (networkStore.compareMode) {
    if (networkStore.isInCompare(person.id)) {
      networkStore.removeFromCompare(person.id)
    } else if (networkStore.comparePersons.length < 2) {
      networkStore.addToCompare(person)
      if (networkStore.comparePersons.length === 2) {
        ElMessage.success('已选择两位人物，点击"查看对比结果"查看详情')
      }
    } else {
      ElMessage.warning('最多只能选择两位人物进行对比')
    }
  } else {
    showPersonDetail(person)
  }
}

const handleCompareClose = () => {
  showCompareDialog.value = false
}

const handleCompareSelectPerson = (person) => {
  showCompareDialog.value = false
  showPersonDetail(person)
}
</script>

<style lang="scss" scoped>
.persons-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.view-header {
  .view-title {
    display: flex;
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
    font-size: $font-size-sm;
  }
}

.filter-bar {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $bg-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  flex-wrap: wrap;
  align-items: center;

  .search-input {
    width: 300px;
  }

  .category-select,
  .sort-select {
    width: 150px;
  }

  .filter-actions {
    margin-left: auto;
  }
}

.compare-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md $spacing-lg;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(26, 188, 156, 0.1));
  border: 1px solid rgba(46, 204, 113, 0.3);
  border-radius: $radius-lg;

  .compare-info {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    color: $text-primary;
    font-size: $font-size-md;

    .el-icon {
      color: $success-color;
      font-size: 18px;
    }
  }

  .compare-actions {
    display: flex;
    gap: $spacing-sm;
  }
}

.persons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
}

.person-card {
  background: $bg-light;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-md;
  border: 2px solid $border-light;
  cursor: pointer;
  transition: all $transition-fast;
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
  }

  &.center {
    border-color: $primary-color;
    background: linear-gradient(135deg, $bg-light, rgba($primary-color, 0.05));
  }

  &.compare-selected {
    border-color: $success-color;
    background: linear-gradient(135deg, $bg-light, rgba($success-color, 0.08));
    box-shadow: 0 4px 12px rgba($success-color, 0.2);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba($success-color, 0.3);
    }
  }

  &.compare-disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      transform: none;
      box-shadow: $shadow-md;
    }
  }

  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .category-tag {
      border: none;
    }

    .compare-badge {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: $success-color;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba($success-color, 0.4);

      .el-icon {
        font-size: 14px;
      }
    }
  }

  .card-body {
    flex: 1;
    min-height: 120px;

    .person-name {
      font-family: $font-family-title;
      font-size: $font-size-xl;
      color: $text-primary;
      margin-bottom: $spacing-xs;
    }

    .person-meta {
      display: flex;
      gap: $spacing-md;
      font-size: $font-size-sm;
      color: $text-secondary;
      margin-bottom: $spacing-xs;
    }

    .person-life {
      font-size: $font-size-xs;
      color: $text-muted;
      margin-bottom: $spacing-sm;
    }

    .person-desc {
      font-size: $font-size-sm;
      color: $text-secondary;
      line-height: 1.6;
    }
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: $spacing-md;
    padding-top: $spacing-md;
    border-top: 1px solid $border-light;

    .relation-count {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      font-size: $font-size-sm;
      color: $text-muted;

      .el-icon {
        color: $primary-color;
      }
    }
  }
}

.person-dialog {
  :deep(.el-dialog__header) {
    font-family: $font-family-title;
  }
}

.compare-dialog {
  :deep(.el-dialog__header) {
    font-family: $font-family-title;
  }

  :deep(.el-dialog__body) {
    padding-top: 0;
  }
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;

    .search-input,
    .category-select,
    .sort-select {
      width: 100%;
    }
  }

  .persons-grid {
    grid-template-columns: 1fr;
  }
}
</style>
