<template>
  <div class="offside-config color flex">
    <article class="center flex">
      <div class="form-title">
        {{ props.detail ? '修改用户组' : '新增用户组' }}
      </div>
      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>用户组名称
        </span>
        <el-input v-model="newUserGroup.name" clearable />
      </div>

      <div class="input-unit flex">
        <span
          class="input-title require"
          style="vertical-align: top"
          v-text="'用户组概述'"
        ></span>
        <el-input
          v-model="newUserGroup.description"
          type="textarea"
          resize="none"
          :rows="2"
          style="width: calc(100% - 120px)"
          clearable
        />
      </div>
      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>用户选择
        </span>
        <UserChooseBox @userGroupChange="handelUserGroup"></UserChooseBox>
      </div>

      <div v-if="props.detail" class="show-unit">
        <div class="form-title">
         用户组中的用户
        </div>
        <div class="show-user-list" v-if="showUserList && showUserList.length">
          <div v-for="item in showUserList" :key="item" class="show-item flex">
            <span>{{item.id}}</span>
            <span>{{item.name}}</span>
            <span>{{item.department}}</span>
          </div>
        </div>
      </div>

    </article>
    <footer class="footer flex">
      <el-button type="primary" class="submit" @click="handleSubmit"
        >保存</el-button
      >
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watchEffect, unref, inject } from 'vue'
import { AddUserGroup, QueryUserGroup, UpdateUserGroup } from '@/apis/user/userGroup'
import { GetUserList } from '@/apis/user/user'
import { useUserWeightRemoval } from '@/hooks/useUserWeightRemoval'
import UserChooseBox from '@/pages/home/configRule/components/UserChooseBox.vue'
import type { GetBaseListResponse } from '@/apis/models/BaseResponse'
import type { Options } from './types'
import deepEqual from '@/utils/base/isEqual'
const props = defineProps(['detail', 'info'])
const emits = defineEmits(['success', 'handleClose'])
const changeUnsaved = inject<(val: boolean) => void>('changeUnsaved')

let options: Record<'userGroup' | 'userList', Options[]> = reactive({
  userGroup: [],
  userList: []
})

// 新增用户组
interface NewUserGroup {
  name: string
  description?: string
  uid_list: number[] | []
}
const newUserGroup: NewUserGroup = reactive({
  name: '',
  description: '',
  uid_list: []
})

// 新建用户组回传
let choosed = ref<any>({})
const handelUserGroup = (val: any) => {
  choosed.value = val
}

// 获取用户列表
const showUserList = ref<any[]>([])
const getUserList = async () => {
  const { result_list } = (await GetUserList({
    d: '',
    k: '',
    page_no: 0,
    page_size: 10000
  })) as GetBaseListResponse
  options.userList = result_list.map((item) => ({
    value: item.id,
    label: item.name
  }))
}
onMounted(() => {
  if (props.info) {
    Object.assign(newUserGroup, props.info)
  }
  tmp.value = Object.freeze({...newUserGroup});

  getUserList()
  if(props.detail)queryUserGroup()
})
const queryUserGroup = async() => {
  const res = await QueryUserGroup(props.info?.id) as any
  if(!res) return
  showUserList.value = res.user_info_list
}

const tmp = ref()
watchEffect(() => {
  if (
    deepEqual(
      newUserGroup,
      unref(tmp)
    )
  ) {
    changeUnsaved?.(false)
  } else {
    changeUnsaved?.(true)
  }
})

// 保存
const handleSubmit = async () => {
  const { array }: any = await useUserWeightRemoval(choosed.value)
  newUserGroup.uid_list = array
  const res = props.detail? await UpdateUserGroup(props.info.id,{name:newUserGroup.name,description:newUserGroup.description,uid_list:newUserGroup.uid_list}) : await AddUserGroup(newUserGroup) 
  if (res) {
    emits('handleClose')
    emits('success')
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-offside-config-styles.scss';
.show-unit{
  margin: 10px 10px 10px 30px;
  width: calc(100% - 40px);
  .show-user-list{
    border: 1px solid var(--color-border-hover);
    border-radius: 4px;
    padding: 10px 50px;
  max-height: 500px;
  min-height: 150px;
  width: 100%;
  overflow: auto;
  .show-item{
    border-bottom: 1px solid var(--color-border-hover);
    span{
      flex: 1;
    }
  }
}
}

</style>
