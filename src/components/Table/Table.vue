<template>
  <div class="data-table flex">
    <!-- Table with Loading -->
    <el-table
      :data="props.data"
      class="el-table-i"
      :style="props.style"
      :height="props.height"
      :max-height="props.height"
      v-bind="$attrs"
      stripe
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      :header-cell-style="props.headerCellStyle"
      v-loading="loading"
    >
     <template #empty>
        <slot name="empty">
          <DummyStatus :data="props.data" @request="handleRequest"></DummyStatus>
        </slot>
     </template>
      <el-table-column type="selection" v-if="props.selectable" />
      <slot name="column"></slot>
      
    </el-table>
    <footer v-if="pagination" class="flex footer">
      <div>
        <slot name="footer"></slot>
      </div>
      <el-pagination
        :current-page="listAbout.pageNo"
        :page-size="listAbout.pageSize"
        :page-sizes="pageSizeInit"
        :total="listAbout.total"
        :layout="props.layout"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </footer>
  </div>
</template>

<script setup lang="ts">
import DummyStatus from './components/DummyStatus.vue';
import { ref, computed, watch, defineProps, defineEmits, inject } from 'vue'
const pageSizeInit = inject('pageSizeInit') as number[]


const props = defineProps({
  data: {
    type: Array as () => Record<string, any>[],
    required: true
  },
  selectable:{
    type: Boolean,
    required: false,
    default:false
  },
  listAbout: {
    type: Object,
    required: true,
    default:{
        total:0,
        pageNo:1,
       
    }
  },
  pagination: {
    type: Boolean,
    default: true
  },
  layout: {
    type: String,
    required: false,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  loading: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    required: false
  },
  style:{
    type: CSSStyleRule,
    required: false,
  },
  headerCellStyle: {
    type: CSSStyleRule,
    required: false,
    default: {
      color: '#7571c7',
      fontWeight: 'bold',
      background: 'var(--color-background-primary)'
    }
  }
})

const emits = defineEmits(['update:currentSize', 'update:currentPage','rerequest'])
const handleRequest = ()=>{
  emits('rerequest')
}

const selectedItems = ref<Record<string, any>[]>([])
const sortProp = ref<string>('')
const sortOrder = ref<string>('')

const total = computed(() => props.data.length)

const handleSizeChange = (size: number) => {
  emits('update:currentSize', size)
}
const handlePageChange = (page: number) => {
  emits('update:currentPage', page)
}

const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  sortProp.value = prop
  sortOrder.value = order
  props.data.sort((a, b) => {
    if (order === 'ascending') {
      return a[prop] > b[prop] ? 1 : -1
    } else {
      return a[prop] < b[prop] ? 1 : -1
    }
  })
}

const handleSelectionChange = (selection: Record<string, any>[]) => {
  selectedItems.value = selection
}

watch(
  () => props.data,
  () => {
    // currentPage.value = 1
  }
)
</script>

<style lang="scss" scoped>
.data-table {
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  .el-table-i {
    border-radius: 4px;
    border: 1px solid var(--color-border-hover);
  }
  .el-table-i::before {
    position: absolute;
    content: '';
    z-index: 3;
    background-image: linear-gradient(
      rgb(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0)
    );
    inset: 45px 0 calc(100% - 65px) 0;
  }
  .el-table-i::after {
    position: absolute;
    content: '';
    z-index: 3;
    background-image: linear-gradient(
      rgba(255, 255, 255, 0),
      rgb(255, 255, 255, 0.8)
    );
    inset: calc(100% - 20px) 0 0 0;
  }
  .footer {
    margin-top: 10px;
    justify-content: space-between;
  }
}
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
</style>
