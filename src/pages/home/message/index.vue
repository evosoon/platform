<template>
  <div class="control-panel color flex" v-loading="loading">
    <nav class="search-tool flex">
      <div class="search-item flex">
        <span class="title">关键字搜索</span>
        <el-input
          class="input"
          placeholder="关键字搜索"
          :prefix-icon="Search"
          v-model.lazy="listAbout.keyword"
          clearable
        />
      </div>
      <div class="search-item flex">
        <span class="title">发送渠道</span>
        <el-cascader
          class="input"
          placeholder="选择渠道"
          v-model="choose.choosedChannel"
          :options="choose.channel"
          filterable
        />
      </div>
      <div class="search-item flex">
        <span class="title"></span>
        <el-checkbox v-model="choose.isCreateBySelf" label="我创建的" />
      </div>
    </nav>
    <nav class="create-tool flex">
      <el-button style="width: 80px" @click="reset">重置</el-button>
      <div class="zero"></div>
      <Drawer>
        <template v-slot:title>
          <el-button type="primary">+ 新建模板</el-button>
        </template>
        <template v-slot:center>
          <NewMessageTemplate @success="handleSuccess" />
        </template>
      </Drawer>
    </nav>
  </div>

  <div class="table-center">
    <Table
      :loading="loading"
      :data="listData"
      :height="`calc(100vh - 240px)`"
      :listAbout="listAbout"
      @rerequest="debounceGetMessageTemplateList"
      @update:currentSize="updateCurrentSize"
      @update:currentPage="updateCurrentPage"
    >
      <template #column>
        <el-table-column fixed prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="模板名称" width="140" />
        <el-table-column label="模板简介" width="180">
          <template #default="scope">
            <el-tooltip :content="scope.row.description" effect="light">
              <span
                class="pointer content"
                v-text="scope.row.description"
              ></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="tag" label="发送渠道" width="180">
          <template #default="scope">
            <div class="flex form-tag">
              <el-tag
                class="tag-item"
                :type="scope.row.sms_status ? 'success' : 'info'"
                >短信</el-tag
              >
              <el-tag
                class="tag-item"
                :type="scope.row.email_status ? 'warning' : 'info'"
                >邮箱</el-tag
              >
              <el-tag
                class="tag-item"
                :type="scope.row.feishu_status ? 'primary' : 'info'"
                >飞书</el-tag
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="模板内容" min-width="160">
          <template #default="scope">
            <TemplateContent :data="scope.row.content">
              <div class="pointer content" v-text="scope.row.content"></div>
            </TemplateContent>
          </template>
        </el-table-column>
        <el-table-column prop="create_by" label="创建信息" width="160">
          <template #default="scope">
            <p class="create-by" v-text="scope.row.create_by"></p>
            <p class="create-by" v-text="scope.row.create_time"></p>
          </template>
        </el-table-column>
        <el-table-column label="操作项" width="120">
          <template #default="scope">
            <div class="flex" style="justify-content: center">
              <Drawer>
                <template v-slot:title>
                  <span class="inline-block pointer">
                    <img src="@/assets/icons/edit.svg" class="icon" alt="" />
                  </span>
                </template>
                <template #center="slotProps">
                  <NewMessageTemplate
                    :id="scope.row.id"
                    :templateInfo="scope.row"
                    @handleClose="slotProps.handleClose"
                    @success="handleSuccess"
                  ></NewMessageTemplate>
                </template>
              </Drawer>
              <span style="padding: 5px"></span>
              <MessageBox
                @success="delMessageTemplate(scope.row.id)"
                :message="[scope.row.name, '模板']"
                :type="'delete'"
              >
                <span class="inline-block pointer">
                  <img src="@/assets/icons/delete.svg" class="icon" alt="" />
                </span>
              </MessageBox>
            </div>
          </template>
        </el-table-column>
      </template>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, inject } from 'vue'
