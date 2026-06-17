<template>
  <div class="person-detail" v-if="person">
    <div class="detail-header">
      <div class="header-info">
        <div class="meta">
          <span v-if="person.courtesy" class="courtesy">字 {{ person.courtesy }}</span>
          <span v-if="person.title" class="title">号 {{ person.title }}</span>
        </div>
        <div class="life-span" v-if="person.birth">
          {{ person.birth }} - {{ person.death || '?' }}
        </div>
      </div>
    </div>

    <el-divider />

    <div class="detail-body">
      <div class="section" v-if="person.description">
        <h3 class="section-title">
          <el-icon><Document /></el-icon>
          人物简介
        </h3>
        <p class="description">{{ person.description }}</p>
      </div>

      <div class="section" v-if="person.achievements?.length">
        <h3 class="section-title">
          <el-icon><Trophy /></el-icon>
          主要成就
        </h3>
        <div class="achievements">
          <el-tag 
            v-for="(achievement, index) in person.achievements" 
            :key="index"
            type="warning"
            effect="plain"
          >
            {{ achievement }}
          </el-tag>
        </div>
      </div>

      <div class="section" v-if="person.poems?.length">
        <h3 class="section-title">
          <el-icon><Reading /></el-icon>
          代表作品
        </h3>
        <div class="poems">
          <div v-for="(poem, index) in person.poems" :key="index" class="poem-item">
            《{{ poem }}》
          </div>
        </div>
      </div>

      <div class="section" v-if="relatedPersons.length">
        <h3 class="section-title">
          <el-icon><Connection /></el-icon>
          相关人物
        </h3>
        <div class="related-persons">
          <div 
            v-for="related in relatedPersons" 
            :key="related.person.id"
            class="related-item"
            @click="$emit('selectPerson', related.person)"
          >
            <div class="related-info">
              <span class="related-name">{{ related.person.name }}</span>
              <el-tag :color="related.color" size="small" effect="dark">
                {{ related.label }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Document, Trophy, Reading, Connection } from '@element-plus/icons-vue'
import { useNetworkStore } from '@/stores/network'
import { relationTypes } from '@/data/socialNetwork'

const props = defineProps({
  person: {
    type: Object,
    default: null
  }
})

defineEmits(['close', 'selectPerson'])

const networkStore = useNetworkStore()

const getRelationColor = (type) => {
  const relation = relationTypes.find(r => r.id === type)
  return relation ? relation.color : '#999'
}

const relatedPersons = computed(() => {
  if (!props.person) return []
  
  const relations = networkStore.allRelations.filter(r => 
    r.source === props.person.id || r.target === props.person.id
  )

  return relations.map(r => {
    const otherId = r.source === props.person.id ? r.target : r.source
    const person = networkStore.getPersonById(otherId)
    return {
      person,
      label: r.label,
      color: getRelationColor(r.type)
    }
  }).filter(r => r.person)
})
</script>

<style lang="scss" scoped>
.person-detail {
  background: $bg-light;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-md;
  border: 1px solid $border-light;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;

  .header-info {
    flex: 1;

    .meta {
      display: flex;
      gap: $spacing-md;
      color: $text-secondary;
      font-size: $font-size-sm;
      margin-bottom: $spacing-xs;
    }

    .life-span {
      font-size: $font-size-sm;
      color: $text-muted;
    }
  }
}

.detail-body {
  .section {
    margin-bottom: $spacing-lg;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-md;
    color: $primary-color;
    margin-bottom: $spacing-md;
    font-weight: 600;

    .el-icon {
      font-size: 18px;
    }
  }

  .description {
    color: $text-secondary;
    line-height: 1.8;
    text-indent: 2em;
  }

  .achievements {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }

  .poems {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;

    .poem-item {
      padding: $spacing-xs $spacing-sm;
      background: $bg-dark;
      border-radius: $radius-sm;
      color: $text-secondary;
      font-size: $font-size-sm;
    }
  }

  .related-persons {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  .related-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm;
    background: $bg-color;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      background: $bg-dark;
      transform: translateX(4px);
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
  }
}
</style>
