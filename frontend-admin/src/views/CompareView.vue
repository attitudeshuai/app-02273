<template>
  <div class="compare-view">
    <div class="view-header">
      <h1 class="view-title">
        <el-icon><Histogram /></el-icon>
        人脉对比
      </h1>
      <p class="view-subtitle">
        对比两位人物的社交网络，发现他们的共同人脉
      </p>
    </div>

    <div v-if="networkStore.comparePersons.length < 2" class="empty-compare">
      <el-empty description="请选择两位人物进行对比">
        <el-button type="primary" @click="router.push('/persons')">
          去选择人物
        </el-button>
      </el-empty>
    </div>

    <div v-else class="compare-content">
      <div class="compare-stats">
        <div class="stat-card">
          <div class="stat-icon left-icon">
            <el-icon :size="28"><User /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-label">{{ person1?.name }}的人脉</span>
            <span class="stat-value">{{ relatedPersons1.length }} 人</span>
          </div>
        </div>
        <div class="stat-card common-card">
          <div class="stat-icon common-icon">
            <el-icon :size="28"><Connection /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-label">共同认识</span>
            <span class="stat-value">{{ commonPersons.length }} 人</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon right-icon">
            <el-icon :size="28"><User /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-label">{{ person2?.name }}的人脉</span>
            <span class="stat-value">{{ relatedPersons2.length }} 人</span>
          </div>
        </div>
      </div>

      <div class="persons-selector">
        <div class="selector-item" @click="showPersonPicker(1)">
          <div class="selector-label">人物一</div>
          <div class="selector-person" v-if="person1">
            <el-tag :color="getCategoryColor(person1.category)" effect="dark" size="small">
              {{ getCategoryName(person1.category) }}
            </el-tag>
            <span class="person-name">{{ person1.name }}</span>
            <span class="person-courtesy" v-if="person1.courtesy">字 {{ person1.courtesy }}</span>
          </div>
          <div class="selector-placeholder" v-else>点击选择人物</div>
          <el-icon class="selector-arrow"><ArrowRight /></el-icon>
        </div>

        <div class="vs-divider">
          <span>VS</span>
        </div>

        <div class="selector-item" @click="showPersonPicker(2)">
          <div class="selector-label">人物二</div>
          <div class="selector-person" v-if="person2">
            <el-tag :color="getCategoryColor(person2.category)" effect="dark" size="small">
              {{ getCategoryName(person2.category) }}
            </el-tag>
            <span class="person-name">{{ person2.name }}</span>
            <span class="person-courtesy" v-if="person2.courtesy">字 {{ person2.courtesy }}</span>
          </div>
          <div class="selector-placeholder" v-else>点击选择人物</div>
          <el-icon class="selector-arrow"><ArrowRight /></el-icon>
        </div>
      </div>

      <div class="compare-panels">
        <div class="compare-panel left-panel">
          <div class="panel-header">
            <h3 class="panel-title">
              <span class="panel-dot left-dot"></span>
              {{ person1?.name }} 的人脉关系
            </h3>
            <el-button type="primary" link size="small" @click="showOnlyCommon = !showOnlyCommon">
              {{ showOnlyCommon ? '显示全部' : '只看共同' }}
            </el-button>
          </div>
          <div class="panel-body">
            <div 
              v-for="related in displayRelated1" 
              :key="related.person.id"
              class="related-item"
              :class="{ 'is-common': isCommonPerson(related.person.id) }"
              @click="viewPersonDetail(related.person)"
            >
              <div class="related-info">
                <span class="related-name">{{ related.person.name }}</span>
                <el-tag :color="related.color" size="small" effect="dark">
                  {{ related.label }}
                </el-tag>
              </div>
              <el-tag 
                v-if="isCommonPerson(related.person.id)" 
                type="success" 
                effect="light" 
                size="small"
                class="common-tag"
              >
                <el-icon><CircleCheck /></el-icon>
                共同认识
              </el-tag>
            </div>
          </div>
        </div>

        <div class="compare-panel right-panel">
          <div class="panel-header">
            <h3 class="panel-title">
              <span class="panel-dot right-dot"></span>
              {{ person2?.name }} 的人脉关系
            </h3>
            <el-button type="primary" link size="small" @click="showOnlyCommon = !showOnlyCommon">
              {{ showOnlyCommon ? '显示全部' : '只看共同' }}
            </el-button>
          </div>
          <div class="panel-body">
            <div 
              v-for="related in displayRelated2" 
              :key="related.person.id"
              class="related-item"
              :class="{ 'is-common': isCommonPerson(related.person.id) }"
              @click="viewPersonDetail(related.person)"
            >
              <div class="related-info">
                <span class="related-name">{{ related.person.name }}</span>
                <el-tag :color="related.color" size="small" effect="dark">
                  {{ related.label }}
                </el-tag>
              </div>
              <el-tag 
                v-if="isCommonPerson(related.person.id)" 
                type="success" 
                effect="light" 
                size="small"
                class="common-tag"
              >
                <el-icon><CircleCheck /></el-icon>
                共同认识
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <div class="common-persons-section" v-if="commonPersons.length > 0">
        <div class="section-header">
          <h3 class="section-title">
            <el-icon><Star /></el-icon>
            共同认识的人
          </h3>
          <span class="section-count">共 {{ commonPersons.length }} 人</span>
        </div>
        <div class="common-persons-grid">
          <div 
            v-for="person in commonPersons" 
            :key="person.id"
            class="common-person-card"
            @click="viewPersonDetail(person)"
          >
            <el-tag 
              :color="getCategoryColor(person.category)" 
              effect="dark" 
              size="small"
              class="category-tag"
            >
              {{ getCategoryName(person.category) }}
            </el-tag>
            <h4 class="person-name">{{ person.name }}</h4>
            <div class="person-meta" v-if="person.courtesy">字 {{ person.courtesy }}</div>
            <div class="relation-labels">
              <el-tag 
                v-for="(rel, idx) in getRelationsWithBoth(person.id)" 
                :key="idx"
                :color="rel.color"
                size="small"
              >
                {{ rel.withName }}: {{ rel.label }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="pickerVisible"
      :title="pickerPosition === 1 ? '选择人物一' : '选择人物二'"
      width="600px"
    >
      <div class="person-picker">
        <el-input
          v-model="pickerSearch"
          placeholder="搜索人物"
          prefix-icon="Search"
          clearable
          class="picker-search"
        />
        <div class="picker-list">
          <div 
            v-for="person in filteredPickerPersons" 
            :key="person.id"
            class="picker-item"
            :class="{ selected: isPickerSelected(person.id) }"
            @click="selectPickerPerson(person)"
          >
            <el-tag 
              :color="getCategoryColor(person.category)" 
              effect="dark" 
              size="small"
            >
              {{ getCategoryName(person.category) }}
            </el-tag>
            <span class="picker-name">{{ person.name }}</span>
            <span class="picker-courtesy" v-if="person.courtesy">字 {{ person.courtesy }}</span>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="detailVisible"
      :title="detailPerson?.name"
      width="600px"
    >
      <PersonDetail 
        v-if="detailPerson"
        :person="detailPerson"
        @close="detailVisible = false"
        @select-person="handleSelectFromDetail"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Histogram, User, Connection, ArrowRight, Search, 
  Star, CircleCheck 
} from '@element-plus/icons-vue'
import { useNetworkStore } from '@/stores/network'
import { relationTypes } from '@/data/socialNetwork'
import PersonDetail from '@/components/network/PersonDetail.vue'

