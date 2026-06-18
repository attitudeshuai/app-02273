<template>
  <div class="person-compare" v-if="person1 && person2">
    <div class="compare-stats">
      <div class="stat-item">
        <div class="stat-value">{{ person1Related.length }}</div>
        <div class="stat-label">{{ person1.name }} 的人脉</div>
      </div>
      <div class="stat-item common">
        <div class="stat-value">{{ commonPersonsList.length }}</div>
        <div class="stat-label">共同认识</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ person2Related.length }}</div>
        <div class="stat-label">{{ person2.name }} 的人脉</div>
      </div>
    </div>

    <div class="compare-columns">
      <div class="compare-column">
        <div class="column-header">
          <div class="person-brief">
          <h3 class="person-name">{{ person1.name }}</h3>
          <div class="person-meta">
            <span v-if="person1.courtesy">字 {{ person1.courtesy }}</span>
            <span v-if="person1.title">号 {{ person1.title }}</span>
          </div>
          <div class="person-life" v-if="person1.birth">
            {{ person1.birth }} - {{ person1.death || '?' }}
          </div>
        </div>
        <el-tag :color="getCategoryColor(person1.category)" effect="dark" size="small">
          {{ getCategoryName(person1.category) }}
        </el-tag>
      </div>

      <div class="related-list">
        <h4 class="list-title">
          <el-icon><Connection /></el-icon>
          人脉关系 ({{ person1Related.length }})
        </h4>
        <div
          v-for="related in person1Related"
          :key="related.person.id"
          class="related-item"
          :class="{ 'is-common': isCommon(related.person.id) }"
          @click="$emit('selectPerson', related.person)"
        >
          <div class="related-info">
            <span class="related-name">{{ related.person.name }}</span>
            <el-tag :color="related.color" size="small" effect="dark">
              {{ related.label }}
            </el-tag>
          </div>
          <el-icon v-if="isCommon(related.person.id)" class="common-icon">
            <Star />
          </el-icon>
        </div>
      </div>
    </div>

      <div class="compare-divider">
      <div class="divider-line"></div>
      <div class="divider-label">
        <el-icon><CopyDocument /></el-icon>
        <span>对比</span>
      </div>
      <div class="divider-line"></div>
    </div>

    <div class="compare-column">
      <div class="column-header">
        <div class="person-brief">
          <h3 class="person-name">{{ person2.name }}</h3>
          <div class="person-meta">
            <span v-if="person2.courtesy">字 {{ person2.courtesy }}</span>
            <span v-if="person2.title">号 {{ person2.title }}</span>
          </div>
          <div class="person-life" v-if="person2.birth">
            {{ person2.birth }} - {{ person2.death || '?' }}
          </div>
        </div>
        <el-tag :color="getCategoryColor(person2.category)" effect="dark" size="small">
          {{ getCategoryName(person2.category) }}
        </el-tag>
      </div>

      <div class="related-list">
        <h4 class="list-title">
          <el-icon><Connection /></el-icon>
          人脉关系 ({{ person2Related.length }})
        </h4>
        <div
          v-for="related in person2Related"
          :key="related.person.id"
          class="related-item"
          :class="{ 'is-common': isCommon(related.person.id) }"
          @click="$emit('selectPerson', related.person)"
        >
          <div class="related-info">
            <span class="related-name">{{ related.person.name }}</span>
            <el-tag :color="related.color" size="small" effect="dark">
              {{ related.label }}
            </el-tag>
          </div>
          <el-icon v-if="isCommon(related.person.id)" class="common-icon">
            <Star />
          </el-icon>
        </div>
      </div>
    </div>
  </div>

    <div class="common-section" v-if="commonPersonsList.length > 0">
      <h4 class="common-title">
        <el-icon><Star /></el-icon>
        共同认识的人 ({{ commonPersonsList.length }})
      </h4>
      <div class="common-list">
        <div
          v-for="person in commonPersonsList"
          :key="person.id"
          class="common-item"
          @click="$emit('selectPerson', person)"
        >
          <span class="common-name">{{ person.name }}</span>
          <div class="common-relations">
            <el-tag :color="getRelationColor(person1Relation(person.id)?.type)" size="small" effect="plain">
              {{ person1Relation(person.id)?.label || '' }}
            </el-tag>
            <el-icon class="arrow-icon"><Right /></el-icon>
            <el-tag :color="getRelationColor(person2Relation(person.id)?.type)" size="small" effect="plain">
              {{ person2Relation(person.id)?.label || '' }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Connection, Star, CopyDocument, Right } from '@element-plus/icons-vue'
import { useNetworkStore } from '@/stores/network'
import { relationTypes } from '@/data/socialNetwork'

const props = defineProps({
  person1: {
    type: Object,
    default: null
  },
  person2: {
    type: Object,
    default: null
  }
})

defineEmits(['selectPerson'])

const networkStore = useNetworkStore()

const categories = [
  { id: 'center', name: '中心人物', color: '#8B4513' },
  { id: 'family', name: '家人', color: '#E74C3C' },
  { id: 'friend', name: '挚友', color: '#3498DB' },
  { id: 'student', name: '学生', color: '#2ECC71' },
  { id: 'colleague', name: '同僚', color: '#F39C12' },
  { id: 'political', name: '政敌', color: '#9B59B6' },
  { id: 'mentor', name: '师长', color: '#1ABC9C' }
]

