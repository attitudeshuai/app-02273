<template>
  <div class="persons-view">
    <div class="view-header">
      <div class="header-left">
        <h1 class="view-title">
          <el-icon><User /></el-icon>
          人物列表
        </h1>
        <p class="view-subtitle">
          苏轼社交网络中的 {{ networkStore.allPersons.length }} 位历史人物
        </p>
      </div>
      <div class="header-right">
        <el-button 
        :type="networkStore.compareMode ? 'primary' : 'default'"
        @click="toggleCompareMode"
      >
        <el-icon><CopyDocument /></el-icon>
        {{ networkStore.compareMode ? '退出对比' : '人物对比' }}
      </el-button>
      </div>
    </div>

    <div class="compare-hint" v-if="networkStore.compareMode">
      <el-alert
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          {{ compareHintText }}
          <el-button
            v-if="networkStore.comparePersons.length === 2"
            type="primary"
            size="small"
            style="margin-left: 12px"
            @click="openCompareDialog"
          >
            开始对比
          </el-button>
          <el-button
            v-if="networkStore.comparePersons.length > 0"
            size="small"
            style="margin-left: 8px"
            @click="networkStore.clearCompare()"
          >
            清空选择
          </el-button>
        </template>
      </el-alert>
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
    </div>

    <!-- 人物卡片列表 -->
    <div class="persons-grid">
      <div 
        v-for="person in displayPersons" 
        :key="person.id"
        class="person-card"
        :class="{ 
          center: person.id === 'sushi',
          'compare-selected': networkStore.isPersonInCompare(person.id)
        }"
        @click="handleCardClick(person)"
      >
        <div class="card-header" v-if="networkStore.compareMode">
          <el-checkbox 
          :model-value="networkStore.isPersonInCompare(person.id)"
          :disabled="!networkStore.isPersonInCompare(person.id) && networkStore.comparePersons.length >= 2"
          @click.stop
          @change="() => networkStore.toggleComparePerson(person)"
        />
        </div>
        <div class="card-header" v-else>
          <el-tag 
            :color="getCategoryColor(person.category)" 
            effect="dark" 
            size="small"
            class="category-tag"
          >
            {{ getCategoryName(person.category) }}
          </el-tag>
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
          <el-button type="primary" link size="small">
            查看详情 <el-icon><ArrowRight /></el-icon>
          </el-button>
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

    <!-- 人物对比弹窗 -->
    <el-dialog
      v-model="compareVisible"
      title="人脉关系对比"
      width="1000px"
      class="compare-dialog"
    >
      <PersonCompare 
        v-if="networkStore.comparePersons.length === 2"
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
import { User, Connection, ArrowRight, CopyDocument } from '@element-plus/icons-vue'
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
const compareVisible = ref(false)

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

const compareHintText = computed(() => {
  const count = networkStore.comparePersons.length
  if (count === 0) return '请选择两个人物进行对比（已选 0/2）'
  if (count === 1) return `已选择 ${networkStore.comparePersons[0].name}，请再选择一人（已选 1/2）`
  return `已选择 ${networkStore.comparePersons[0].name} 和 ${networkStore.comparePersons[1].name}（已选 2/2）`
})

const toggleCompareMode = () => {
  networkStore.setCompareMode(!networkStore.compareMode)
}

const handleCardClick = (person) => {
  if (networkStore.compareMode) {
    networkStore.toggleComparePerson(person)
  } else {
    showPersonDetail(person)
  }
}

const openCompareDialog = () => {
  compareVisible.value = true
}

const handleCompareSelectPerson = (person) => {
  compareVisible.value = false
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
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $spacing-md;

  .header-left {
    flex: 1;
  }

  .header-right {
    flex-shrink: 0;
  }

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

.compare-hint {
  margin-bottom: 0;
}

.filter-bar {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $bg-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  flex-wrap: wrap;

  .search-input {
    width: 300px;
  }

  .category-select,
  .sort-select {
    width: 150px;
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
  border: 1px solid $border-light;
  cursor: pointer;
  transition: all $transition-fast;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
  }

  &.center {
    border: 2px solid $primary-color;
    background: linear-gradient(135deg, $bg-light, rgba($primary-color, 0.05));
  }

  &.compare-selected {
    border: 2px solid #F39C12;
    background: linear-gradient(135deg, $bg-light, rgba(243, 156, 18, 0.08));
    box-shadow: 0 4px 12px rgba(243, 156, 18, 0.2);
  }

  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;

    .category-tag {
      border: none;
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
    padding-top: $spacing-md;
  }
}

@media (max-width: 768px) {
  .view-header {
    flex-direction: column;
    align-items: stretch;
  }

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
