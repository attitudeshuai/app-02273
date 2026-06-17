<template>
  <div class="about-view">
    <div class="view-header">
      <h1 class="view-title">
        <el-icon><InfoFilled /></el-icon>
        关于项目
      </h1>
    </div>

    <div class="about-content">
      <!-- 项目介绍 -->
      <section class="about-section">
        <div class="section-card">
          <h2 class="section-title">
            <el-icon><Document /></el-icon>
            项目简介
          </h2>
          <div class="section-body">
            <p>
              本项目是一个基于 Vue 3 构建的苏轼社交网络可视化应用,展示北宋文学家苏轼与其家人、朋友、政敌、学生等人物之间的社交关系网络。
            </p>
            <p>
              苏轼（1037-1101），字子瞻，号东坡居士，是北宋时期著名的文学家、书画家、政治家。
              他与父亲苏洵、弟弟苏辙合称"三苏"，同列"唐宋八大家"。苏轼一生仕途坎坷，
              但在文学、书法、绘画等领域都取得了极高的成就，对后世影响深远。
            </p>
          </div>
        </div>
      </section>

      <!-- 数据来源 -->
      <section class="about-section">
        <div class="section-card">
          <h2 class="section-title">
            <el-icon><Collection /></el-icon>
            数据来源
          </h2>
          <div class="section-body">
            <p>项目中的人物关系数据基于历史文献整理，主要包括：</p>
            <ul class="data-list">
              <li>苏轼的家族成员（父亲苏洵、弟弟苏辙、妻子王弗、王闰之、侍妾王朝云等）</li>
              <li>文学挚友（欧阳修、黄庭坚、秦观、米芾、佛印等）</li>
              <li>政治人物（王安石、司马光、章惇等）</li>
              <li>学生门人（黄庭坚、秦观、晁补之、张耒等"苏门四学士"）</li>
            </ul>
            <el-alert
              title="数据说明"
              type="info"
              :closable="false"
              show-icon
            >
              本项目数据仅供学习参考，部分关系基于历史推断，如有不准确之处，欢迎指正。
            </el-alert>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.about-view {
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

.about-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.about-section {
  .section-card {
    background: $bg-light;
    border-radius: $radius-lg;
    padding: $spacing-lg;
    box-shadow: $shadow-md;
    border: 1px solid $border-light;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-family: $font-family-title;
    font-size: $font-size-xl;
    color: $primary-color;
    margin-bottom: $spacing-lg;
    padding-bottom: $spacing-md;
    border-bottom: 2px solid $border-light;

    .el-icon {
      font-size: 24px;
    }
  }

  .section-body {
    p {
      color: $text-secondary;
      line-height: 1.8;
      margin-bottom: $spacing-md;
      text-indent: 2em;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-md;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $bg-color;
  border-radius: $radius-md;
  transition: all $transition-fast;

  &:hover {
    background: $bg-dark;
    transform: translateX(4px);
  }

  .tech-logo {
    width: 48px;
    height: 48px;
    border-radius: $radius-md;
    object-fit: cover;
  }

  .tech-info {
    h4 {
      font-size: $font-size-md;
      color: $text-primary;
      margin-bottom: $spacing-xs;
    }

    p {
      font-size: $font-size-sm;
      color: $text-muted;
      margin: 0;
      text-indent: 0;
    }
  }
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
}

.feature-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $bg-color;
  border-radius: $radius-md;

  .feature-icon {
    font-size: 24px;
    color: $primary-color;
    flex-shrink: 0;
  }

  .feature-content {
    h4 {
      font-size: $font-size-md;
      color: $text-primary;
      margin-bottom: $spacing-xs;
    }

    p {
      font-size: $font-size-sm;
      color: $text-muted;
      margin: 0;
      text-indent: 0;
      line-height: 1.6;
    }
  }
}

.data-list {
  padding-left: $spacing-lg;
  margin-bottom: $spacing-md;

  li {
    color: $text-secondary;
    line-height: 2;
    font-size: $font-size-sm;
  }
}

.contact-card {
  background: linear-gradient(135deg, $primary-dark, $primary-color) !important;
  color: white;

  .section-title {
    color: white;
    border-bottom-color: rgba(255, 255, 255, 0.2);
  }
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-lg;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.9);

  .el-icon {
    font-size: 18px;
  }
}

@media (max-width: 1024px) {
  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .feature-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .tech-grid {
    grid-template-columns: 1fr;
  }

  .contact-info {
    flex-direction: column;
    gap: $spacing-md;
  }
}
</style>
