<template>
  <div class="info-log" v-loading="loading">
    <div class="form-header">
      <div class="form-options color">
        <div class="log-grade">
          <span class="title">日志等级</span>
          <el-select
            v-model="grade"
            placeholder="日志等级"
            style="width: 240px;height: 30px"
            clearable
            @change="onSelectChange"
          >
            <el-option
              v-for="item in choices"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="time-range">
          <span class="title">时间范围</span
          ><el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeTime"
            size="large"
            format="YYYY-MM-DD"
            prefix-icon="Calendar"
            style="flex-grow: 0;height: 30px;"
          />
        </div>
        <div class="full-search">
          <span class="title">全局搜索</span>
          <el-input
            v-model="keyword"
            style="width: 400px;height: 30px;"
            placeholder="请输入关键字或TID"
            suffix-icon="Search"
            size="large"
            clearable
          />
        </div>
      </div>
      <div class="form-charts color">
        <div class="title">日志统计</div>
        <div class="charts">
          <bar-chart :options="chartOptions"></bar-chart>
        </div>
        <div class="info">
          <span>共{{ total }}条数据</span>
        </div>
        <div class="refresh" @click="refresh">
          <el-icon size="28" color="#707070">
            <RefreshRight />
          </el-icon>
        </div>
      </div>
    </div>
    <div class="form-table">
      <el-table
        :data="tableData"
        height="calc(100vh - 375px)"
        style="
          width: 100%;
          border-radius: 6px 6px 0 0;
          font-family: 'Consola';
        "
        border
        stripe
        :header-cell-style="{
          backgroundColor: '#eceafda6',
          height: '40px',
          fontSize: '16px',
          color: '#403576',
          fontWeight: 'bold'
        }"
        ref="table"
        :cell-style="judgeLevel"
        @row-click="changeExpand"
        :row-key="getRowKey"
        :expand-row-keys="expands"
        @expand-change="expandChange"
      >
        <el-table-column type="expand">
          <template #default="props">
            <div class="inner">
              <div class="time">
                <span class="title">时间</span>
                <div class="content">
                  {{
                    dayjs(props.row.timestamp).format('YYYY-MM-DD hh:mm:ss:ms')
                  }}
                </div>
              </div>
              <div class="thread">
                <span class="title">线程</span>
                <div class="content">{{ props.row.thread }}</div>
              </div>
              <div class="method">
                <span class="title">来源</span>
                <div class="content">{{ props.row.method }}</div>
              </div>
              <div class="level">
                <span class="title">等级</span>
                <div
                  class="content"
                  :style="{
                    color:
                      props.row.level === 'INFO'
                        ? ''
                        : props.row.level === 'WARN'
                          ? '#f0cf83'
                          : '#ed6d69'
                  }"
                >
                  {{ props.row.level }}
                </div>
              </div>
              <div class="message">
                <span class="title">内容</span>
                <div class="content">{{ props.row.message }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="timestamp">
          <template #default="scope"
            >{{ dayjs(scope.row.timestamp).format('YYYY-MM-DD HH:mm:ss:ms') }}
          </template>
        </el-table-column>
        <el-table-column label="来源" prop="method" />
        <el-table-column label="内容" prop="message" />
        <el-table-column label="追踪码" prop="trace_id">
          <template #default="scope">
            <span class="trace_id" @click.stop="toInput(scope.row.trace_id)">{{
              scope.row.trace_id
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span class="toTop" @click="toTop" v-show="toTopShow">
        <el-icon size="30" color="#707070">
          <Top />
        </el-icon>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  onMounted,
  ref,
  nextTick,
  watch,
  defineAsyncComponent,
  onUnmounted
} from 'vue'
import { dayjs } from 'element-plus'
import { debounce } from 'lodash'
import { GetLog, GetHistory } from '@/apis/getLog'
import { useRoute} from 'vue-router';
const route = useRoute();
onMounted(()=>{
  keyword.value = route.query.id as string
})

const BarChart = defineAsyncComponent(
  () => import('@/components/Charts/ECharts.vue')
)

let internal: number = 3000

const grade = ref<string>('')

type choice = {
  value: string
  label: string
}

const choices = ref<choice[]>([
  { value: 'info', label: 'INFO' },
  { value: 'warn', label: 'WARN' },
  { value: 'error', label: 'ERROR' }
])

const time = ref<[]>([])

const changeTime = (val: any) => {
  if (val === null) {
    options.value.start_time = null
    options.value.end_time = null
    console.log(options.value)
    filterGetLog()
  } else {
    options.value.start_time = dayjs(val[0]).valueOf()
    options.value.end_time = dayjs(val[1]).valueOf()
    console.log(options.value)
    filterGetLog()
  }
}
type logOptions = {
  start_time: number | null
  end_time: number | null
  level: string
  keyword: string
  start_log_id: string | null
  end_log_id: string | null
}

const options = ref<logOptions>({
  start_time: null,
  end_time: null,
  level: '',
  keyword: '',
  start_log_id: null,
  end_log_id: null
})

type data = {
  id: string
  trace_id: number
  timestamp: number
  level: string
  thread: string
  method: string
  message: string
}

const tableData = ref<data[]>([])

const table = ref()

let scrollTable: any = null

let couldGet = true

const judgeLevel = (data: any) => {
  if (data.row.level === 'INFO') return {}
  else if (data.row.level === 'WARN')
    return { whiteSpace: 'nowrap', background: '#FFF1D7' }
  else return { whiteSpace: 'nowrap', background: '#FFEAE5' }
}

const onSelectChange = (data: string) => {
  options.value.level = data
  console.log(options.value)
  filterGetLog()
}

const keyword = ref<string>('')

function onInput(data: string) {
  options.value.keyword = data
  console.log(options.value)
  filterGetLog()
}

const serach = debounce(onInput, 500)

const toInput = (data: number) => {
  let str = data.toString()
  keyword.value = str
}

watch(keyword, (newVal) => {
  serach(newVal)
})

let loading = ref<boolean>(true)
let isFiltering = ref<boolean>(false)

let filterTimer: any

watch(options.value, () => {
  isFiltering.value = true
  clearTimeout(filterTimer)
  filterTimer = setTimeout(() => {
    isFiltering.value = false
    console.log(isFiltering.value)
  }, 3000)
})

const firstGet = async () => {
  let { result_code, data } = await GetLog(options.value)
  loading.value = false
  if (result_code === 'success') {
    tableData.value = data
    options.value.end_time = null
    setTimeout(() => {
      pollingGetLog()
    }, internal)
  } else {
    setTimeout(() => {
      loading.value = true
      firstGet()
    }, 2000)
  }
}

let polling = ref<boolean>(false)
let destroy = false

const pollingGetLog = () => {
  if (scrollTable.scrollTop <= 100) {
    polling.value = true
    let option = JSON.parse(JSON.stringify(options.value))
    option.start_log_id = tableData.value[0]?.id
    GetLog(option).then(({ result_code, data }) => {
      if (!isFiltering.value) {
        if (result_code === 'success') {
          if (data.length === 0) {
            internal = Math.min(internal + 1000, 8000)
          } else {
            tableData.value.unshift(...data)
            internal = 3000
          }
        }
      }
      if (!destroy) {
        setTimeout(() => {
          pollingGetLog()
        }, internal)
      }
    })
  } else polling.value = false
}

const getMore = async () => {
  let option = JSON.parse(JSON.stringify(options.value))
  option.end_log_id = tableData.value[tableData.value.length - 1].id
  let { result_code, data } = await GetLog(option)
  if (result_code === 'success') tableData.value.push(...data)
  couldGet = true
}

const filterGetLog = async () => {
  internal = 3000
  loading.value = true
  if (options.value.end_time === null) {
    let curTime: number = dayjs(new Date()).valueOf()
    options.value.end_time = curTime
  }
  let { result_code, data } = await GetLog(options.value)
  console.log(result_code, data)
  if (result_code === 'success') {
    tableData.value = data
  }
  loading.value = false
  if (!polling.value) {
    setTimeout(() => {
      pollingGetLog()
    }, internal)
  }
}

const expands = ref<any[]>([])

const getRowKey = (row: any) => {
  return row.id
}

const changeExpand = (row: any) => {
  let curId = expands.value.pop()
  if (curId === row.id) {
    return
  }
  expands.value.push(row.id)
}



const expandChange = (row: any, expandedRows: any) => {
  if (expandedRows.length === 2) {
    expands.value.pop()
    expands.value.push(row.id)
  } else if (expandedRows.length === 1) {
    expands.value.push(row.id)
  } else {
    console.log('none')
    expands.value.pop()
  }
}

let infoData: any = []
let warnData: any = []
let errorData: any = []

const barTime = ref<string[]>(['', '', '', '', '', '', ''])

const chartOptions = ref<any>({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: '0',
    bottom: '10',
    selected: {
      WARN: false,
      ERROR: false
    },
    data: ['INFO', 'WARN', 'ERROR']
  },
  xAxis: {
    type: 'category',
    data: [
      '04-07 20:27',
      '04-07 20:27',
      '04-07 20:27',
      '04-07 20:27',
      '04-07 20:27',
      '04-07 20:27',
      '04-07 20:27'
    ]
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'bar',
      name: 'INFO',
      color: 'rgba(176, 205, 216,0.7)'
    },
    {
      data: [],
      type: 'bar',
      name: 'WARN',
      color: 'rgba(244, 190, 125,0.7)'
    },
    {
      data: [],
      type: 'bar',
      name: 'ERROR',
      color: 'rgba(238, 121, 117,0.7)'
    }
  ],
  grid: {
    right: '10px',
    left: '120px',
    bottom: 30,
    top: 30
  }
})

