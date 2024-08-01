<template>
  <Zero></Zero>
  <template v-if="false">
    <div class="control-panel color flex">
    <nav class="search-tool flex">
      <div class="search-item flex">
        <span class="title">发送渠道</span>
        <el-select
          v-model="way"
          placeholder="选择渠道"
          style="width: 180px"
          clearable
          @change="changeInfo"
          @clear="clearChannel"
        >
          <el-option
            v-for="item in sendWay"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
      </div>
      <div class="search-item flex">
        <span class="title">用户组</span>
        <el-select
          v-model="getParams.group_id"
          placeholder="选择用户组"
          style="width: 180px"
          clearable
          v-load-more="getMore"
          @click="firstGet"
          @clear="getParams.group_id = null"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="search-item flex">
        <span class="title">发送频次</span>
        <el-select
          v-model="getParams.task_type"
          placeholder="选择频次"
          style="width: 180px"
          clearable
          @clear="getParams.task_type = null"
        >
          <el-option
            v-for="item in repeatHz"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </nav>
    <nav class="create-tool flex">
      <el-checkbox v-model="isMine" label="我创建的" style="margin-right: 10px;" />
      <el-button  @click="reset">
       重置
      </el-button>
      <el-button type="primary" @click="showDrawer('create')">
        <span>+ 新建任务</span>
      </el-button>
    </nav>
  </div>
  <div class="time-task">
    <div class="time-body">
      <el-table
        :data="tableData"
        :header-cell-style="{
          backgroundColor: '#eceafd',
          height: '60px',
          fontSize: '16px',
          color: '#403576',
          fontWeight: 'bold',
          textAligin: 'center'
        }"
        style="
          width: 100%;
          border-radius: 15px 15px 0 0;
          box-sizing: border-box;
          border: 1px solid #f2f2f4;
          height: calc(100vh - 300px);
        "
        stripe
      >
        <el-table-column
          label="规则代号"
          prop="rule_code"
          width="180px"
        ></el-table-column>
        <el-table-column label="发送渠道" prop="channel">
          <template #default="scope">
            <span
              class="table-send"
              :class="
                scope.row.channel?.feishu
                  ? 'feishu'
                  : scope.row.channel?.sms
                    ? 'sms'
                    : scope.row.channel?.email
                      ? 'email'
                      : ''
              "
            >
              {{
                scope.row.channel?.feishu
                  ? '飞书'
                  : scope.row.channel?.sms
                    ? '短信'
                    : scope.row.channel?.email
                      ? '邮箱'
                      : '暂无'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="用户组" prop="goal"></el-table-column>
        <el-table-column label="开始时间" width="150px" prop="start_time">
          <template #default="scope">
            <div>
              {{
                dayjs(scope.row.start_time * 1000).format('YYYY/MM/DD HH:mm')
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" width="150px" prop="end_time">
          <template #default="scope">
            <div>
              {{ dayjs(scope.row.end_time * 1000).format('YYYY/MM/DD HH:mm') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="推送频次" prop="type" width="140px">
          <template #default="scope">
            <div
              style="font-size: 12px"
              class="hz"
              :class="repeatClass[getRepeat(scope.row)]"
            >
              <span>
                {{
                  repeatHz.find((item) => {
                    return item.value === scope.row.type
                  })?.label
                }}
              </span>

              <span>{{
                getRepeat(scope.row) === 0
                  ? dayjs(scope.row.task_time * 1000).format('MM-DD HH:mm')
                  : dayjs(scope.row.task_time * 1000).format('HH:mm')
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建信息" width="150px">
          <template #default="scope">
            <div>{{ scope.row.create_by }}</div>
            <div>
              {{
                dayjs(scope.row.create_time * 1000).format('YYYY/MM/DD HH:mm')
              }}
              <!-- {{ scope.row.create_time }} -->
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作项" width="120">
          <template #default="scope">
            <div class="scope" style="justify-content: center">
              <svg
                t="1711597152538"
                class="icon"
                viewBox="0 0 1025 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2857"
                width="16"
                height="16"
                style="margin-right: 20px"
                @click="editTimeTask(scope.row)"
              >
                <path
                  d="M88.604692 653.05608 716.4014 25.749546c34.4886-34.484498 78.86478-34.178908 113.04779 0.002051l169.577838 169.444526c34.180959 34.18301 34.486549 78.479203 0 112.96165L371.23237 935.464308 58.585089 1021.938074c-43.367117 9.243585-65.765429-13.119861-56.525946-56.480825L88.604692 653.05608M151.143993 703.525601 87.349517 936.715381l233.370262-63.745253L151.143993 703.525601M914.239134 279.914285c29.307927-29.067967 27.521558-28.583945 0.002051-56.480825l-113.051892-112.96165c-26.797577-28.569588-29.476104-28.807497-56.525946 0l-113.051892 112.96165 169.577838 169.444526L914.239134 279.914285zM377.247776 816.489303l367.415572-367.130491-169.575787-169.442476L207.669938 647.044776C224.104117 663.48921 319.21644 758.472324 377.247776 816.489303z"
                  p-id="2858"
                  fill="#8a8a8a"
                ></path>
              </svg>
              <svg
                @click="deleteItem(scope.row)"
                t="1711597294660"
                class="icon"
                viewBox="0 0 1039 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3064"
                width="16"
                height="16"
              >
                <path
                  d="M887.212614 360.983541c0-19.847024-16.087397-35.936467-35.935444-35.936467-19.84293 0-35.931351 16.08535-35.933397 35.928281l-0.00307 0 0 551.302121c0 13.213953-10.747785 23.956621-23.956621 23.956621L232.061286 936.234097c-13.20986 0-23.957645-10.742668-23.957645-23.956621L208.103642 361.215832c0-0.071631 0.010233-0.138146 0.010233-0.209778 0-19.846-16.089443-35.935444-35.936467-35.935444-19.835767 0-35.917024 16.075117-35.935444 35.905768l-0.011256 0 0 551.302121c0 52.842509 42.989093 95.828532 95.829556 95.828532l559.321772 0c52.839439 0 95.828532-42.987047 95.828532-95.828532L887.210567 361.02038C887.212614 361.005031 887.212614 360.995821 887.212614 360.983541z"
                  p-id="3065"
                  fill="#707070"
                ></path>
                <path
                  d="M409.856645 838.332347c-19.847024 0-35.936467-16.089443-35.936467-35.935444L373.920178 360.975355c0-19.846 16.089443-35.936467 35.936467-35.936467 19.847024 0 35.936467 16.090467 35.936467 35.936467l0 441.420525C445.793112 822.242903 429.702646 838.332347 409.856645 838.332347z"
                  p-id="3066"
                  fill="#707070"
                ></path>
                <path
                  d="M613.588723 838.332347c-19.847024 0-35.936467-16.089443-35.936467-35.935444L577.652256 360.975355c0-19.846 16.090467-35.936467 35.936467-35.936467s35.935444 16.090467 35.935444 35.936467l0 441.420525C649.524167 822.242903 633.434723 838.332347 613.588723 838.332347z"
                  p-id="3067"
                  fill="#707070"
                ></path>
                <path
                  d="M987.097532 155.264203 819.301921 155.264203 819.301921 115.272373c0-52.840462-42.990117-95.829556-95.829556-95.829556L299.974026 19.442818c-52.841485 0-95.829556 42.989093-95.829556 95.829556l0 39.99183L36.347836 155.264203c-19.847024 0-35.936467 16.089443-35.936467 35.936467 0 19.846 16.089443 35.935444 35.936467 35.935444l950.749696 0c19.848047 0 35.936467-16.090467 35.936467-35.935444C1023.033999 171.353646 1006.944556 155.264203 987.097532 155.264203zM276.016381 115.272373c0-13.208836 10.746762-23.957645 23.957645-23.957645l423.49834 0c13.208836 0 23.957645 10.747785 23.957645 23.957645l0 39.99183L276.016381 155.264203 276.016381 115.272373z"
                  p-id="3068"
                  fill="#707070"
                ></path>
              </svg>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="getParams.page_no"
        v-model:page-size="getParams.page_size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>
  </div>
  <create-drawer :drawer :hideDrawer :tempData></create-drawer>
  </template>
  
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { getGroup, getTimeTaskList, deleteTimeTask } from '@/apis/timeTask'
import { dayjs } from 'element-plus'

const drawer = ref(false)

const showDrawer = (type: string) => {
  if (type === 'create')
    tempData.value = {
      id: null,
      rule_code: null,
      channel: null,
      goal: null,
      start_time: null,
      end_time: null,
      task_time: null,
      type: null,
      create_by: null,
      create_time: null
    }
  drawer.value = true
}

const hideDrawer = () => {
  drawer.value = false
}
const isMine = ref(false)

type tableDataType = {
  id: number | null
  rule_code: string | null
  channel: {
    feishu: boolean
    sms: boolean
    email: boolean
  } | null
  goal: string | null
  start_time: number | null
  end_time: number | null
  task_time: number | null
  type: number | null
  create_by: string | null
  create_time: number | null
}

const tableData = ref<tableDataType[]>([
  {
    id: 0,
    rule_code: '114514',
    channel: {
      feishu: false,
      sms: false,
      email: false
    },
    goal: '打扫卫生群',
    start_time: 0,
    end_time: 0,
    task_time: 0,
    type: 0,
    create_by: '阿为',
    create_time: 0
  }
])

const query = ref({
  page_no: 1,
  page_size: 20
})

const way = ref('')

const sendWay = ref<{ label: string }[]>([
  { label: '飞书' },
  { label: '短信' },
  { label: '邮箱' }
])

const changeInfo = (value: string) => {
  switch (value) {
    case '飞书':
      getParams.value.channel = {
        feishu: true,
        sms: false,
        email: false
      }
      break
    case '邮箱':
      getParams.value.channel = {
        feishu: false,
        sms: false,
        email: true
      }
      break
    case '短信':
      getParams.value.channel = {
        feishu: false,
        sms: true,
        email: false
      }
      break
  }
}

const clearChannel = () => {
  getParams.value.channel = {
    feishu: false,
    sms: false,
    email: false
  }
}

interface groupType {
  id: number
  name: string
  create_by: string
  create_time: string
  update_by: string
  update_time: string
  is_deleted: number
}

const loading = ref(false)
const isFirst = ref(true)
const options = ref<groupType[]>([])

const firstGet = async () => {
  if (!isFirst.value) return
  loading.value = true
  const data = await getGroup(query.value)
  isFirst.value = false
  options.value.push(...data.result_list)
  loading.value = false
  if (data.page_no >= data.pages) return
  query.value.page_no++
}

const getMore = async () => {
  const data = await getGroup(query.value)
  console.log(data)
  if (options.value.length >= data.total) return
  if (data.page_no < data.pages) query.value.page_no++
  options.value.push(...data.result_list)
}

type reHz = {
  label: string
  value: number
}

const getRepeat = (val: tableDataType): number => {
  const value = repeatHz.value.find((item) => {
    return item.value === val.type
  })!.value
  let res = 0
  switch (value) {
    case 0:
      res = 0
      break
    case 8:
      res = 1
      break
    default:
      res = 2
      break
  }
  return res
}

const repeatClass: [string, string, string] = [
  'norepeat',
  'everyday',
  'weekday'
]

const repeatHz = ref<reHz[]>([
  {
    label: '单次',
    value: 0
  },
  {
    label: '周一',
    value: 1
  },
  {
    label: '周二',
    value: 2
  },
  {
    label: '周三',
    value: 3
  },
  {
    label: '周四',
    value: 4
  },
  {
    label: '周五',
    value: 5
  },
  {
    label: '周六',
    value: 6
  },
  {
    label: '周日',
    value: 7
  },
  {
    label: '每天',
    value: 8
  }
])

const getParams = ref({
  page_no: 1,
  page_size: 10,
  channel: {
    feishu: false,
    sms: false,
    email: false
  },
  group_id: null,
  task_type: null,
  is_create: null,
  sort_type: 0
})

watch(getParams.value, () => {
  console.log(getParams.value)
  getData()
})

const reset = () => {
  way.value = ''
  Object.assign(getParams.value, {
    page_no: 1,
    page_size: 15,
    channel: {
      feishu: false,
      sms: false,
      email: false
    },
    group_id: null,
    task_type: null,
    is_create: null,
    sort_type: 0
  })
}

const total = ref(100)

const getData = async () => {
  const { result_code, data } = await getTimeTaskList(getParams.value)
  if (result_code === 'success') {
    console.log(data.result_list)
    tableData.value = data.result_list
    total.value = data.total
  }
}

const tempData = ref<tableDataType>({
  id: null,
  rule_code: null,
  channel: null,
  goal: null,
  start_time: null,
  end_time: null,
  task_time: null,
  type: null,
  create_by: null,
  create_time: null
})

const editTimeTask = (value: tableDataType) => {
  console.log(value)
  tempData.value = value
  console.log(tempData.value)
  showDrawer('edit')
}

const deleteItem = async (item: tableDataType) => {
  console.log(item)
  const { data } = await deleteTimeTask({ id: item.id as number })
  if (data) {
    // ElMessage.success('删除成功')
    getData()
  } else {
    // ElMessage.error('删除失败')
  }
}

onMounted(async () => {
  getData()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/base-table-styles.scss';

@font-face {
  font-family: 'Consola';
  src: url('@/assets/fonts/consola-1.ttf');
}
.time-task {
  height: 100%;
  width: 100%;
  min-width: 1250px;
  background: #f2f3f8;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .time-top,
  .time-body {
    width: 100%;
    height: 110px;
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 13px;
    box-sizing: border-box;
    padding: 20px 20px;
  }

  .time-top {
    display: flex;
    justify-content: space-between;
    .time-options,
    .time-button {
      height: 100%;
    }
    .time-options {
      flex-grow: 1;
      display: flex;
      align-items: end;
      margin-right: 50px;
      .title {
        font-weight: 600;
        font-size: 17px;
      }
      .keyword,
      .sendway,
      .sendTarget,
      .sendhz {
        margin-right: 20px;
      }
      .keyword {
        width: 27%;
        min-width: 240px;
      }
    }

    .time-button {
      width: 220px;
      display: flex;
      align-items: end;
      .el-button {
        width: 110px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-icon {
          margin-right: 4px;
          font-weight: bold;
        }
        span {
          font-weight: bold;
        }
      }
    }
  }

  .time-body {
    flex-grow: 1;
    margin-bottom: 0;
    ::v-deep(.el-table th),
    ::v-deep(.el-table tr),
    ::v-deep(.el-table td) {
      height: 45px;
      border: 0;
      background-color: var(--color-background);
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .hz {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      border-width: 1px;
      border-style: solid;
      padding: 3px 20px;
      border-radius: 3px;
    }
    .norepeat {
      padding: 3px 8px;
      border-color: #c4e1a6;
      color: #add37d;
      background-color: #eefdec;
    }
    .everyday {
      border-color: #b5c0f2;
      color: #91a1ec;
      background-color: #eff1fc;
    }
    .weekday {
      border-color: #f6cd9b;
      color: #f3c182;
      background-color: #fcefdd;
    }
    .scope {
      height: 100%;
      display: flex;
      svg {
        cursor: pointer;
      }
    }
    .table-send {
      display: inline-block;
      padding: 1px 15px;
      border-radius: 3px;
    }
    .feishu {
      color: #94a3ec;
      background-color: #eff1fc;
      border: 1px solid #acb8f1;
    }
    .sms {
      color: #f3c27f;
      background-color: #fcefdd;
      border: 1px solid #f4c992;
    }
    .email {
      color: #a4cc6b;
      background-color: #eefdec;
      border: 1px solid #b8da93;
    }
    .el-pagination {
      margin-top: 12px;
      justify-content: flex-end;
    }
  }
}
</style>
