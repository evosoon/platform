<template>
  <div class="control-panel color flex" v-loading="loading">
    <nav class="search-tool flex">
      <div class="search-item flex">
        <span class="title">关键字搜索</span>
        <el-input
          class="input"
          placeholder="筛选代号 / 模板"
          :prefix-icon="Search"
          v-model.lazy="listAbout.keyword"
          clearable
        />
      </div>

      <div class="search-item flex">
        <span class="title">通知类型</span>
        <el-cascader
          class="input"
          v-model="listAbout.type"
          :options="choose.noteType"
          placeholder="筛选类型"
          filterable
        />
      </div>

      <div class="search-item flex">
        <span class="title">发送渠道</span>
        <el-cascader
          class="input"
          v-model="listAbout.channel"
          :options="choose.channel"
          placeholder="选择渠道"
          filterable
        />
      </div>

      <div class="search-item flex">
        <span class="title">用户组</span>
        <el-cascader
          class="input"
          v-model="listAbout.groupId"
          :options="choose.userGroup"
          placeholder="选择用户组"
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
          <el-button type="primary">+ 新建规则</el-button>
        </template>
        <template v-slot:center>
          <NewConfigRule @success="handleSuccess" />
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
      @rerequest="debounceGetConfigRuleList"
      @update:currentSize="updateCurrentSize"
      @update:currentPage="updateCurrentPage"
    >
      <template #column>
        <el-table-column fixed prop="id" label="ID" width="80" />
        <el-table-column label="规则代号" min-width="140" >
           <template #default="scope">
           <el-tooltip :content="scope.row.code" effect="light">
              <span class="pointer content" v-text="scope.row.code" ></span>
            </el-tooltip>
             </template>
        </el-table-column>
        <el-table-column label="规则描述" width="160">
          <template #default="scope">
            <el-tooltip :content="scope.row.description" effect="light">
              <span class="pointer content" v-text="scope.row.description" ></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="tag" label="通知类型" min-width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.type == 0 ? 'success' : 'error'"
              disable-transitions
              >{{ scope.row.type ? '定时' : '实时' }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="group_name" label="用户组" min-width="160" />
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
                  <span class="pointer inline-block">
                  <img src="@/assets/icons/send.svg" class="icon" alt="" />
                  </span>
                </template>
                <template #center="slotProps">
                  <SendNotification
                    :info="scope.row"
                    @success="handleSuccess"
                    @handleClose="slotProps.handleClose"
                  ></SendNotification>
                </template>
              </Drawer>
              <span style="padding: 5px"></span>
              <Drawer>
                <template v-slot:title>
                  <span class="pointer inline-block">
                  <img src="@/assets/icons/edit.svg" class="icon" alt="" />
                  </span>
                </template>
                <template #center="slotProps">
                  <NewConfigRule
                    :id="scope.row.id"
                    :configRuleInfo="scope.row"
                    @handleClose="slotProps.handleClose"
                    @success="handleSuccess"
                  ></NewConfigRule>
                </template>
              </Drawer>
              <span style="padding: 5px"></span>
              <MessageBox
                @success="delConfigRule(scope.row.id)"
                :message="[scope.row.code, '规则']"
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
import { DelConfigRule, GetConfigRule } from '@/apis/rule/rule'
import { Search } from '@element-plus/icons-vue'
import { GetUserGroupList } from '@/apis/user/userGroup'
// import type { GetBaseListResponse } from '@/apis/models/BaseResponse'
import type {
  GetConfigRuleListDataModel,
  GetConfigRuleListParamsModel
} from '@/apis/rule/models/ruleModel'
import { channelInit, noteTypeInit } from '@/pages/home/configRule/data'
import NewConfigRule from './components/NewConfigRule.vue';
import SendNotification from './components/SendNotification.vue';
// import { GetUserList } from '@/apis/userApis'
// import { channel } from 'diagnostics_channel'
import { useUserStore } from '@/stores/user'
import debounce from '@/utils/base/debounce'
const pageSizeInit = inject('pageSizeInit') as number[]
const userStore = useUserStore()
// loading
const loading = ref(false)
// 列表数据
const listData = ref<any>([])

interface ListAbout {
  pageSize: number
  pageNo: number
  pages: number
  total: number
  keyword: string
  type: number[]
  channel: string[]
  groupId: number[]
  createBy: string
}
// 列表相关
const listAboutInit: ListAbout = {
  pageSize: pageSizeInit[0],
  pageNo: 1,
  pages: 0,
  total: 0,
  keyword: '',
  type: [2],
  channel: [''],
  groupId: [0],
  createBy: ''
}
const listAbout = reactive<ListAbout>({ ...listAboutInit })
// 重置
const reset = () => {
  Object.assign(listAbout, listAboutInit)
  debounceGetConfigRuleList()
}
// 筛选数据
const choose = reactive({
  isCreateBySelf: false,
  channel: channelInit,
  noteType:noteTypeInit,
  userGroup: []
})
// 获取规则
const getConfigRuleList = async () => {
  loading.value = true
  const params: GetConfigRuleListParamsModel = {
    page_no: listAbout.pageNo,
    page_size: listAbout.pageSize
  }

  const data: GetConfigRuleListDataModel = {
    keyword: listAbout.keyword,
    type: listAbout.type[0],
    channel: listAbout.channel[0],
    group_id: listAbout.groupId[0],
    create_by: listAbout.createBy
  }
  const res = await GetConfigRule(params, data)
  loading.value = false
  if (!res) {
    listData.value = null
    return
  }
  const { page_no, page_size, pages, total, result_list } = res
  listData.value = result_list
  Object.assign(listAbout, {
    pageNo: page_no,
    pageSize: page_size,
    pages,
    total
  })
}
// 防止抖动
const debounceGetConfigRuleList = debounce(getConfigRuleList, 600)
// 监听 关键字变化
watch(() => listAbout.keyword, debounceGetConfigRuleList)
// 监听 类型变化
watch(() => listAbout.type, debounceGetConfigRuleList)
// 监听 渠道变化
watch(() => listAbout.channel, debounceGetConfigRuleList)
// 监听 创建人变化
watch(
  () => choose.isCreateBySelf,
  (val) => {
    listAbout.createBy = val ? userStore.username : ''
    debounceGetConfigRuleList()
  }
)
// 监听 用户组变化
watch(()=>listAbout.groupId, debounceGetConfigRuleList)

// 删除规则
const delConfigRule = async (id: number) => {
  if (await DelConfigRule(id)) debounceGetConfigRuleList()
}

// 其他回调
const updateCurrentSize = (val: number) => {
  listAbout.pageSize = val
  debounceGetConfigRuleList()
}

const updateCurrentPage = (val: number) => {
  listAbout.pageNo = val
  debounceGetConfigRuleList()
}

const handleSuccess = () => {
  debounceGetConfigRuleList()
}

const getUserGroupList = async()=>{
   const res  =  await GetUserGroupList()
   if(!res)return
    choose.userGroup = res.result_list.map((item)=>({value: item.id,label:item.name})) as any
}
onMounted(()=>{
  getConfigRuleList()
  getUserGroupList()

})
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
