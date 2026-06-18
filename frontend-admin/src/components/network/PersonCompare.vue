<template>
  <div class="person-compare" v-if="person1 && person2">
    <div class="compare-header">
      <h3 class="compare-title">
        <el-icon><ScaleToOriginal /></el-icon>
        人脉对比
      </h3>
      <div class="common-summary">
        <el-tag type="success" effect="dark" size="large">
          共同好友：{{ commonFriends.length }} 人
        </el-tag>
      </div>
    </div>

    <div class="compare-content">
      <div class="person-column">
        <div class="person-header" :style="{ borderColor: getCategoryColor(person1.category) }">
          <h4 class="person-name">{{ person1.name }}</h4>
          <div class="person-meta">
            <span v-if="person1.courtesy">字 {{ person1.courtesy }}</span>
            <span v-if="person1.title">号 {{ person1.title }}</span>
          </div>
          <el-tag 
            :color="getCategoryColor(person1.category)" 
            effect="dark" 
            size="small"
          >
            {{ getCategoryName(person1.category) }}
          </el-tag>
        </div>
        <div class="relations-list">
          <div class="list-title">
            <el-icon><Connection /></el-icon>
            人脉关系 ({{ person1Relations.length }})
          </div>
          <div 
            v-for="item in person1Relations" 
            :key="item.person.id"
            class="relation-item"
            :class="{ 'is-common': isCommonFriend(item.person.id) }"
            @click="$emit('selectPerson', item.person)"
          >
            <div class="relation-info">
              <span class="relation-name">{{ item.person.name }}</span>
              <el-tag :color="item.color" size="small" effect="dark">
                {{ item.label }}
              </el-tag>
            </div>
            <el-icon v-if="isCommonFriend(item.person.id)" class="common-icon" :size="16">
              <Star />
            </el-icon>
          </div>
        </div>
      </div>

      <div class="compare-divider">
        <div class="divider-line"></div>
        <div class="divider-icon">
          <el-icon><Switch /></el-icon>
        </div>
        <div class="divider-line"></div>
      </div>

      <div class="person-column">
        <div class="person-header" :style="{ borderColor: getCategoryColor(person2.category) }">
          <h4 class="person-name">{{ person2.name }}</h4>
          <div class="person-meta">
            <span v-if="person2.courtesy">字 {{ person2.courtesy }}</span>
            <span v-if="person2.title">号 {{ person2.title }}</span>
          </div>
          <el-tag 
            :color="getCategoryColor(person2.category)" 
            effect="dark" 
            size="small"
          >
            {{ getCategoryName(person2.category) }}
          </el-tag>
        </div>
        <div class="relations-list">
          <div class="list-title">
            <el-icon><Connection /></el-icon>
            人脉关系 ({{ person2Relations.length }})
          </div>
          <div 
            v-for="item in person2Relations" 
            :key="item.person.id"
            class="relation-item"
            :class="{ 'is-common': isCommonFriend(item.person.id) }"
            @click="$emit('selectPerson', item.person)"
          >
            <div class="relation-info">
              <span class="relation-name">{{ item.person.name }}</span>
              <el-tag :color="item.color" size="small" effect="dark">
                {{ item.label }}
              </el-tag>
            </div>
            <el-icon v-if="isCommonFriend(item.person.id)" class="common-icon" :size="16">
              <Star />
            </el-icon>
          </div>
        </div>
      </div>
    </div>

    <div class="common-friends-section" v-if="commonFriends.length > 0">
      <el-divider>
        <span class="common-section-title">
          <el-icon><Star /></el-icon>
          共同好友
        </span>
      </el-divider>
      <div class="common-friends-list">
        <div 
          v-for="item in commonFriends" 
          :key="item.person.id"
          class="common-friend-card"
          @click="$emit('selectPerson', item.person)"
        >
          <div class="common-friend-name">{{ item.person.name }}</div>
          <div class="common-friend-relations">
            <el-tag size="small" :color="item.color">
              与{{ person1.name }}：{{ item.label }}
            </el-tag>
            <el-tag size="small" :color="getPerson2RelationLabel(item.person.id).color">
              与{{ person2.name }}：{{ getPerson2RelationLabel(item.person.id).label }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="compare-empty" v-else>
    <el-empty description="请选择两位人物进行对比">
      <template #image>
        <el-icon :size="64" color="#dcdfe6"><User /></el-icon>
      </template>
    </el-empty>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ScaleToOriginal, Connection, Star, Switch, User } from '@element-plus/icons-vue'
