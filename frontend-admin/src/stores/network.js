import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { persons, relations, relationTypes } from '@/data/socialNetwork'

export const useNetworkStore = defineStore('network', () => {
  // 状态
  const selectedPerson = ref(null)
  const activeFilters = ref([])
  const searchKeyword = ref('')
  const isLoading = ref(false)

  // 获取所有人物
  const allPersons = computed(() => persons)

  // 获取所有关系
  const allRelations = computed(() => relations)

  // 获取关系类型
  const allRelationTypes = computed(() => relationTypes)

  // 根据筛选条件过滤关系
  const filteredRelations = computed(() => {
    if (activeFilters.value.length === 0) {
      return relations
    }
    return relations.filter(r => activeFilters.value.includes(r.type))
  })

  // 根据搜索关键词过滤人物
  const filteredPersons = computed(() => {
    if (!searchKeyword.value) {
      return persons
    }
    const keyword = searchKeyword.value.toLowerCase()
    return persons.filter(p => 
      p.name.toLowerCase().includes(keyword) ||
      p.courtesy?.toLowerCase().includes(keyword) ||
      p.description?.toLowerCase().includes(keyword)
    )
  })

  // 获取与选中人物相关的关系
  const relatedRelations = computed(() => {
    if (!selectedPerson.value) return []
    return relations.filter(r => 
      r.source === selectedPerson.value.id || 
      r.target === selectedPerson.value.id
    )
  })

  // 获取与选中人物相关的人物
  const relatedPersons = computed(() => {
    if (!selectedPerson.value) return []
    const relatedIds = new Set()
    relatedRelations.value.forEach(r => {
      if (r.source === selectedPerson.value.id) {
        relatedIds.add(r.target)
      } else {
        relatedIds.add(r.source)
      }
    })
    return persons.filter(p => relatedIds.has(p.id))
  })

  // 操作
  function selectPerson(person) {
    selectedPerson.value = person
  }

  function clearSelection() {
    selectedPerson.value = null
  }

  function setFilters(filters) {
    activeFilters.value = filters
  }

  function toggleFilter(type) {
    const index = activeFilters.value.indexOf(type)
    if (index > -1) {
      activeFilters.value.splice(index, 1)
    } else {
      activeFilters.value.push(type)
    }
  }

  function setSearchKeyword(keyword) {
    searchKeyword.value = keyword
  }

  function getPersonById(id) {
    return persons.find(p => p.id === id)
  }

  return {
    // 状态
    selectedPerson,
    activeFilters,
    searchKeyword,
    isLoading,
    // 计算属性
    allPersons,
    allRelations,
    allRelationTypes,
    filteredRelations,
    filteredPersons,
    relatedRelations,
    relatedPersons,
    // 操作
    selectPerson,
    clearSelection,
    setFilters,
    toggleFilter,
    setSearchKeyword,
    getPersonById
  }
})
