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
          <el-button type="primary">+ 新增用户</el-button>
        </template>
        <template v-slot:center="slotProps">
          <NewUser
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
      @rerequest="getUserList"
      @update:currentSize="updateCurrentSize"
      @update:currentPage="updateCurrentPage"
    >
      <template #column>
        <el-table-column fixed prop="id" label="用户ID" width="80" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="mobile" label="手机号" min-width="120" />
        <el-table-column prop="email" label="邮箱号" min-width="160" />
        <el-table-column prop="user_id" label="飞书ID" width="160" />
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
                  <NewUser
                    :info="scope.row"
                    @handleClose="slotProps.handleClose"
                    @success="handleSuccess"
                    :detail="true"
                  />
                </template>
              </Drawer>
              <span style="padding: 5px"></span>
              <!-- <MessageBox
                @success="del(scope.row.id)"
                :message="[scope.row.name, '模板']"
                :type="'delete'"
              >
                <span class="inline-block pointer">
                  <img src="@/assets/icons/delete.svg" class="icon" alt="" />
                </span>
              </MessageBox> -->
            </div>
          </template>
        </el-table-column>
      </template>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, inject } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { GetUserList } from '@/apis/user/user'
import Table from '@/components/Table/Table.vue'
import Drawer from '@/components/Drawer/Drawer.vue'
import NewUser from './components/NewUser.vue'
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

watch(
  () => listAbout.k,
  () => {
    getUserList()
  }
)

const getUserList = async () => {
  try {
    loading.value = true
    const params = {
      d: listAbout.d,
      k: listAbout.k,
      page_no: listAbout.pageNo,
      page_size: listAbout.pageSize
    }
    const res: GetBaseListResponse | null = await GetUserList(params)
    loading.value = false
    if (!res) return
    const {
      page_no,
      page_size,
      pages,
      total,
      result_list
    }: GetBaseListResponse = res
    Object.assign(listAbout, {
      pageNo: page_no,
      pageSize: page_size,
      pages,
      total
    })
    listData.value = result_list
  } catch (e) {
    loading.value = false
    console.error(e)
  }
}
// 其他回调
const updateCurrentSize = (val: number) => {
  listAbout.pageSize = val
  getUserList()
}

const updateCurrentPage = (val: number) => {
  listAbout.pageNo = val
  getUserList()
}

const handleSuccess = (): void => {
  getUserList()
}

onMounted(() => {
  getUserList()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-table-styles.scss';
</style>
