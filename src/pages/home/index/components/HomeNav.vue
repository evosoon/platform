<template>
  <div class="home-nav color flex">
    <header>
      <div class="nav-logo nowrap">
        <img :src="logo" />
        <span>Saber</span>
      </div>
    </header>
    <nav
      ref="nav"
      :class="{
        'has-scrollbar': scrollbarStatus.hasScrollbar,
        'at-bottom': scrollbarStatus.atBottom,
        'at-top': scrollbarStatus.atTop
      }"
    >
      <template v-for="item in props.navList" :key="item.title">
        <div
          class="enum-item"
          :class="{
            'enum-item-active':
              item?.title === props.nowRouteTitle && !item?.showChild
          }"
          @click.stop="handleNavBarSwitch(item)"
        >
          <img class="item-icon" :src="item?.icon" alt="" />
          <span class="nowrap item-title" v-text="item?.title"></span>
          <span v-if="item?.children">
            <img
              class="down-icon"
              :class="{ 'down-icon-active': item?.showChild }"
              :src="down"
              alt=""
            />
          </span>
        </div>
        <el-collapse-transition>
          <div v-if="item?.showChild">
            <div
              v-for="child in item?.children"
              :key="child.title"
              class="enum-item"
              style="padding-left: 32px"
              :class="{
                'enum-item-active': child.title === props.nowRouteTitle
              }"
              @click.stop="handleRouteJumpWrapper(child)"
            >
              <img
                class="item-icon"
                :src="child?.icon"
                alt=""
                v-if="child?.icon"
              />
              <span class="nowrap item-title" v-text="child.title"></span>
            </div>
          </div>
        </el-collapse-transition>
      </template>
    </nav>
    <footer class="nav-foot">
      <div class="enum-item" @click.stop="handleOutLoginWrapper()">
        <img class="item-icon" :src="exit" alt="" />
        <span class="nowrap item-title">退出账户</span>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import logo from '@/assets/logo.png'
import exit from '@/assets/icons/exit.svg'
import down from '@/assets/icons/down.svg'
import type { EnumItem, Props, ScrollbarStatus } from '../types'
import { routeJump, outLogin } from '../utils/navigation'
import debounce from '@/utils/base/debounce'
import useMessageBox from '@/hooks/useMessageBox'

const $router = useRouter()
const emit = defineEmits(['changeRouter'])

const props = withDefaults(defineProps<Props>(), {
  navList: () => [],
  nowRouteTitle: '规则管理'
})

// 导航栏样式
let nav = ref<HTMLDivElement | null>(null)

const scrollbarStatus: ScrollbarStatus = reactive({
  hasScrollbar: false,
  atTop: false,
  atBottom: false
})

const checkScrollbar = (): void => {
  if (!nav.value) return undefined

  const { clientHeight, scrollTop, scrollHeight } = nav.value
  scrollbarStatus.hasScrollbar = scrollHeight > clientHeight
  scrollbarStatus.atTop = scrollTop === 0 && scrollbarStatus.hasScrollbar
  scrollbarStatus.atBottom =
    scrollTop + clientHeight >= scrollHeight && scrollbarStatus.hasScrollbar
}
const debouncedCheckScrollbar = debounce(checkScrollbar, 100)

// 导航栏切换
const handleNavBarSwitch = (item: EnumItem): void => {
  if (item.showChild === false) {
    // 展开
    setTimeout(() => debouncedCheckScrollbar(), 200)
  } else if (item.showChild === true) {
    // 关闭
    setTimeout(() => debouncedCheckScrollbar(), 100)
  }
  handleRouteJumpWrapper(item)
}

onMounted(() => {
  setTimeout(() => debouncedCheckScrollbar(), 200)
  window.addEventListener('resize', debouncedCheckScrollbar)
  if (nav.value) {
    nav.value.addEventListener('scroll', debouncedCheckScrollbar)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedCheckScrollbar)
  if (nav.value) {
    nav.value.removeEventListener('scroll', debouncedCheckScrollbar)
  }
})

// 路由跳转
const handleRouteJumpWrapper = (item: EnumItem): void => {
  routeJump(item, emit, $router)
}
const handleOutLoginWrapper = async () => {
  const { type } = await useMessageBox({
    message: '确认退出账户',
    confrim: '退出'
  })
  if (type == 'success') {
    outLogin(emit, $router)
  }
}
</script>

<style lang="scss" scoped>
.home-nav {
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  width: 220px;
  height: 100%;

  header {
    margin: 12px auto;
    .nav-logo {
      word-spacing: 6px;
      letter-spacing: 1px;
      img {
        width: 26px;
        height: 26px;
        vertical-align: -10%;
        object-fit: cover;
      }
      span {
        font-family: Arbitron;
        font-weight: bolder;
        margin-left: 15px;
        font-size: 28px;
        color: #4b45c8;
      }
    }
  }

  nav {
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-right: 2px;
    scrollbar-width: 0;
    overflow: hidden;
  }
  nav:hover {
    overflow: auto;
  }
  nav.has-scrollbar {
    box-shadow:
      inset 0px -5px 5px -3px rgba(0, 0, 0, 0.15),
      inset 0px 5px 5px -3px rgba(0, 0, 0, 0.15);
  }
  nav.at-top {
    box-shadow: inset 0px -5px 5px -3px rgba(0, 0, 0, 0.15);
  }

  nav.at-bottom {
    box-shadow: inset 0px 5px 5px -3px rgba(0, 0, 0, 0.15);
  }

  .enum-item {
    position: relative;
    border-radius: 6px;
    padding: 8px 0 8px 14px;
    margin: 0px 0 6px 3%;
    width: 204px;
    cursor: pointer;
    user-select: none;
    transition:
      background-color 0.2s,
      color 0.2s;

    .item-icon {
      width: 17px;
      vertical-align: -12%;
      filter: drop-shadow(var(--color-text) 100px 0);
      transform: translateX(-100px);
    }

    .item-title {
      padding-left: 20px;
      letter-spacing: 2px;
      font-size: 16px;
    }

    .down-icon {
      margin-left: 45px;
      width: 10px;
      opacity: 0.75;
      transform: rotate(-90deg);
      transition: 0.2s ease-in-out;
    }

    .down-icon-active {
      transform: rotate(0);
    }
  }

  .enum-item:hover {
    background-color: var(--color-background-primary-hover);
    color: var(--color-text);
  }

  .enum-item-active {
    background-color: var(--color-border-primary);
    overflow: hidden;

    .item-icon {
      filter: drop-shadow(var(--color-background) 100px 0);
      transform: translateX(-100px);
    }

    .item-title {
      color: var(--color-background);
    }
  }

  .enum-item-active:hover {
    background-color: var(--color-border-primary);
  }
}
</style>
