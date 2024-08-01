<template>
  <div class="message-send backgroundColor flex">
    <div class="option-search color font-b flex">
      <div class="search-input flex">
        <el-input
          style="width: 240px"
          placeholder="搜索"
          :prefix-icon="Search"
          clearable
          disabled
        />
      </div>
      <div class="option-btns flex">
        <Card position="right">
          <template v-slot:header><el-button :disabled="!list_form.length"> + 新 建 </el-button></template>
          <template v-slot:center>
            <NewApp @submitSuccess="getAppList"></NewApp>
          </template>
        </Card>
      </div>
    </div>
    <div class="form backgroundColor flex"> 
    <div class="option-form flex">
      <el-table
        :data="list_form"
        max-height="calc(100vh - 240px)"
        height="calc(100vh - 240px)"
        style="width: 100%"
        stripe
        class="el-table-i"
        :header-cell-style="{
          color: '#7571c7',
          fontWeight: 'bold',
          background: 'var(--color-background-primary)'
        }"
      >
        <el-table-column fixed prop="id" label="ID" width="80" />
        <el-table-column prop="app_id" label="appid" min-width="160" />
        <el-table-column label="AppSecret" min-width="200">
            <template #default="scope">
              <span
              v-if="scope.row.app_secret"
               @click="controlNowShow(scope.row.app_secret)">{{
                scope.row.app_secret == nowShow
                  ? scope.row.app_secret
                  : '************'
              }}</span>
              <span v-else>[暂无内容]</span>
              <span
                @click="controlNowShow(scope.row.app_secret)"
                style="padding-left: 10px"
                v-if="scope.row.app_secret"
                ><img
                  :src="closeEye"
                  width="16px"
                  v-if="scope.row.app_secret !== nowShow"
              />
              <el-icon class="pointer copy" v-if="scope.row.app_secret === nowShow" @click.stop="handleCopy(scope.row.app_secret)"><CopyDocument /></el-icon>
            </span>
            </template>
          </el-table-column>
        <el-table-column prop="description" label="业务介绍" min-width="200" />
        <el-table-column prop="tag" label="创建信息" width="160">
          <template #default="scope">
            <p class="create-by" v-text="scope.row.create_by"></p>
            <p class="create-by" v-text="scope.row.create_time"></p>
          </template>
        </el-table-column>
        <el-table-column label="操作项" width="120">
          <template #default="scope">
            <div class="flex" style="justify-content: center">
              <Card position="right">
                <template v-slot:header>
                  <span>
                    <svg
                    t="1711597152538"
                    class="icon"
                    viewBox="0 0 1025 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2857"
                    width="200"
                    height="200"
                  >
                    <path
                      d="M88.604692 653.05608 716.4014 25.749546c34.4886-34.484498 78.86478-34.178908 113.04779 0.002051l169.577838 169.444526c34.180959 34.18301 34.486549 78.479203 0 112.96165L371.23237 935.464308 58.585089 1021.938074c-43.367117 9.243585-65.765429-13.119861-56.525946-56.480825L88.604692 653.05608M151.143993 703.525601 87.349517 936.715381l233.370262-63.745253L151.143993 703.525601M914.239134 279.914285c29.307927-29.067967 27.521558-28.583945 0.002051-56.480825l-113.051892-112.96165c-26.797577-28.569588-29.476104-28.807497-56.525946 0l-113.051892 112.96165 169.577838 169.444526L914.239134 279.914285zM377.247776 816.489303l367.415572-367.130491-169.575787-169.442476L207.669938 647.044776C224.104117 663.48921 319.21644 758.472324 377.247776 816.489303z"
                      p-id="2858"
                      fill="#8a8a8a"
                    ></path>
                  </svg>
                  </span>
                </template>
                <template v-slot:center>
                  <NewApp @submitSuccess="getAppList" :appInfo="scope.row"></NewApp>
                </template>
              </Card>
              <span style="padding:5px"></span>
              <Card>
                <template v-slot:header>
                <span>
                    <svg
                    t="1711597294660"
                    class="icon"
                    viewBox="0 0 1039 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="3064"
                    width="200"
                    height="200"
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
                    <path d="M987.097532 155.264203 819.301921 155.264203 819.301921 115.272373c0-52.840462-42.990117-95.829556-95.829556-95.829556L299.974026 19.442818c-52.841485 0-95.829556 42.989093-95.829556 95.829556l0 39.99183L36.347836 155.264203c-19.847024 0-35.936467 16.089443-35.936467 35.936467 0 19.846 16.089443 35.935444 35.936467 35.935444l950.749696 0c19.848047 0 35.936467-16.090467 35.936467-35.935444C1023.033999 171.353646 1006.944556 155.264203 987.097532 155.264203zM276.016381 115.272373c0-13.208836 10.746762-23.957645 23.957645-23.957645l423.49834 0c13.208836 0 23.957645 10.747785 23.957645 23.957645l0 39.99183L276.016381 155.264203 276.016381 115.272373z" p-id="3068" fill="#707070"></path>
                  </svg>
                </span>
                </template>
                <template v-slot:center>
                    <div class="color">确认<span style="color:#ea7272">删除</span>appid为<span style="color:#ea7272" v-text="scope.row.app_id"></span>的业务</div>
                </template>
                <template v-slot:btn>
                  <div @click="delApp(scope.row.app_id)">删除</div>
                </template>
              </Card>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="option-form-end flex">
      <div v-if="list_about.total" class="sorter flex">
        <el-pagination
          v-model:current-page="list_about.page_no"
          v-model:page-size="list_about.page_size"
          :page-sizes="PAGE_SIZE_INIT"
          layout="total, sizes, prev, pager, next, jumper"
          :total="list_about.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { DelApp, GetAppList } from '@/apis/applicationApis'