const router = useRouter()
const networkStore = useNetworkStore()

const showOnlyCommon = ref(false)
const pickerVisible = ref(false)
const pickerPosition = ref(1)
const pickerSearch = ref('')
const detailVisible = ref(false)
const detailPerson = ref(null)

const categories = [
  { id: 'center', name: '中心人物', color: '#8B4513' },
  { id: 'family', name: '家人', color: '#E74C3C' },
  { id: 'friend', name: '挚友', color: '#3498DB' },
  { id: 'student', name: '学生', color: '#2ECC71' },
  { id: 'colleague', name: '同僚', color: '#F39C12' },
  { id: 'political', name: '政敌', color: '#9B59B6' },
  { id: 'mentor', name: '师长', color: '#1ABC9C' }
]

const person1 = computed(() => networkStore.comparePersons[0] || null)
const person2 = computed(() => networkStore.comparePersons[1] || null)

const getRelationColor = (type) => {
  const relation = relationTypes.find(r => r.id === type)
  return relation ? relation.color : '#999'
}

const getCategoryColor = (category) => {
  const cat = categories.find(c => c.id === category)
  return cat ? cat.color : '#999'
}

const getCategoryName = (category) => {
  const cat = categories.find(c => c.id === category)
  return cat ? cat.name : '其他'
}

