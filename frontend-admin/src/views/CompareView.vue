<template>
  <div class="compare-view">
    <div class="view-header">
      <h1 class="view-title">
        <el-icon><Connection /></el-icon>
        人脉对比
      </h1>
      <p class="view-subtitle">
        选择两位人物，并排查看他们各自的人脉关系，共同认识的人将被高亮显示
      </p>
    </div>

    <!-- 选择器 -->
    <div class="selector-bar">
      <el-select
        v-model="person1Id"
        placeholder="选择第一位人物"
        filterable
        clearable
        class="person-select"
      >
        <el-option
          v-for="p in networkStore.allPersons"
          :key="p.id"
          :label="formatLabel(p)"
          :value="p.id"
          :disabled="p.id === person2Id"
        />
      </el-select>

      <div class="vs-actions">
        <span class="vs-badge">VS</span>
        <el-button
          circle
          :disabled="!person1Id || !person2Id"
          class="swap-btn"
          @click="swapPersons"
        >
          <el-icon><Sort /></el-icon>
        </el-button>
      </div>

      <el-select
        v-model="person2Id"
        placeholder="选择第二位人物"
        filterable
        clearable
        class="person-select"
      >
        <el-option
          v-for="p in networkStore.allPersons"
          :key="p.id"
          :label="formatLabel(p)"
          :value="p.id"
          :disabled="p.id === person1Id"
        />
      </el-select>
    </div>

    <!-- 对比结果 -->
    <template v-if="networkStore.compareData">
      <!-- 共同认识的人 -->
      <div class="common-section">
        <h3 class="section-title">
          <el-icon><StarFilled /></el-icon>
          共同认识的人（{{ networkStore.compareData.commonCount }} 位）
        </h3>
        <div class="common-list">
          <template v-if="networkStore.compareData.commonCount > 0">
            <el-tag
              v-for="p in networkStore.compareData.commonPersons"
              :key="p.id"
              class="common-tag"
              effect="dark"
              type="warning"
            >
              {{ p.name }}
            </el-tag>
          </template>
          <span v-else class="empty-tip">两位人物没有共同认识的人</span>
        </div>
      </div>

      <!-- 图例 -->
      <div class="legend">
        <span class="legend-item">
          <span class="legend-dot common"></span>
          共同认识
        </span>
        <span class="legend-item">
          <span class="legend-dot"></span>
          各自人脉
        </span>
      </div>

      <!-- 并排对比 -->
      <div class="compare-columns">
        <div
          v-for="col in columns"
          :key="col.person.id"
          class="compare-column"
        >
          <div class="column-header">
            <div class="header-left">
              <h3 class="column-name">{{ col.person.name }}</h3>
              <div class="column-meta">
                <span v-if="col.person.courtesy">字 {{ col.person.courtesy }}</span>
                <span v-if="col.person.birth">{{ col.person.birth }} - {{ col.person.death || '?' }}</span>
              </div>
            </div>
            <span class="column-count">{{ col.related.length }} 条人脉</span>
          </div>

          <div class="column-body">
            <div
              v-for="r in col.related"
              :key="r.person.id"
              class="relation-item"
              :class="{ common: r.isCommon }"
            >
              <div class="relation-info">
                <span class="relation-name">{{ r.person.name }}</span>
                <el-tag :color="r.color" size="small" effect="dark">
                  {{ r.label }}
                </el-tag>
              </div>
              <el-tooltip content="共同认识" placement="top" :show-after="300">
                <el-icon v-if="r.isCommon" class="common-mark"><StarFilled /></el-icon>
              </el-tooltip>
            </div>
            <el-empty
              v-if="col.related.length === 0"
              :image-size="60"
              description="暂无人脉关系"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- 空状态 -->
    <el-empty
      v-else
      description="请选择两位人物进行人脉对比"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Connection, Sort, StarFilled } from '@element-plus/icons-vue'
import { useNetworkStore } from '@/stores/network'

const networkStore = useNetworkStore()

const person1Id = ref('')
const person2Id = ref('')