import debounce from '@/utils/base/debounce'
import {
  GetMessageTemplateList,
  DelMessageTemplate
} from '@/apis/template/template'
import { Search } from '@element-plus/icons-vue'
import NewMessageTemplate from '@/pages/home/message/components/NewMessageTemplate.vue'
import Table from '@/components/Table/Table.vue'
import Drawer from '@/components/Drawer/Drawer.vue'
import MessageBox from '@/components/MessageBox/MessageBox.vue'
import TemplateContent from '@/components/home/TemplateContent/index.vue'
import type {
  GetMessageTemplateParamsModel,
  GetMessageTemplateDataModel
} from '@/apis/template/models/templateModel'
import { useUserStore } from '@/stores/user'
import { channelInit } from '@/pages/home/configRule/data'
import type { ListAbout } from './types'
const pageSizeInit = inject('pageSizeInit') as number[]
const userStore = useUserStore()
// loading
const loading = ref(false)
// 列表数据
const listData = ref<any>([])
// 列表相关
const listAboutInit: ListAbout = {
  pageNo: 1,
  pageSize: pageSizeInit[0],
  pages: 0,
  total: 0,
  keyword: '',
  createBy: '',
  email_status: false,
  sms_status: false,
  feishu_status: false
}
const listAbout = reactive<ListAbout>({ ...listAboutInit })
// 筛选数据
const choose = reactive({
  isCreateBySelf: false,
  choosedChannel: '全部',
  channel: channelInit
})
// 重置
const reset = () => {
  Object.assign(listAbout, listAboutInit)
  choose.isCreateBySelf = false
  choose.choosedChannel = '全部'
  debounceGetMessageTemplateList()
}
// 获取模板列表
const getMessageTemplateList = async () => {
  const params: GetMessageTemplateParamsModel = {
    page_no: listAbout.pageNo,
    page_size: listAbout.pageSize
  }
  const data: GetMessageTemplateDataModel = {
    keyword: listAbout.keyword,
    create_by: listAbout.createBy,
    feishu_status: listAbout.feishu_status,
    email_status: listAbout.email_status,
    sms_status: listAbout.sms_status
  }

  try {
    loading.value = true

    const res = await GetMessageTemplateList(params, data)
    loading.value = false
    if (!res) return
    const { page_no, page_size, pages, total, result_list } = res
    listData.value = result_list
    Object.assign(listAbout, {
      pageNo: page_no,
      pageSize: page_size,
      pages,
      total
    })
  } catch (e) {
    loading.value = false
    console.error(e)
  }
}

// 防止抖动
const debounceGetMessageTemplateList = debounce(getMessageTemplateList)

// 删除模板
const delMessageTemplate = async (id: number) => {
  const res = await DelMessageTemplate(id)
  if (res) getMessageTemplateList()
}
// 监听 关键字变化
watch(() => listAbout.keyword, debounceGetMessageTemplateList)
// 监听 创建人变化
watch(
  () => choose.isCreateBySelf,
  (val) => {
    listAbout.createBy = val ? userStore.username : ''
    debounceGetMessageTemplateList()
  }
)
// 监听 渠道变化
watch(
  () => choose.choosedChannel,
  (newVal) => {
    listAbout.feishu_status = newVal[0] === 'feishu'
    listAbout.email_status = newVal[0] === 'email'
    listAbout.sms_status = newVal[0] === 'sms'
    debounceGetMessageTemplateList()
  }
)

// 其他回调
const updateCurrentSize = (val: number) => {
  listAbout.pageSize = val
  debounceGetMessageTemplateList()
}

const updateCurrentPage = (val: number) => {
  listAbout.pageNo = val
  debounceGetMessageTemplateList()
}

const handleSuccess = () => {
  debounceGetMessageTemplateList()
}

onMounted(getMessageTemplateList)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-table-styles.scss';
.form-tag {
  border-radius: 6px;
  border: 1px solid var(--color-border-hover);
  .tag-item {
    margin: 2px 3px;
    flex: 1;
  }
}
</style>