import { Search } from '@element-plus/icons-vue'
import closeEye from '@/assets/icons/closeEye.svg'

let nowShow = ref<string>('')
const controlNowShow = (e: any) => {
  nowShow.value = nowShow.value === e ? '' : e
}

const handleCopy = (data:string) => {
  navigator.clipboard.writeText(data).then(() => {});
}

const PAGE_SIZE_INIT: number[] = [15, 25, 50, 100]
const list_about = reactive({
  page_no: 1,
  page_size: PAGE_SIZE_INIT[0],
  pages: 0,
  total: 0
})

let list_form = ref([])

const getAppList = async () => {
  const { page_no, page_size, pages, total, result_list } = await GetAppList(
    { page_no: list_about.page_no, page_size: list_about.page_size }
  )
  list_about.page_no = page_no
  list_about.page_size = page_size
  list_about.pages = pages
  list_about.total = total
  list_form.value = result_list
}
const delApp = async(app_id:string)=>{
  console.log(app_id)       
  const res = await DelApp(app_id)
  if(res.result_code == 'success')alert('删除成功')
  getAppList()
}
const handleSizeChange = (): void => {
  getAppList()
}
const handleCurrentChange = (): void => {
  getAppList()
}

onMounted(() => {
  getAppList()
})
</script>

<style lang="scss" scoped>
.message-send {
  height: calc(100% - 20px);
  flex-direction: column;
  margin: 10px;
  border-radius: 10px;
  .option-search {
    padding: 20px 20px 10px 20px;
    justify-content: space-between;
  }
  .form {
  flex-direction: column;
  overflow: hidden;
  justify-content: space-between;
  margin: 5px;
  border-radius: 10px;
  .option-form {
    position: relative;
    margin: 15px;
    border-radius: 6px;
    overflow: hidden;
    
    .el-table-i{
      width: 100%;
      border-left: 2px solid #f5f5f5;
      border-right: 2px solid #f5f5f5;
      border-bottom: 2px solid #f5f5f5;
    }
    .create-by {
      font-size: 13px;
    }
    .create-by:last-child {
      font-size: 12px;
      line-height: 16px;
      color: var(--color-text-hover);
    }
    .icon {
      width: 16px;
      height: 16px;
      margin: 1px 5px;
    }
    span:hover {
      .icon{
        filter: drop-shadow(var(--color-text-primary) 200px 0);
        transform: translateX(-200px);
      }
    }
    .copy:active{
      background-color: var(--color-border);
      color: var(--color-text-primary);
      border-radius: 2px;
    }
  }
  .option-form::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 25px;
    z-index: 3;
    background-image: linear-gradient(
      rgba(255, 255, 255, 0.238),
      rgb(255, 255, 255)
    );
    border-right: 2px solid #f3f3f3;
    border-left: 2px solid #f3f3f3;
    border-bottom: 2px solid #f3f3f3;
    bottom: 0;
  }
  .option-form::after {
    position: absolute;
    content: '已经到底了';
    text-align: center;
    opacity: 0.4;
    width: 100%;
    bottom: 20px;
  }
  .option-form-end {
    height: 50px;
    padding-right: 15px;
    justify-content: end;
  }
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
// table 下边框
::v-deep(.el-table__inner-wrapper::before) {
  display: none;
}
</style>