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
        />
      </div>
    </nav>
    <nav class="create-tool flex">
      <Drawer>
        <template v-slot:title>
          <el-button type="primary">+ 新增用户组</el-button>
        </template>
        <template v-slot:center="slotProps">
          <NewUserGroup @handleClose="slotProps.handleClose" @success="handleSuccess" />
        </template>
      </Drawer>
        <!-- <Card position="right">
          <template v-slot:header><el-button>+ 新 增</el-button></template>
          <template v-slot:center>
            <NewUserGroup @submitSuccess="getUserGroupList"></NewUserGroup>
          </template>
        </Card> -->
      </nav>
  </div>
  <div class="table-center">
      <Table
      :loading="loading"
      :data="listData"
      :height="`calc(100vh - 240px)`"
      :listAbout="listAbout"
      @rerequest="getUserGroupList"
      @update:currentSize="updateCurrentSize"
      @update:currentPage="updateCurrentPage"
      >
      <template #column>
        <el-table-column fixed prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="用户组名称" min-width="160" />
        <el-table-column prop="description" label="描述" min-width="160" />
        <el-table-column prop="create_by" label="创建信息" width="160">
          <template #default="scope">
            <p class="create-by" v-text="scope.row.create_by"></p>
            <p class="create-by" v-text="scope.row.create_time"></p>
          </template>
        </el-table-column>
        <el-table-column label="操作项" width="120">
          <template #default="scope">
            <div class="flex" style="justify-content: center;">
              <Drawer>
                <template v-slot:title>
                  <span class="inline-block pointer">
                    <img src="@/assets/icons/edit.svg" class="icon" alt="" />
                  </span>
                </template>
                <template #center="slotProps">
                  <NewUserGroup
                    :info="scope.row"
                    @handleClose="slotProps.handleClose"
                    @success="handleSuccess"
                    :detail="true"
                  />
                </template>
              </Drawer>
            <span style="padding:5px"></span>

            <MessageBox
                @success="delUserGroup(scope.row.id)"
                :message="[scope.row.name, '用户组']"
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
import { ref, reactive, onMounted, inject } from 'vue'
import { GetUserGroupList, DelUserGroup} from '@/apis/user/userGroup';
import { Search } from '@element-plus/icons-vue'
import Table from '@/components/Table/Table.vue'
import Drawer from '@/components/Drawer/Drawer.vue'
import NewUserGroup from './components/NewUserGroup.vue';
import type { GetBaseListResponse } from '@/apis/models/BaseResponse'

const pageSizeInit = inject('pageSizeInit') as number[]
const loading = ref(false)
const listAbout = reactive({
  pageNo: 1,
  pageSize: pageSizeInit[0],
  pages: 0,
  total: 0,
  k:''
})

let listData = ref<any>([])

const getUserGroupList = async () => {
  try {
    loading.value = true
    const params = {
    k: listAbout.k,
    page_no: listAbout.pageNo,
    page_size: listAbout.pageSize
  }
  const res = await GetUserGroupList(params) as GetBaseListResponse
  loading.value = false
  if(!res) return
  const { page_no, page_size, pages, total, result_list } = res
  Object.assign(listAbout, { page_no, page_size, pages, total })
  listData.value = result_list
  } catch(e){
  loading.value = false
    console.error(e)
  }
}

// 其他回调
const updateCurrentSize = (val: number) => {
  listAbout.pageSize = val
  getUserGroupList()
}

const updateCurrentPage = (val: number) => {
  listAbout.pageNo = val
  getUserGroupList()
}

const delUserGroup = async(id:number)=>{
  if(await DelUserGroup(id))getUserGroupList()
}

const handleSuccess = () => {
  getUserGroupList()
}

onMounted(() => {
  getUserGroupList()
})

</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-table-styles.scss';
</style>
