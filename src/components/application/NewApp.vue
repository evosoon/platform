<template>
    <div class="new-template-manage color flex">
      <div class="center">
        <div class="center-title">{{ props?.appInfo?.id ? '编辑' : '新增' }}上游业务</div>
  
  
        <div class="center-input flex">
          <span class="input-title require">
            <span class="require">* </span>appid
          </span>
          <el-input v-model="appData.app_id" style="width: 240px" clearable />
        </div>
        <div class="center-input flex">
          <span class="input-title require">
            <span class="require">* </span>业务介绍
          </span>
          <el-input
            v-model="appData.description"
            type="textarea"
            resize="none"
            rows="2"
            style="width: calc(100% - 120px)"
            clearable
          />
        </div>
      </div>
      <div class="center-title foot flex" style="justify-content: end">
        <el-button
          @click="submit"
          type="primary"
          style="width: 200px;"
          >保存</el-button
        >
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { AddApp, UpdateApp } from '@/apis/applicationApis';
import { reactive} from 'vue'
  
  const props = defineProps(['appInfo'])
  const emits = defineEmits(['submitSuccess'])
  
  interface AppData {
    app_id: string
    description: string
  }
  const appData = reactive<AppData>({
    app_id: props.appInfo?.app_id,
    description: props.appInfo?.description,
  })
  
  const submit = () => {
    props?.appInfo?.id ? updateApp() : addApp()
  }
  const addApp = async () => {
    const res = await AddApp(appData)
    if(res.result_code == 'success')alert('创建成功')
    emits('submitSuccess')
  }
  const updateApp = async () => {
    const res = await UpdateApp(appData)
    if(res.result_code == 'success')alert('更新成功')
    emits('submitSuccess')
  }
  </script>
  
  <style lang="scss" scoped>
  .new-template-manage {
    flex-direction: column;
    height: 100vh;
    width: 700px;
    background-color: var(--color-background);
    box-shadow: 0 0 10px 1px #9d9d9d;
  }
  .center {
    flex: 1;
    padding: 5px 30px;
    overflow: auto;
  }
  .foot {
    padding: 5px 30px;
  }
  .center-title {
    margin: 15px 0;
    font-size: 16px;
    font-family: AliBold;
  }
  .center-input {
    margin: 18px 15px;
    .input-title {
      min-width: 100px;
      font-size: 14px;
      text-align: right;
      margin-right: 20px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      .require {
        color: red;
        font-weight: bold;
      }
    }
  }
  </style>
  