import { useNetworkStore } from '@/stores/network'

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

const person1Relations = computed(() => {
  if (!props.person1) return []
  return networkStore.getRelatedPersonsByPerson(props.person1)
})

const person2Relations = computed(() => {
  if (!props.person2) return []
  return networkStore.getRelatedPersonsByPerson(props.person2)
})

const commonFriends = computed(() => {
  if (!props.person1 || !props.person2) return []
  const p1Ids = new Set(person1Relations.value.map(r => r.person.id))
  return person2Relations.value.filter(r => p1Ids.has(r.person.id))
})

const isCommonFriend = (personId) => {
  return commonFriends.value.some(f => f.person.id === personId)
}

const getPerson2RelationLabel = (personId) => {
  const relation = person2Relations.value.find(r => r.person.id === personId)
  return relation ? { label: relation.label, color: relation.color } : { label: '', color: '#999' }
}
</script>

<style lang="scss" scoped>
.person-compare {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.compare-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .compare-title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-family: $font-family-title;
    font-size: $font-size-xl;
    color: $text-primary;
    margin: 0;

    .el-icon {
      color: $primary-color;
    }
  }
}

.compare-content {
  display: flex;
  align-items: stretch;
  gap: $spacing-md;
}

.person-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  min-width: 0;
}

.person-header {
  background: $bg-light;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  border-left: 4px solid;
  box-shadow: $shadow-sm;

  .person-name {
    font-family: $font-family-title;
    font-size: $font-size-lg;
    color: $text-primary;
    margin: 0 0 $spacing-xs 0;
  }

  .person-meta {
    display: flex;
    gap: $spacing-md;
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
  }
}

.relations-list {
  flex: 1;
  background: $bg-light;
  border-radius: $radius-lg;
  padding: $spacing-md;
  box-shadow: $shadow-sm;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  max-height: 500px;
  overflow-y: auto;

  .list-title {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-sm;
    color: $text-muted;
    font-weight: 600;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $border-light;

    .el-icon {
      color: $primary-color;
    }
  }
}

.relation-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  background: $bg-color;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  border: 2px solid transparent;

  &:hover {
    background: $bg-dark;
    transform: translateX(4px);
  }

  &.is-common {
    background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(26, 188, 156, 0.1));
    border-color: $success-color;

    &:hover {
      background: linear-gradient(135deg, rgba(46, 204, 113, 0.15), rgba(26, 188, 156, 0.15));
    }
  }

  .relation-info {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    min-width: 0;
  }

  .relation-name {
    font-size: $font-size-sm;
    color: $text-primary;
    font-weight: 500;
  }

  .common-icon {
    color: $success-color;
    flex-shrink: 0;
  }
}

.compare-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-md 0;

  .divider-line {
    flex: 1;
    width: 2px;
    background: $border-light;
  }

  .divider-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: $primary-color;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: $spacing-sm 0;

    .el-icon {
      font-size: 20px;
    }
  }
}

.common-friends-section {
  .common-section-title {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    color: $success-color;
    font-weight: 600;

    .el-icon {
      font-size: 16px;
    }
  }
}

.common-friends-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-md;
}

.common-friend-card {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.08), rgba(26, 188, 156, 0.08));
  border: 1px solid rgba(46, 204, 113, 0.3);
  border-radius: $radius-lg;
  padding: $spacing-md;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
    border-color: $success-color;
  }

  .common-friend-name {
    font-family: $font-family-title;
    font-size: $font-size-md;
    color: $text-primary;
    font-weight: 600;
    margin-bottom: $spacing-sm;
  }

  .common-friend-relations {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }
}

.compare-empty {
  padding: $spacing-xl;
}

@media (max-width: 768px) {
  .compare-content {
    flex-direction: column;
  }

  .compare-divider {
    flex-direction: row;
    padding: 0 $spacing-md;

    .divider-line {
      width: auto;
      height: 2px;
      flex: 1;
    }

    .divider-icon {
      margin: 0 $spacing-sm;
    }
  }
}
</style>