const getCategoryColor = (category) => {
  const cat = categories.find(c => c.id === category)
  return cat ? cat.color : '#999'
}

const getCategoryName = (category) => {
  const cat = categories.find(c => c.id === category)
  return cat ? cat.name : '其他'
}

const getRelationColor = (type) => {
  if (!type) return '#999'
  const relation = relationTypes.find(r => r.id === type)
  return relation ? relation.color : '#999'
}

const getRelatedWithLabel = (person) => {
  if (!person) return []
  const relations = networkStore.getRelationsForPerson(person.id)
  return relations.map(r => {
    const otherId = r.source === person.id ? r.target : r.source
    const relatedPerson = networkStore.getPersonById(otherId)
    return {
      person: relatedPerson,
      label: r.label,
      color: getRelationColor(r.type),
      type: r.type
    }
  }).filter(r => r.person)
}

const person1Related = computed(() => getRelatedWithLabel(props.person1))
const person2Related = computed(() => getRelatedWithLabel(props.person2))

const commonPersonsList = computed(() => {
  if (!props.person1 || !props.person2) return []
  const related1Ids = new Set(person1Related.value.map(r => r.person.id))
  const related2Ids = new Set(person2Related.value.map(r => r.person.id))
  const commonIds = [...related1Ids].filter(id => related2Ids.has(id))
  return networkStore.allPersons.filter(p => commonIds.includes(p.id))
})

const isCommon = (personId) => {
  return commonPersonsList.value.some(p => p.id === personId)
}

const person1Relation = (personId) => {
  return person1Related.value.find(r => r.person.id === personId)
}

const person2Relation = (personId) => {
  return person2Related.value.find(r => r.person.id === personId)
}
</script>

<style lang="scss" scoped>
.person-compare {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.compare-stats {
  display: flex;
  justify-content: center;
  gap: $spacing-xl;
  padding: $spacing-md;
  background: $bg-color;
  border-radius: $radius-lg;

  .stat-item {
    text-align: center;

    .stat-value {
      font-family: $font-family-title;
      font-size: $font-size-xxl;
      color: $text-primary;
      font-weight: bold;
    }

    .stat-label {
      font-size: $font-size-sm;
      color: $text-muted;
      margin-top: $spacing-xs;
    }

    &.common {
      .stat-value {
        color: #F39C12;
      }
    }
  }
}

.compare-columns {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: $spacing-md;
}

.compare-column {
  background: $bg-color;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  border: 1px solid $border-light;
}

.column-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $border-light;

  .person-brief {
    flex: 1;

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
    }
  }
}

.compare-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-sm 0;

  .divider-line {
    flex: 1;
    width: 2px;
    background: $border-light;
  }

  .divider-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-xs;
    color: $text-muted;
    font-size: $font-size-sm;

    .el-icon {
      font-size: 20px;
      color: $primary-color;
    }
  }
}

.related-list {
  .list-title {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-sm;
    color: $primary-color;
    margin-bottom: $spacing-sm;
    font-weight: 600;
  }
}

.related-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  background: $bg-light;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  margin-bottom: $spacing-xs;
  border: 2px solid transparent;

  &:hover {
    background: $bg-dark;
    transform: translateX(4px);
  }

  &.is-common {
    background: linear-gradient(135deg, rgba(243, 156, 18, 0.1), rgba(243, 156, 18, 0.05));
    border-color: rgba(243, 156, 18, 0.3);

    &:hover {
      background: linear-gradient(135deg, rgba(243, 156, 18, 0.15), rgba(243, 156, 18, 0.1));
    }
  }

  .related-info {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  .related-name {
    font-size: $font-size-sm;
    color: $text-primary;
  }

  .common-icon {
    color: #F39C12;
    font-size: 16px;
  }
}

.common-section {
  background: linear-gradient(135deg, rgba(243, 156, 18, 0.08), rgba(243, 156, 18, 0.03));
  border-radius: $radius-lg;
  padding: $spacing-lg;
  border: 1px solid rgba(243, 156, 18, 0.2);

  .common-title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-md;
    color: #F39C12;
    margin-bottom: $spacing-md;
    font-weight: 600;

    .el-icon {
      font-size: 20px;
    }
  }

  .common-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  .common-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-sm $spacing-md;
    background: rgba(255, 255, 255, 0.6);
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
      transform: translateX(4px);
    }

    .common-name {
      font-size: $font-size-md;
      color: $text-primary;
      font-weight: 500;
    }

    .common-relations {
      display: flex;
      align-items: center;
      gap: $spacing-xs;

      .arrow-icon {
        color: $text-muted;
        font-size: 12px;
      }
    }
  }
}

@media (max-width: 768px) {
  .compare-columns {
    grid-template-columns: 1fr;
  }

  .compare-divider {
    flex-direction: row;

    .divider-line {
      width: auto;
      height: 2px;
    }
  }

  .compare-stats {
    flex-direction: column;
    gap: $spacing-md;
  }
}
</style>
