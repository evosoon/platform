<template>
  <el-drawer
    :model-value="$props.drawer"
    @close="changeDrawer"
    :with-header="false"
    size="600px"
    class="drawer"
  >
    <h3>{{ tempData.id ? '修改' : '新建' }}定时任务</h3>
    <div class="lists">
      <div class="create-box">
        <div class="list">
          <span style="margin-right: 15px">选择规则</span>
          <el-select
            v-model="ruleId"
            size="default"
            style="width: 200px"
            v-load-more="getMore"
            value-key="id"
            :teleported="false"
            :loading="loading"
            @click="firstGet"
            @change="changeInfo"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.code"
              :value="item.id"
            />
          </el-select>
        </div>
        <template v-if="chosen">
          <div class="list">
            <span>发送渠道</span
            ><el-input
              :value="ways[getWayIndex()]"
              style="width: 200px"
              disabled
              placeholder="Please input"
            />
          </div>
          <div class="list">
            <span>发送目标</span
            ><el-input
              :value="rule?.group_name"
              style="width: 200px"
              disabled
              placeholder="未指定发送目标"
            />
          </div>
          <div class="list">
            <span>消息模板</span
            ><el-input
              :value="rule?.template_name"
              style="width: 200px"
              disabled
              placeholder="Please input"
            />
          </div>
          <div class="list">
            <span>消息类型</span
            ><el-input
              :value="ways[getWayIndex()]"
              style="width: 200px"
              disabled
              placeholder="Please input"
            />
          </div>
          <div class="list">
            <span>机器人选择</span>
            <el-input
              :value="ways[getWayIndex()]"
              style="width: 200px"
              disabled
              placeholder="未指定机器人"
            />
          </div>
        </template>
      </div>
      <div class="create-box" style="margin-top: 25px">
        <div class="list">
          <span>推送频次</span>
          <el-radio-group v-model="repeat">
            <el-radio-button label="单次" value="1" />
            <el-radio-button label="重复" value="2" />
          </el-radio-group>
        </div>
        <template v-if="repeat === '1'"
          ><div class="list">
            <span>发送时间</span>
            <el-date-picker
              v-model="time1"
              type="datetime"
              value-format="x"
              placeholder="Start date"
              :teleported="false"
              @change="judgeTime"
              prefix-icon="Calendar"
              :disabled-date="judgeChoose"
            />
          </div>
        </template>
        <template v-else-if="repeat === '2'">
          <div class="list">
            <span>时间范围</span>
            <el-date-picker
              v-model="time2"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="showTimeRange"
              prefix-icon="Calendar"
              value-format="x"
              :disabled-date="judgeChoose"
              style="width: 280px; flex-grow: 0"
            />
          </div>
          <div class="list1">
            <span>重复频率</span>
            <el-select
              v-model="repeatJudge"
              placeholder="请选择"
              style="width: 120px"
              class="timePicker"
            >
              <el-option
                v-for="item in repeatHz"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <el-time-picker
              style="width: 120px"
              v-model="time3"
              placeholder="选择时间"
              suffix-icon="Calendar"
              class="timePicker"
              value-format="x"
            />
          </div>
        </template>
      </div>
    </div>
    <el-button class="button" @click="submit">保存</el-button>
  </el-drawer>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import vLoadMore from '@/utils/vLoad/loadMore'
import { dayjs, ElMessage } from 'element-plus'

import { GetConfigRule } from '@/apis/rule/rule'
import { addTimeTask, updateTimeTask } from '@/apis/timeTask'