const total = ref<number>(0)

const getBarData = async () => {
  const { data } = await GetHistory()
  const now = new Date().getTime()
  total.value = 0
  let arr: string[] = []
  for (let i = 0; i < 7; i++) {
    let curTime = now - i * 60 * 60 * 1000
    let time = dayjs(curTime).format('MM-DD HH:mm')
    arr.push(time)
  }
  barTime.value = arr.reverse()
  chartOptions.value.xAxis.data = barTime.value
  if (data.length === 0) return
  infoData = []
  warnData = []
  errorData = []
  data.map((item: any) => {
    infoData.push(item.info_count)
    warnData.push(item.warn_count)
    errorData.push(item.error_count)
    total.value += item.info_count + item.warn_count + item.error_count
  })
  chartOptions.value.series[0].data = [...infoData].reverse()
  chartOptions.value.series[1].data = [...warnData].reverse()
  chartOptions.value.series[2].data = [...errorData].reverse()
  chartOptions.value.series[0].data = [...infoData].reverse()
  chartOptions.value.series[1].data = [...warnData].reverse()
  chartOptions.value.series[2].data = [...errorData].reverse()
}

const refresh = () => {
  getBarData()
}

const toTopShow = ref<boolean>(false)
let scrollTrigger = false

const toTop = () => {
  if (scrollTrigger) return

  scrollTrigger = true
  let scrollTop = scrollTable.scrollTop
  let steep = 0

  let timer = setInterval(() => {
    scrollTop -= steep
    steep += 5
    if (scrollTop <= 0) {
      clearInterval(timer)
      scrollTrigger = false
      scrollTop = 0
    }
    scrollTable.scrollTop = scrollTop
  }, 10)
}