const getRelatedWithDetails = (personId) => {
  if (!personId) return []
  const relations = networkStore.getRelationsByPersonId(personId)
  return relations.map(r => {
    const otherId = r.source === personId ? r.target : r.source
    const person = networkStore.getPersonById(otherId)
    return {
      person,
      label: r.label,
      color: getRelationColor(r.type),
      type: r.type
    }
  }).filter(r => r.person)
}

const relatedPersons1 = computed(() => getRelatedWithDetails(person1.value?.id))
const relatedPersons2 = computed(() => getRelatedWithDetails(person2.value?.id))

const commonPersons = computed(() => {
  if (!person1.value || !person2.value) return []
  return networkStore.getCommonPersons(person1.value.id, person2.value.id)
})

const commonPersonIds = computed(() => new Set(commonPersons.value.map(p => p.id)))

const isCommonPerson = (personId) => {
  return commonPersonIds.value.has(personId)
}

const displayRelated1 = computed(() => {
  if (showOnlyCommon.value) {
    return relatedPersons1.value.filter(r => isCommonPerson(r.person.id))
  }
  return relatedPersons1.value
})

const displayRelated2 = computed(() => {
  if (showOnlyCommon.value) {
    return relatedPersons2.value.filter(r => isCommonPerson(r.person.id))
  }
  return relatedPersons2.value
})

const getRelationsWithBoth = (personId) => {
  const result = []
  const rels1 = relatedPersons1.value.find(r => r.person.id === personId)
  const rels2 = relatedPersons2.value.find(r => r.person.id === personId)
  if (rels1) {
    result.push({ withName: person1.value.name, label: rels1.label, color: rels1.color })
  }
  if (rels2) {
    result.push({ withName: person2.value.name, label: rels2.label, color: rels2.color })
  }
  return result
}

const showPersonPicker = (position) => {
  pickerPosition.value = position
  pickerSearch.value = ''
  pickerVisible.value = true
}

const filteredPickerPersons = computed(() => {
  let result = [...networkStore.allPersons]
  if (pickerSearch.value) {
    const keyword = pickerSearch.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(keyword))
  }
  const otherPerson = pickerPosition.value === 1 ? person2.value : person1.value
  if (otherPerson) {
    result = result.filter(p => p.id !== otherPerson.id)
  }
  return result
})

const isPickerSelected = (personId) => {
  const currentPerson = pickerPosition.value === 1 ? person1.value : person2.value
  return currentPerson?.id === personId
}

const selectPickerPerson = (person) => {
  const otherIndex = pickerPosition.value === 1 ? 1 : 0
  const otherPerson = networkStore.comparePersons[otherIndex]
  
  networkStore.clearCompare()
  
  if (pickerPosition.value === 1) {
    networkStore.addToCompare(person)
    if (otherPerson) networkStore.addToCompare(otherPerson)
  } else {
    if (otherPerson) networkStore.addToCompare(otherPerson)
    networkStore.addToCompare(person)
  }
  
  pickerVisible.value = false
}

const viewPersonDetail = (person) => {
  detailPerson.value = person
  detailVisible.value = true
}

const handleSelectFromDetail = (person) => {
  detailPerson.value = person
}
</script>

