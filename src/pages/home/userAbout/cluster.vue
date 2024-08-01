<template>
  <div class="control-panel color flex" v-loading="loading">
    <nav class="search-tool flex">
      <div class="search-item flex">
        <span class="title">关键字搜索</span>
        <el-input
          class="input"
          v-model="listAbout.k"
          placeholder="搜索"
          :prefix-icon="Search"
          clearable
          disabled
        />
      </div>
    </nav>
    <nav class="create-tool flex">
      <Drawer>
        <template v-slot:title>
          <el-button type="primary">+ 新增群组</el-button>
        </template>
        <template v-slot:center="slotProps">
          <NewCluster
            @handleClose="slotProps.handleClose"
            @saveSuccess="handleSuccess"
          />
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
      @rerequest="getChatList"
      @update:currentSize="updateCurrentSize"
      @update:currentPage="updateCurrentPage"
    >
      <template #column>
        <el-table-column fixed prop="id" label="群组ID" width="80" />
        <el-table-column prop="name" label="群组名称" width="160" />
        <el-table-column prop="chat_id" label="ChatID" min-width="220" />
        <el-table-column label="操作项" width="110">
          <template #default="scope">
            <div class="flex" style="justify-content: center">
              <Drawer>
                <template v-slot:title>
                  <span class="inline-block pointer">
                    <img src="@/assets/icons/edit.svg" class="icon" alt="" />
                  </span>
                </template>
                <template #center="slotProps">
                  <NewCluster
                    :info="scope.row"
                    @handleClose="slotProps.handleClose"
                    @success="handleSuccess"
                    :detail="true"
                  />
                </template>
              </Drawer>
              <span style="padding: 5px"></span>
              <MessageBox
                @success="delCluster(scope.row.id)"
                :message="[scope.row.name, '群组']"
                :type="'delete'"
              >
                <span class="pointer inline-block">
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
import { ref, reactive, onMounted, inject, watch } from 'vue'
import { DelCluster, GetClusterList } from '@/apis/user/cluster'
import { Search } from '@element-plus/icons-vue'
import Table from '@/components/Table/Table.vue'
import Drawer from '@/components/Drawer/Drawer.vue'
import NewCluster from './components/NewCluster.vue'
import type { GetBaseListResponse } from '@/apis/models/BaseResponse'

const pageSizeInit = inject('pageSizeInit') as number[]
const listAbout = reactive({
  pageNo: 1,
  pageSize: pageSizeInit[0],
  pages: 0,
  total: 0,
  d: '',
  k: ''
})
const loading = ref(false)
let listData = ref<any>([])

const getChatList = async () => {
  try {
    loading.value = true
    const params = {
      page_no: listAbout.pageNo,
      page_size: listAbout.pageSize
    }
    const res  =
      (await GetClusterList(params)) as GetBaseListResponse
    loading.value = false
    if(!res)return
    const{ page_no, page_size, pages, total, result_list } = res
    listAbout.pageNo = page_no
    listAbout.pageSize = page_size
    listAbout.pages = pages
    listAbout.total = total
    listData.value = result_list
  } catch (e) {
    loading.value = false
    console.error(e)
  }
}
watch(
  () => listAbout.k,
  () => {
    getChatList()
  }
)

const delCluster = async (id: number) => {
  await DelCluster(id)
  getChatList()
}
const updateCurrentSize = (val: number) => {
  listAbout.pageSize = val
  getChatList()
}

const updateCurrentPage = (val: number) => {
  listAbout.pageNo = val
  getChatList()
}

const handleSuccess = (): void => {
  getChatList()
}

onMounted(() => {
  getChatList()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-table-styles.scss';
</style>
