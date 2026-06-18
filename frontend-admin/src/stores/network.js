import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { persons, relations, relationTypes } from '@/data/socialNetwork'

export const useNetworkStore = defineStore('network', () => {
  // 状态
  const selectedPerson = ref(null)
  const activeFilters = ref([])
  const searchKeyword = ref('')
  const isLoading = ref(false)
  const comparePersonIds = ref([])

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

  // 获取关系类型颜色
  function getRelationColor(type) {
    const relation = relationTypes.find(r => r.id === type)
    return relation ? relation.color : '#999'
  }

  // 获取某人物的所有相关人物（带关系信息）
  function getRelatedPersonsOf(personId) {
    const rels = relations.filter(r =>
      r.source === personId || r.target === personId
    )
    return rels.map(r => {
      const otherId = r.source === personId ? r.target : r.source
      const person = persons.find(p => p.id === otherId)
      return {
        person,
        label: r.label,
        type: r.type,
        color: getRelationColor(r.type)
      }
    }).filter(r => r.person)
  }

  // 人脉对比数据：并排展示两人人脉，并标出共同认识的人
  const compareData = computed(() => {
    if (comparePersonIds.value.length !== 2) return null
    const [id1, id2] = comparePersonIds.value
    const person1 = persons.find(p => p.id === id1)
    const person2 = persons.find(p => p.id === id2)
    if (!person1 || !person2) return null

    const related1 = getRelatedPersonsOf(id1)
    const related2 = getRelatedPersonsOf(id2)
    const ids1 = new Set(related1.map(r => r.person.id))
    const ids2 = new Set(related2.map(r => r.person.id))
    const commonIds = [...ids1].filter(id => ids2.has(id))

    return {
      person1,
      person2,
      related1: related1.map(r => ({ ...r, isCommon: commonIds.includes(r.person.id) })),
      related2: related2.map(r => ({ ...r, isCommon: commonIds.includes(r.person.id) })),
      commonPersons: commonIds.map(id => persons.find(p => p.id === id)).filter(Boolean),
      commonCount: commonIds.length
    }
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

  function setComparePersons(ids) {
    comparePersonIds.value = ids.filter(Boolean)
  }

  function clearCompare() {
    comparePersonIds.value = []
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
    comparePersonIds,
    // 计算属性
    allPersons,
    allRelations,
    allRelationTypes,
    filteredRelations,
    filteredPersons,
    relatedRelations,
    relatedPersons,
    compareData,
    // 操作
    selectPerson,
    clearSelection,
    setFilters,
    toggleFilter,
    setSearchKeyword,
    getPersonById,
    getRelationColor,
    getRelatedPersonsOf,
    setComparePersons,
    clearCompare
  }
})