const props = defineProps({
  drawer: Boolean,
  hideDrawer: { type: Function, required: true },
  tempData: { type: Object, required: true }
})
console.log(props.tempData)
watch(
  () => props.tempData,
  async (newVal) => {
    console.log(newVal)
    if (newVal.id === null) {
      time1.value = 0
      time2.value = []
      time3.value = 0
      repeat.value = ''
      chosen.value = false
      rule.value = undefined
      template.value = ''
      ruleId.value = null
      return
    }
    await firstGet()
    rule.value = options.value.find((item) => {
      return item.code === props.tempData.rule_code
    })
    ruleId.value = rule.value!.id
    template.value = rule.value!.template_name as string
    chosen.value = true
    if (props.tempData.type === 0) {
      repeat.value = '1'
    } else {
      repeat.value = '2'
      repeatJudge.value === props.tempData.type
    }
    time1.value = props.tempData.task_time * 1000
    time2.value = [
      props.tempData.start_time * 1000,
      props.tempData.end_time * 1000
    ]
    time3.value = props.tempData.task_time * 1000
  }
)

const query = ref({
  page_no: 1,
  page_size: 100
})

const changeDrawer = () => {
  props.hideDrawer()
}

interface ruleType {
  id: number
  code: string | null
  description: string | null
  template_id: number | null
  template_name: string | null
  group_id: number | null
  group_name: string | null
  feishu_status: boolean | null
  sms_status: boolean | null
  email_status: boolean | null
  create_by: string | null
  create_time: string | null
  update_by: string | null
  update_time: string | null
}

const loading = ref(false)
const isFirst = ref(true)
const options = ref<ruleType[]>([])

const ruleId = ref<number | null>(null)

const firstGet = async () => {
  if (!isFirst.value) return
  loading.value = true
  const data = await GetConfigRule(query.value)
  if(!data)return
  isFirst.value = false
  options.value.push(...data.result_list)
  loading.value = false
  if (data.page_no >= data.pages) return
  query.value.page_no++
}

const getMore = async () => {
  const data = await GetConfigRule(query.value)
  if(!data)return

  if (options.value.length >= data.total) return
  if (data.page_no < data.pages) query.value.page_no++
  options.value.push(...data.result_list)
}

const rule = ref<ruleType>()
const ways = ['飞书', '邮箱', '短信']
const chosen = ref(false)
const template = ref('')

const getWayIndex = () => {
  if (rule.value?.feishu_status) return 0
  else if (rule.value?.sms_status) return 2
  else return 1
}

const changeInfo = async () => {
  console.log(rule.value)
  rule.value = options.value.find((item) => {
    return item.id === ruleId.value
  })

  template.value = rule.value?.template_name as string
  chosen.value = true
}

const repeat = ref('')

const time1 = ref(0)
const time2 = ref<number[]>([])
const time3 = ref(0)

const judgeChoose = (value: Date): boolean => {
  console.log()
  let time: string = dayjs(value).format('YYYY-MM-DD')
  let curTime = dayjs().format('YYYY-MM-DD')
  return time < curTime
}

const judgeTime = (value: Date) => {
  console.log(typeof dayjs(value).valueOf())
  const choose = dayjs(value).valueOf()
  const time = dayjs(new Date()).valueOf() + 600000
  if (choose < time) {
    ElMessage.error('请至少选择10分钟以后的时间!!!')
    time1.value = time
  }
}

const showTimeRange = (value: [Date, Date]) => {
  console.log(value)
}

type reHz = {
  label: string
  value: number
}