const formatLabel = (p) => {
  return p.courtesy ? `${p.name}（字${p.courtesy}）` : p.name
}

watch([person1Id, person2Id], ([id1, id2]) => {
  if (id1 && id2 && id1 === id2) {
    person2Id.value = ''
    return
  }
  networkStore.setComparePersons([id1, id2])
}, { immediate: true })

const columns = computed(() => {
  const data = networkStore.compareData
  if (!data) return []
  return [
    { person: data.person1, related: data.related1 },
    { person: data.person2, related: data.related2 }
  ]
})

const swapPersons = () => {
  const tmp = person1Id.value
  person1Id.value = person2Id.value
  person2Id.value = tmp
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

.selector-bar {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $bg-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  flex-wrap: wrap;

  .person-select {
    flex: 1;
    min-width: 200px;
  }

  .vs-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-xs;

    .vs-badge {
      font-family: $font-family-title;
      font-size: $font-size-md;
      color: $primary-color;
      font-weight: bold;
      letter-spacing: 1px;
    }

    .swap-btn {
      color: $primary-color;
      border-color: $border-color;
    }
  }
}

.common-section {
  background: linear-gradient(135deg, rgba($accent-color, 0.12), rgba($secondary-color, 0.08));
  border: 1px solid rgba($accent-color, 0.4);
  border-radius: $radius-lg;
  padding: $spacing-md $spacing-lg;

  .section-title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-md;
    color: $primary-dark;
    margin-bottom: $spacing-md;
    font-weight: 600;

    .el-icon {
      color: $accent-color;
    }
  }

  .common-list {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;

    .common-tag {
      border: none;
      font-size: $font-size-sm;
    }

    .empty-tip {
      color: $text-muted;
      font-size: $font-size-sm;
    }
  }
}

.legend {
  display: flex;
  gap: $spacing-lg;
  padding: 0 $spacing-xs;
  font-size: $font-size-xs;
  color: $text-muted;

  .legend-item {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }

  .legend-dot {
    width: 12px;
    height: 12px;
    border-radius: $radius-sm;
    background: $bg-dark;
    border: 1px solid $border-color;

    &.common {
      background: rgba($accent-color, 0.35);
      border-color: $accent-color;
    }
  }
}

.compare-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-lg;
}

.compare-column {
  background: $bg-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  border: 1px solid $border-light;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .column-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: $spacing-md $spacing-lg;
    background: linear-gradient(135deg, rgba($primary-color, 0.08), rgba($secondary-color, 0.05));
    border-bottom: 2px solid $border-light;

    .header-left {
      flex: 1;
    }

    .column-name {
      font-family: $font-family-title;
      font-size: $font-size-xl;
      color: $primary-color;
      margin-bottom: $spacing-xs;
    }

    .column-meta {
      display: flex;
      gap: $spacing-md;
      font-size: $font-size-xs;
      color: $text-muted;
    }

    .column-count {
      font-size: $font-size-xs;
      color: $text-secondary;
      background: $bg-dark;
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-sm;
      white-space: nowrap;
    }
  }

  .column-body {
    padding: $spacing-sm $spacing-md $spacing-md;
    max-height: 560px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  .relation-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    background: $bg-color;
    border-radius: $radius-md;
    border-left: 3px solid transparent;
    transition: all $transition-fast;

    &:hover {
      background: $bg-dark;
      transform: translateX(4px);
    }

    &.common {
      background: rgba($accent-color, 0.18);
      border-left-color: $accent-color;

      .relation-name {
        color: $primary-dark;
        font-weight: 600;
      }

      .common-mark {
        color: $accent-color;
        font-size: 16px;
      }
    }

    .relation-info {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      flex: 1;
      min-width: 0;
    }

    .relation-name {
      font-size: $font-size-sm;
      color: $text-primary;
    }
  }
}

@media (max-width: 768px) {
  .selector-bar {
    flex-direction: column;

    .person-select {
      width: 100%;
    }

    .vs-actions {
      flex-direction: row;
    }
  }

  .compare-columns {
    grid-template-columns: 1fr;
  }
}
</style>
