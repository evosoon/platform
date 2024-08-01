<template>
  <div class="offside-config color flex">
    <article class="center flex">
      <div class="form-title">
        {{ props.detail ? '修改用户信息' : '新增用户' }}
      </div>
      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>真实姓名
        </span>
        <el-input v-model="userInfo.name" style="width: 260px;" clearable />
      </div>

      <div class="input-unit flex">
        <span class="input-title require">
          <span class="require">* </span>部门
        </span>
        <el-select-v2
          v-model="userInfo.department"
          :options="options"
          style="width: 260px;"
        />
        <div style="padding: 0 20px"></div>
      </div>

      <div class="input-unit flex">
        <span class="input-title require"
          ><span class="require">* </span>手机号</span
        >
        <el-input v-model="userInfo.mobile" clearable />
      </div>

      <div class="input-unit flex">
        <span class="input-title require"
          ><span class="require">* </span>邮箱号</span
        >
        <el-input v-model="userInfo.email" clearable />
      </div>

      <div class="input-unit flex">
        <span class="input-title require"
          ><span class="require">* </span>飞书ID</span
        >
        <el-input v-model="userInfo.user_id" clearable />
      </div>

      <div class="input-unit flex" v-if="props.detail">
        <span class="input-title require"
          ><span class="require">* </span>新增人</span
        >
        <el-input v-model="userInfo.create_by" disabled />
      </div>

      <div class="input-unit flex" v-if="props.detail">
        <span class="input-title require"
          ><span class="require">* </span>创建时间</span
        >
        <el-input
          v-model="userInfo.create_time"
        
          disabled
        />
      </div>
    </article>
    <footer class="footer flex">
      <el-button
        type="primary"
        class="submit"
        @click="handleSubmit"
        >保存</el-button
      >
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watchEffect, inject, unref } from 'vue'
import { AddUser, UpdateUser } from '@/apis/user/user'
import { GetDepartmentList } from '@/apis/user/department'
import type { Options, UserInfo } from './types';
import deepEqual from '@/utils/base/isEqual';
const changeUnsaved = inject<(val: boolean) => void>('changeUnsaved')

const props = defineProps({
  detail: {
    default: false
  },
  info: {}
})
const emits = defineEmits(['success', 'handleClose'])

const userInfo: UserInfo = reactive({
  id: 0,
  name: '',
  department: '',
  email: '',
  mobile: '',
  user_id: '',
  create_by: '',
  create_time: '',
  is_deleted: 0
})

const options = ref<Options[]>([])
const fetchDepartmentList = async () => {
  const response = await GetDepartmentList()
  if (response) {
    options.value = response.map((item: string) => ({
      value: item,
      label: item
    }))
  }
}

onMounted(() => {
  if (props.info) {
    Object.assign(userInfo, props.info)
  }
  tmp.value = Object.freeze({...userInfo});

  fetchDepartmentList()
})

const tmp = ref()
watchEffect(() => {
  if (
    deepEqual(
      userInfo,
      unref(tmp)
    )
  ) {
    changeUnsaved?.(false)
  } else {
    changeUnsaved?.(true)
  }
})

const handleSubmit = () => {
  const {name, department, email, mobile, user_id} = userInfo
  const data = {name, department, email, mobile, user_id}

  props.detail ? updateUserInfo(data) : addUserInfo(data)
}
const addUserInfo = async (data:UserInfo) => {
  if(await AddUser(data)){
    emits('handleClose')
    emits('success')
  }
}
const updateUserInfo = async (data:UserInfo) => {
  if(await UpdateUser(userInfo.id!, data)){
    emits('handleClose')
    emits('success')
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-offside-config-styles.scss';
</style>