onMounted(async () => {
  console.log(destroy)
  let curTime: number = dayjs(new Date()).valueOf()
  options.value.end_time = curTime
  firstGet()
  getBarData()
  nextTick(() => {
    scrollTable =
      table.value.layout.table.refs.bodyWrapper.firstElementChild
        .firstElementChild
    scrollTable.addEventListener('scroll', () => {
      if (
        scrollTable.scrollTop + scrollTable.clientHeight >=
          scrollTable.scrollHeight - 40 &&
        couldGet
      ) {
        couldGet = false
        getMore()
      } else if (scrollTable.scrollTop <= 100 && !polling.value) {
        internal = 3000
        pollingGetLog()
      }
      if (scrollTable.scrollTop > 100) {
        toTopShow.value = true
      } else {
        toTopShow.value = false
      }
    })
  })
})
onUnmounted(() => {
  destroy = true
})
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'Consola';
  src: url('@/assets/fonts/consola-1.ttf');
}
.info-log {
  height: 100%;
  padding: 8px;
  border-radius: 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .form-header {
    height: 260px;
    min-width: 1000px;
    width: 100%;
    display: flex;
    flex-shrink: 0;
    .form-options,
    .form-charts {
      height: 100%;
      flex: 1;
      background-color: #ffffff;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 40px 30px;
    }
    .form-options {
      margin-right: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .log-grade,
      .time-range,
      .full-search {
        height: 30px;
        width: 520px;
        display: flex;
        align-items: center;
        .title {
          font-size: 18px;
          font-weight: bold;
          margin-right: 20px;
          width: 80px;
        }
        ::v-deep(.el-date-editor .el-range__icon) {
          font-size: 18px;
        }
        ::v-deep(.el-range-editor--large .el-range-separator) {
          font-size: 14px;
          line-height: 40px;
          color: var(--el-text-color-placeholder);
        }
        ::v-deep(.el-input .el-input__icon) {
          font-size: 18px;
        }
      }
    }
    .form-charts {
      padding: 20px 30px;
      display: flex;
      flex-direction: column;
      position: relative;
      .title {
        font-size: 20px;
        font-weight: bold;
      }
      .charts {
        flex-grow: 1;
        width: 100%;
      }
      .info {
        position: absolute;
        width: 160px;
        height: 70px;
        left: 33px;
        top: 25%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        span {
          font-weight: bold;
          font-size: 14px;
        }
      }
      .refresh {
        position: absolute;
        right: 35px;
        top: 20px;
        cursor: pointer;
      }
    }
  }
  .form-table {
    position: relative;
    margin-top: 10px;
    height: calc(100vh - 350px);
    width: 100%;
    background: #ffffff;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 10px;
    ::v-deep(.el-table__header th .cell) {
      font-weight: bold;
    }
    ::v-deep(.cell) {
      white-space: nowrap;
    }
    .inner {
      box-sizing: border-box;
      padding: 10px 30px;
      background-color: #fbfbfb;
      width: 100%;
      overflow: scroll;
      width: 100%;
      overflow: scroll;
      .time,
      .thread,
      .method,
      .level,
      .message {
        width: 100%;
        .title {
          font-weight: bold;
          margin-right: 25px;
          width: 28px;
          display: inline-block;
          flex-shrink: 0;
        }
        display: flex;
        margin-bottom: 10px;
      }
      .message {
        .content {
          padding-right: 20px;
        }
      }
    }
    .trace_id {
      cursor: pointer;
    }
    .trace_id:hover {
      color: #895ded;
    }
    .trace_id:active {
      color: #5230a1;
    }
    .toTop {
      height: 40px;
      width: 40px;
      position: absolute;
      background: #eceafb;
      bottom: 38px;
      right: 32px;
      z-index: 10;
      border-radius: 50%;
      cursor: pointer;
      .el-icon {
        margin-top: 6px;
        margin-left: 4px;
      }
    }
  }
}
</style>