const repeatHz = ref<reHz[]>([
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

const repeatType = ref<number>(0)

const repeatJudge = ref<number>(8)

const validate = (): boolean => {
  if (rule.value === undefined) {
    ElMessage.error('请选择规则！！！')
    return false
  }
  if (repeat.value === '1') {
    if (time1.value === 0) {
      ElMessage.error('请选择推送时间！！！')
      return false
    }
  } else if (repeat.value === '2') {
    repeatType.value = repeatJudge.value ? repeatJudge.value : 0
    if (
      time2.value.length === 0 ||
      time3.value === 0 ||
      repeatType.value === 0
    ) {
      ElMessage.error('请检查时间的选择！！！')
      return false
    }
  } else {
    ElMessage.error('请选择推送频次！！！')
    return false
  }
  return true
}

interface paramType {
  id?: number | null
  start_time?: number
  task_time: number
  end_time?: number
  task_type: number
  notification: {
    code: string
    uid_list: null
    extra_data: null
    params: null
    access_token: null
  }
}

const submit = async () => {
  if (validate()) {
    if (repeat.value === '1') {
      const params: paramType = {
        id: props.tempData.id,
        start_time: time1.value / 1000,
        task_time: time1.value / 1000,
        end_time: time1.value / 1000,
        task_type: 0,
        notification: {
          code: rule.value!.code as string,
          uid_list: null,
          extra_data: null,
          params: null,
          access_token: null
        }
      }

      const { result_code } = props.tempData.id
        ? await updateTimeTask(params)
        : await addTimeTask(params)
      if (result_code === 'success') props.hideDrawer()
    } else {
      let targetTime = 0
      let time = new Date()
      let curTime = dayjs(time).valueOf()
      let today = time.getDay()
      if (time2.value[0] > curTime) {
        let tempTime1: Date = new Date(time2.value[0])
        let tempTime2: Date = new Date(time3.value)
        let date = tempTime1.getDate()
        let month = tempTime1.getMonth()
        let year = tempTime1.getFullYear()
        tempTime2.setFullYear(year)
        tempTime2.setMonth(month)
        tempTime2.setDate(date)
        targetTime = dayjs(tempTime2).valueOf()
      } else {
        if (curTime <= time3.value) {
          targetTime = time3.value
        } else {
          let target = today - repeatJudge.value
          if (repeatJudge.value === 8) {
            targetTime = dayjs(time3.value).add(1, 'day').valueOf()
          } else if (target >= 0)
            targetTime = dayjs(time3.value)
              .add(7 - target, 'day')
              .valueOf()
          else targetTime = dayjs(time3.value).add(-target, 'day').valueOf()
        }
      }

      const params: paramType = {
        id: props.tempData.id,
        start_time: time2.value[0] / 1000,
        end_time: time2.value[1] / 1000,
        task_time: targetTime / 1000,
        task_type: repeatJudge.value,
        notification: {
          code: rule.value!.code as string,
          uid_list: null,
          extra_data: null,
          params: null,
          access_token: null
        }
      }
      const { result_code } = props.tempData.id
        ? await updateTimeTask(params)
        : await addTimeTask(params)
      if (result_code === 'success') props.hideDrawer()
    }
  }
}
</script>
<style lang="scss" scoped>
.drawer {
  .el-drawer__body {
    padding: 0 20px;
  }
}
.lists {
  margin-top: 30px;
  box-sizing: border-box;

  padding: 0 20px;
  height: 490px;
  width: 100%;
  display: flex;
  flex-direction: column;
  .create-box {
    width: 100%;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 25px 10px;
    border: 1px solid #dfdfdf;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    :last-child {
      margin-bottom: 0;
    }
  }
  .list {
    width: 100%;
    margin-left: 20px;
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    span {
      margin-right: 15px;
      width: 100px;
    }
    .timePicker {
      ::v-deep(.el-select__wrapper) {
        border: none;
        box-shadow: none;
      }
    }
  }
  .list1 {
    width: 100%;
    margin-left: 20px;
    display: flex;
    align-items: center;
    span {
      margin-right: 15px;
      width: 100px;
    }
    .timePicker {
      ::v-deep(.el-select__wrapper) {
        border: none;
        // box-shadow: none;
        border-radius: 1;
      }
    }
    ::v-deep(.el-input__wrapper) {
      border: none;
      // box-shadow: none;
      border-radius: 1;
    }
  }
}
.button {
  position: absolute;
  bottom: 10px;
  right: 40px;
  background-color: #6963f6;
  color: #fff;
  width: 120px;
  height: 40px;
  font-weight: bold;
}
</style>