<style lang="scss" scoped>
.compare-view {
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

.empty-compare {
  background: $bg-light;
  border-radius: $radius-xl;
  padding: $spacing-xl;
  text-align: center;
}

.compare-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.compare-stats {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: $spacing-md;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  background: $bg-light;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-sm;
  border: 1px solid $border-light;

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .left-icon {
    background: linear-gradient(135deg, #3498DB, #2980B9);
  }

  .right-icon {
    background: linear-gradient(135deg, #E74C3C, #C0392B);
  }

  .common-icon {
    background: linear-gradient(135deg, #2ECC71, #27AE60);
  }

  .stat-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    .stat-label {
      font-size: $font-size-sm;
      color: $text-secondary;
    }

    .stat-value {
      font-size: $font-size-xxl;
      font-weight: bold;
      color: $text-primary;
      font-family: $font-family-title;
    }
  }

  &.common-card {
    border-color: rgba(#2ECC71, 0.3);
    background: linear-gradient(135deg, $bg-light, rgba(#2ECC71, 0.05));
  }
}

.persons-selector {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: $spacing-md;
  align-items: center;
}

.selector-item {
  background: $bg-light;
  border-radius: $radius-lg;
  padding: $spacing-md $spacing-lg;
  cursor: pointer;
  transition: all $transition-fast;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  box-shadow: $shadow-sm;

  &:hover {
    border-color: $primary-color;
    box-shadow: $shadow-md;
  }

  .selector-label {
    font-size: $font-size-sm;
    color: $text-muted;
    flex-shrink: 0;
  }

  .selector-person {
    flex: 1;
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    .person-name {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-primary;
    }

    .person-courtesy {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }

  .selector-placeholder {
    flex: 1;
    color: $text-muted;
    font-size: $font-size-sm;
  }

  .selector-arrow {
    color: $text-muted;
    flex-shrink: 0;
  }
}

.vs-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    background: linear-gradient(135deg, $primary-color, $primary-dark);
    color: white;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: $font-size-md;
    font-family: $font-family-title;
    box-shadow: $shadow-md;
  }
}

.compare-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-lg;
}

.compare-panel {
  background: $bg-light;
  border-radius: $radius-xl;
  box-shadow: $shadow-md;
  border: 1px solid $border-light;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &.left-panel {
    border-top: 4px solid #3498DB;
  }

  &.right-panel {
    border-top: 4px solid #E74C3C;
  }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md $spacing-lg;
  border-bottom: 1px solid $border-light;

  .panel-title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-md;
    color: $text-primary;
    margin: 0;
  }

  .panel-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;

    &.left-dot {
      background: #3498DB;
    }

    &.right-dot {
      background: #E74C3C;
    }
  }
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  max-height: 500px;
  padding: $spacing-sm;
}

.related-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  margin-bottom: $spacing-xs;

  &:hover {
    background: $bg-dark;
    transform: translateX(4px);
  }

  &.is-common {
    background: rgba(#2ECC71, 0.08);
    border: 1px solid rgba(#2ECC71, 0.2);

    &:hover {
      background: rgba(#2ECC71, 0.15);
    }
  }

  .related-info {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    flex: 1;
    min-width: 0;

    .related-name {
      font-size: $font-size-sm;
      color: $text-primary;
      font-weight: 500;
    }
  }

  .common-tag {
    flex-shrink: 0;
    
    .el-icon {
      margin-right: 2px;
    }
  }
}

.common-persons-section {
  background: linear-gradient(135deg, $bg-light, rgba(#2ECC71, 0.05));
  border-radius: $radius-xl;
  padding: $spacing-lg;
  border: 1px solid rgba(#2ECC71, 0.2);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;

  .section-title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-lg;
    color: $text-primary;
    margin: 0;
    font-family: $font-family-title;

    .el-icon {
      color: #F39C12;
    }
  }

  .section-count {
    font-size: $font-size-sm;
    color: $text-muted;
    background: rgba(#2ECC71, 0.1);
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-sm;
  }
}

.common-persons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-md;
}

.common-person-card {
  background: white;
  border-radius: $radius-lg;
  padding: $spacing-md;
  cursor: pointer;
  transition: all $transition-fast;
  border: 1px solid $border-light;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
    border-color: rgba(#2ECC71, 0.4);
  }

  .category-tag {
    margin-bottom: $spacing-sm;
  }

  .person-name {
    font-size: $font-size-md;
    color: $text-primary;
    margin-bottom: $spacing-xs;
    font-family: $font-family-title;
  }

  .person-meta {
    font-size: $font-size-xs;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
  }

  .relation-labels {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    .el-tag {
      align-self: flex-start;
    }
  }
}

.person-picker {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  .picker-search {
    width: 100%;
  }

  .picker-list {
    max-height: 400px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  .picker-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      background: $bg-light;
    }

    &.selected {
      background: rgba($primary-color, 0.1);
      border: 1px solid $primary-color;
    }

    .picker-name {
      font-size: $font-size-md;
      color: $text-primary;
      font-weight: 500;
    }

    .picker-courtesy {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
}

@media (max-width: 900px) {
  .compare-stats {
    grid-template-columns: 1fr;
  }

  .compare-panels {
    grid-template-columns: 1fr;
  }

  .persons-selector {
    grid-template-columns: 1fr;
    gap: $spacing-sm;
  }

  .vs-divider {
    justify-self: center;
  }
}
</style>
