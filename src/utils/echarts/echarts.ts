// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'

// 引入柱状图和饼状图图表，图表后缀都为 Chart，具体为 图标名称+Chart （注意图标名称为首字母大写）
import { BarChart } from 'echarts/charts'

// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
  BarChart,
  GridComponent
])

// 导出
export default echarts
