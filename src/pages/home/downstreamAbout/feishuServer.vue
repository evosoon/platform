<template>
  <div class="control-panel color flex">
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
    <nav class="create-tool flex"></nav>
  </div>
  <div class="table-center">
    <Table
      :loading="loading"
      :data="listData"
      :height="`calc(100vh - 240px)`"
      :listAbout="listAbout"
      @rerequest="getRobotList"
      @update:currentSize="updateCurrentSize"
      @update:currentPage="updateCurrentPage"
    >
      <template #column>
        <el-table-column fixed prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="机器人名称" min-width="100" />
        <el-table-column
          prop="description"
          label="机器人介绍"
          min-width="160"
        />
        <el-table-column prop="feishu_app_id" label="appid" min-width="140" />
        <el-table-column label="AppSecret" width="200">
          <template #default="scope">
            <span
              v-if="scope.row.feishu_app_secret"
              @click="controlNowShow(scope.row.feishu_app_secret)"
              >{{
                scope.row.feishu_app_secret == nowShow
                  ? scope.row.feishu_app_secret
                  : '************'
              }}</span
            >
            <span v-else>[暂无内容]</span>
            <span
              @click="controlNowShow(scope.row.feishu_app_secret)"
              style="padding-left: 10px"
              v-if="scope.row.feishu_app_secret"
              ><img
                :src="closeEye"
                width="16px"
                v-if="scope.row.feishu_app_secret !== nowShow"
              />
              <el-icon
                class="pointer copy"
                v-if="scope.row.feishu_app_secret === nowShow"
                @click.stop="handleCopy(scope.row.feishu_app_secret)"
                ><CopyDocument
              /></el-icon>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="引用计数" width="80">
          <template #default="scope">
            <el-popover placement="bottom" :width="260" trigger="click">
              <template #default>
                <div class="flex" style="justify-content: space-between">
                  <span v-text="'id'"></span>
                  <span v-text="'appid'"></span>
                </div>
                <div
                  style="
                    border-bottom: 1px solid var(--color-border-hover);
                    margin: 4px;
                  "
                ></div>
                <div
                  class="flex"
                  style="justify-content: space-between; padding: 4px"
                  v-for="item in scope.row.app_list"
                  :key="item.id"
                >
                  <span v-text="item.id"></span>
                  <span v-text="item.app_id"></span>
                </div>
              </template>
              <template #reference>
                <el-button
                  class="m-2"
                  type="text"
                  :disabled="!scope.row.app_list.length"
                  >{{ scope.row.app_list.length }}</el-button
                >
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="app_id" label="所属方" width="80" />
        <el-table-column label="创建信息" width="200">
          <template #default="scope">
            <p class="create-by">{{ scope.row.create_by }}</p>
            <p class="create-by">{{ scope.row.create_time }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作项" width="100">
          <template #default="scope">
            <div class="flex" style="justify-content: center">
              <Drawer>
                <template v-slot:title>
                  <span class="inline-block pointer" @click="handleUpdateData(scope.row)">
                    <img src="@/assets/icons/edit.svg" class="icon" alt="" />
                  </span>
                </template>
                <template #center>
                  <div class="input-unit flex">
                    <span class="input-title require">
                      <span class="require">* </span>机器人名称
                    </span>
                    <el-input v-model="updateRobot.name" clearable />
                  </div>
                  <div class="input-unit flex">
                    <span class="input-title require">
                      <span class="require">* </span>机器人描述
                    </span>
                    <el-input v-model="updateRobot.description" clearable />
                  </div>
                  <el-button type="primary" class="submit" @click="handleUpdate(scope.row.id)"
                  :disabled="!updateRobot.name || !updateRobot.description"
                    >保存</el-button
                  >
                </template>
              </Drawer>
              <span style="padding: 8px"></span>
              <MessageBox
                @success="delRobot(scope.row.id)"
                :message="[scope.row.name, '机器人']"
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
import { GetRobotList, DelRobot, UpdateRobot } from '@/apis/robot/robot'
import { Search } from '@element-plus/icons-vue'
import Table from '@/components/Table/Table.vue'
import closeEye from '@/assets/icons/closeEye.svg'
import { MessageType, useElMessage } from '@/hooks/useMessage'

let nowShow = ref<string>('')
const controlNowShow = (e: any) => {
  nowShow.value = nowShow.value === e ? '' : e
}
const pageSizeInit = inject('pageSizeInit') as number[]

const listAbout = reactive({
  pageNo: 1,
  pageSize: pageSizeInit[0],
  pages: 0,
  total: 0,
  k: ''
})
const loading = ref(false)
const handleCopy = (data: string) => {
  navigator.clipboard.writeText(data).then(() => {
    useElMessage('复制成功', MessageType.SUCCESS)
  })
}

let listData = ref<any>([])

const getRobotList = async () => {
  try{
    loading.value = true
  const res = await GetRobotList({
    k: listAbout.k,
    page_no: listAbout.pageNo,
    page_size: listAbout.pageSize
  })
  loading.value = false
  if (!res) return
  listAbout.pageNo = res.page_no
  listAbout.pageSize = res.page_size
  listAbout.pages = res.pages
  listAbout.total = res.total
  listData.value = res.result_list
  } catch(e){
    loading.value = false
    console.error(e)
  }
}

const updateRobot = reactive({
  name: '',
  description: ''
})

const handleUpdateData = (data : any) => {
  updateRobot.name = data.name
  updateRobot.description = data.description
  
}

const handleUpdate = async (id:number) => {
  if (await UpdateRobot(id,updateRobot)) {
    getRobotList()
  }
}

onMounted(() => {
  getRobotList()
})
const updateCurrentSize = (val: number) => {
  listAbout.pageSize = val
  getRobotList()
}

const updateCurrentPage = (val: number) => {
  listAbout.pageNo = val
  getRobotList()
}
const delRobot = async (id: number) => {
  if (await DelRobot(id)) getRobotList()
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-table-styles.scss';
.input-unit {
        margin: 10px;
        width: calc(100% - 20px);
        .input-title {
          font-size: 14px;
          min-width: 100px;
          text-align: right;
          margin-right: 20px;
          height: 30px;
          line-height: 30px;
          .require {
            color: red;
            font-weight: bold;
          }
        }
        .input {
          width: 100%;
        }
      }
      .submit {
        margin-left: 40px;
        margin-top: 20px;
        width: 100px;
      }
</style>
