<template>
  <div class="control-panel color" v-loading="loading">
    <nav class="search-tool flex">
      <div class="search-item flex">
        <span class="title">发送渠道</span>
        <el-input
          class="input"
          placeholder="发送渠道"
          :prefix-icon="Search"
          disabled
          clearable
        />
      </div>
      <div class="search-item flex">
        <span class="title">接收方</span>
        <el-input
          class="input"
          placeholder="接收方"
          :prefix-icon="Search"
          disabled
          clearable
        />
      </div>
      <div class="search-item flex">
        <span class="title">推送类型</span>
        <el-input
          class="input"
          placeholder="推送类型"
          :prefix-icon="Search"
          disabled
          clearable
        />
      </div>
      <div class="search-item flex">
        <span class="title">消息状态</span>
        <el-input
          class="input"
          placeholder="消息状态"
          :prefix-icon="Search"
          disabled
          clearable
        />
      </div>
      <div class="search-item flex">
        <span>规则代号</span>
        <el-input
          style="width: 170px; margin-right: 20px"
          placeholder="筛选代号 / 模板"
          :prefix-icon="Search"
          clearable
          disabled
        />
      </div>
    </nav>
    <div style="height: 10px"></div>
    <nav class="search-tool flex">
      <div class="flex search-item">
        <span>发送时间</span>
        <div class="flex">
          <el-date-picker
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 395px"
            disabled
          />
        </div>
      </div>

      <div class="flex search-item">
        <span>关键字搜索</span>
        <el-input
          style="width: 395px"
          placeholder="搜索"
          suffix-icon="Search"
          clearable
          disabled
        />
      </div>

      <div class="flex search-item">
        <span style="visibility: hidden">重置</span>
        <el-button style="width: 100px" @click="reset">重置</el-button>
      </div>

      <div class="flex search-item right">
        <span>消息发送统计</span>
        <span style="color: var(--color-text-primary); font-size: 24px; font-weight: bolder;">{{
          listAbout?.total ? listAbout.total : 0
        }}</span>
      </div>
    </nav>
  </div>

  <div class="table-center">
    <Table
      :loading="loading"
      :data="listData"
      :listAbout="listAbout"
      :height="`calc(100vh - 310px)`"
      @rerequest="getNotificationList"
      @update:currentSize="updateCurrentSize"
      @update:currentPage="updateCurrentPage"
    >
      <template #column>
        <el-table-column prop="rule_code" label="规则代号" min-width="140" />
        <el-table-column label="消息内容" min-width="160">
          <template #default="scope">
            <TemplateContent :data="scope.row.content">
              <div class="pointer content" v-html="useReplacePlaceholders(scope.row.content,true)"></div>
            </TemplateContent>
          </template>
        </el-table-column>
        <el-table-column prop="strategy" label="发送渠道" min-width="100">
          <template #default="scope">
            <template v-if="scope.row.strategy == '飞书'"
              ><el-tag>飞书</el-tag></template
            >
            <template v-if="scope.row.strategy == '短信'"
              ><el-tag type="success">短信</el-tag></template
            >
            <template v-if="scope.row.strategy == '邮箱'"
              ><el-tag type="warning">邮箱</el-tag></template
            >
          </template>
        </el-table-column>
        <el-table-column prop="receiver" label="接收方" min-width="100" />
        <el-table-column prop="type" label="推送类型" min-width="100">
          <template #default="scope">
            <template v-if="scope.row.type == '0'"
              ><el-tag type="success">实时</el-tag></template
            >
            <template v-if="scope.row.type == '1'"
              ><el-tag type="warning">定时</el-tag></template
            >
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="发送时间" min-width="160" />
        <el-table-column prop="status" label="消息状态" min-width="100">
          <template #default="scope">
            <div style="opacity: 0.6">
              <template v-if="scope.row.status >= 200 && scope.row.status < 300"
                ><el-icon type="success"><Check style="color: green" /></el-icon
                ><span style="color: green"> 发送成功</span></template
              >
              <template v-if="scope.row.status >= 300"
                ><el-icon><Close style="color: red" /></el-icon
                ><span style="color: red"> 发送失败</span></template
              >
              <template v-if="scope.row.status == -1"
                ><el-icon type="success"
                  ><Clock style="color: orange" /></el-icon
                ><span style="color: orange"> 发送超时</span></template
              >
              <template v-if="scope.row.status === 0"
                ><el-icon type=""><Loading style="color: gray" /></el-icon
                ><span style="color: gray"> 待发送</span></template
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作项" min-width="120">
          <template #default="scope">
            <div class="flex" style="justify-content: center">
              <Drawer>
                <template v-slot:title>
                  <el-icon><View /></el-icon>
                </template>
                <template v-slot:center="slotProps">
                  <DetailNotification
                    @handleClose="slotProps.handleClose"
                    :info="scope.row"
                  ></DetailNotification>
                </template>
              </Drawer>
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
import { GetNotificationList } from '@/apis/notification/notification'
import DetailNotification from './components/DetailNotification.vue'
import Table from '@/components/Table/Table.vue'
import Drawer from '@/components/Drawer/Drawer.vue'
import TemplateContent from '@/components/home/TemplateContent/index.vue'
import { useReplacePlaceholders } from '@/hooks/useReplacePlaceholders'
const pageSizeInit = inject('pageSizeInit') as number[]

let loading = ref(false)
const listData = ref<any>(null)
interface ListAbout {
  pageNo: number
  pageSize: number
  pages: number
  total: number
}
const listAboutInit = {
  pageNo: 1,
  pageSize: pageSizeInit[0],
  pages: 0,
  total: 0
}
const listAbout = reactive<ListAbout>({ ...listAboutInit })

const reset = () => {
  Object.assign(listAbout, listAboutInit)
  getNotificationList()
}

const getNotificationList = async () => {
 try{
  loading.value = true
  const params = { page_no: listAbout.pageNo, page_size: listAbout.pageSize }
  const res = await GetNotificationList(params)
  loading.value = false
  if (!res) return
  listAbout.pageNo = res.page_no
  listAbout.pageSize = res.page_size
  listAbout.pages = res.pages
  listAbout.total = res.total
  listData.value = res.result_list
 } catch(e) {
  loading.value = false
  console.error(e)
 }
}
// 其他回调
const updateCurrentSize = (val: number) => {
  listAbout.pageSize = val
  getNotificationList()
}

const updateCurrentPage = (val: number) => {
  listAbout.pageNo = val
  getNotificationList()
}

onMounted(() => {
  getNotificationList()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-table-styles.scss';
.table-center {
    background-color: var(--color-background);
    height: calc(100% - 180px);
    border-radius: 6px;
    padding: 12px;
    margin: 8px;
  }
.right {
  flex: 1;
  text-align: right;
}
</style>
