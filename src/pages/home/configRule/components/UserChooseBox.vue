<template>
  <div class="user-choose-box flex">
    <div class="choose-left" v-loading="loading">
      <el-input
        v-model="listAbout.keyWord"
        placeholder="筛选用户"
        clearable
        prefix-icon="Search"
      ></el-input>

      <div class="left-catalog">
        <span class="pointer span" @click="listAbout.nowLevel = ''"
          >联系人</span
        >
        <span
          class="pointer span"
          v-if="listAbout.nowLevel"
          v-text="' / ' + listAbout.nowLevel"
        ></span>
      </div>
      <div class="left-box">
        <template v-if="listAbout.keyWord && !listAbout.nowLevel">
          <div>
            <template v-for="item in userList" :key="item">
              <div class="left-list-item flex">
                <el-checkbox
                  :value="item"
                  v-model="checkedList.checkedUser"
                  :label="item.value.name"
                />
                <span
                  style="font-size: 12px"
                  v-text="item.value.department"
                ></span>
              </div>
            </template>
          </div>
        </template>
        <template v-else-if="!listAbout.nowLevel">
          <template v-for="item in departmentList" :key="item">
            <div class="left-list-item flex">
              <el-checkbox
                :value="item"
                v-model="checkedList.checkedDepartment"
                :label="item.value"
              ></el-checkbox>
              <el-button
                type="primary"
                text
                @click="listAbout.nowLevel = item.value"
                >下级</el-button
              >
            </div>
          </template>
        </template>
        <template v-else>
          <template v-for="item in userList" :key="item">
            <div class="left-list-item flex">
              <el-checkbox
                :value="item"
                v-model="checkedList.checkedUser"
                :label="item.value.name"
              />
            </div>
          </template>
        </template>
      </div>
    </div>
    <div class="choose-right">
      <div
        class="right-list-title"
        v-if="
          checkedList.checkedDepartment && checkedList.checkedDepartment.length
        "
      >
        部门 {{ checkedList.checkedDepartment.length }}
      </div>
      <template v-for="item in checkedList.checkedDepartment" :key="item">
        <div class="right-list-item flex">
          <span class="pointer" v-text="item.value"></span>
          <span class="pointer" @click="deselect('department', item)">
            <el-icon class="icon"><Close /></el-icon>
          </span>
        </div>
      </template>
      <div
        class="right-list-title"
        v-if="checkedList.checkedUser && checkedList.checkedUser.length"
      >
        成员 {{ checkedList.checkedUser.length }}
      </div>
      <template v-for="item in checkedList.checkedUser" :key="item">
        <div class="right-list-item flex">
          <span
            >{{ item.value.name }}
            <span style="font-size: 10px; color: gray; margin-left: 5px">{{
              item.value.department
            }}</span>
          </span>
          <span class="pointer" @click="deselect('personage', item)">
            <el-icon class="icon"><Close /></el-icon>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { GetUserList } from '@/apis/user/user'
import { GetDepartmentList } from '@/apis/user/department'
import type { CheckedList, GroupList } from './types'
import debounce from '@/utils/base/debounce'
const emit = defineEmits(['userGroupChange'])

let loading = ref<boolean>(false)
// 选中的部门，用户 列表
const checkedList: CheckedList = reactive({
  checkedDepartment: [],
  checkedUser: []
})

// 监听选中变化并回传父组件
watch(checkedList, (newValue) => {
  emit('userGroupChange', newValue)
})
//
const filterList = (now: any) => {
  const list = now.reduce((pre: any, item: any) => {
    return [...pre, item.value]
  }, [])
  checkedList.checkedUser = checkedList.checkedUser.filter(
    (item: GroupList) => {
      return !list.includes(item.value.department)
    }
  )
}
// 当前层级
const listAbout: any = reactive({
  nowLevel: '',
  keyWord: '',
  departmentListData: [],
  userListData: []
})

const userlistCache = ref<any>({})
const useUserListCache = () => {
  if (!listAbout.keyWord && userlistCache.value[listAbout.nowLevel]) {
    listAbout.userListData = userlistCache.value[listAbout.nowLevel]
    return true
  }
  return false
}

// GET User 列表
const getUserList = async () => {
  const params = {
    d: listAbout.nowLevel,
    k: listAbout.keyWord,
    page_no: 1,
    page_size: 10000
  }
  if (useUserListCache()) return
  const data = await GetUserList(params)
  if (!data) return
  listAbout.userListData = data.result_list
  userlistCache.value[listAbout.nowLevel] = data.result_list
}
const debounceGetUserList = debounce(getUserList, 400)

const userList = computed<GroupList[]>(() => {
  return listAbout.userListData.reduce(
    (pre: GroupList[] | [], item: string) => {
      return [
        ...pre,
        {
          value: item,
          type: 'personage',
          parent: listAbout.nowLevel
        } as GroupList
      ]
    },
    []
  )
})
// GET Department 列表
const getDepartmentList = async () => {
  loading.value = true
  listAbout.departmentListData = await GetDepartmentList()
  loading.value = false
}
const departmentList = computed<GroupList[]>(() => {
  return listAbout.departmentListData.reduce(
    (pre: GroupList[] | [], item: string) => {
      return [...pre, { value: item, type: 'department' } as GroupList]
    },
    []
  )
})
// 监听查看的部门
watch(
  () => listAbout.nowLevel,
  async (now) => {
    if (now || now != '') debounceGetUserList()
  }
)
// 选中部门 并且取消人
watch(
  () => checkedList.checkedDepartment,
  async (now) => {
    filterList(now)
  }
)
watch(
  () => listAbout.keyWord,
  async () => {
    searchUser()
  }
)
const searchUser = () => {
  setTimeout(() => {
    debounceGetUserList()
  }, 0)
}

// 取消选择
const deselect = function (type: 'department' | 'personage', val: GroupList) {
  if (type === 'department') {
    checkedList.checkedDepartment = checkedList.checkedDepartment.filter(
      (item) => item !== val
    )
    filterList([val])
  }
  if (type === 'personage')
    checkedList.checkedUser = checkedList.checkedUser.filter(
      (item) => item !== val
    )
}

onMounted(() => {
  getDepartmentList()
})
</script>

<style lang="scss" scoped>
.user-choose-box {
  border: 1px solid var(--color-border-hover);
  flex: 1;
  border-radius: 6px;
  height: 300px;
  overflow: hidden;
  .choose-left {
    flex: 1;
    padding: 6px;
    position: relative;
    border-right: 4px solid var(--color-background);
    .left-catalog {
      padding: 5px 0 0 6px;
      opacity: 0.9;
      font-size: 14px;
      text-align: left;
    }
    .left-box {
      height: calc(100% - 60px);
      overflow: auto;
      .left-list-item {
        align-items: center;
        justify-content: space-between;
      }
    }
  }
  .choose-left::after {
    content: '';
    right: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    position: absolute;
    border-right: 1px solid var(--color-border-hover);
  }
  .choose-right {
    padding: 6px;
    flex: 1;
    overflow: auto;
    .right-list-title {
      text-align: left;
      font-size: 14px;
      color: var(--color-text-primary);
      border-bottom: 1px solid var(--color-text-primary);
      opacity: 0.6;
    }
    .right-list-item {
      justify-content: space-between;
      align-items: center;
      height: 30px;
      font-size: 14px;
      .icon:hover {
        color: red;
      }
    }
  }
  .span:hover {
    color: var(--color-text-primary);
    transition: 0.2s ease-in-out;
  }
}
</style>
