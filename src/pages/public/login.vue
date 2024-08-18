<template>
  <div class="login flex" @keyup.enter="submitLogin">
    <header>
      <el-popover placement="top-start" :width="290" trigger="hover">
        <template #reference>
          <div class="logo">
            <img src="@/assets/logo.png" alt="" />
            <span class="Arbitron">Saber</span>
          </div>
        </template>
        <div class="team-about flex">
          <span class="span">开发者团队</span>
          <span class="base" v-text="showInfo.developers"></span>
          <span class="span">更多</span>
          <template v-for="item in showInfo.more" :key="item.title">
            <el-link
              class="el-link base"
              :href="item.url"
              target="_blank"
              rel="noopener"
              type="primary"
              >{{ item.title }}</el-link
            >
          </template>
        </div>
      </el-popover>
    </header>
    <article class="article">
      <transition name="fade">
        <img
          v-if="image"
          class="img"
          :src="loginImg"
          alt=""
          key="login-image"
        />
      </transition>
      <div class="form color">
        <div class="title">登录到 <span class="Arbitron">Saber</span></div>
        <el-input
          v-model="loginInfo.username"
          class="input"
          placeholder="请输入用户名"
          prefix-icon="User"
          clearable
        />
        <el-input
          v-model="loginInfo.password"
          class="input"
          type="password"
          placeholder="请输入密码"
          prefix-icon="Lock"
          show-password
        />
        <el-button
          class="button"
          type="primary"
          @click="submitLogin"
          :loading="isLoading"
          >登录</el-button
        >
      </div>
    </article>
    <footer class="flex">
      <span class="Arbitron" v-html="showInfo.sign"></span>
      <a
        href="javascript:;"
        class="pointer AliBold"
        @click.prevent="isShowMore = !isShowMore"
        >技术支持</a
      >
    </footer>
  </div>
  <template v-if="isShowMore">
    <Teleport to="body">
      <div class="show-more" @click.self="isShowMore = !isShowMore">
        <div class="box flex">
          <span>技术支持联系方式</span>
          <span v-text="showInfo.email"></span>
        </div>
      </div>
    </Teleport>
  </template>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { Login } from '@/apis/login/login'
import { useRouter, type Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import loginImg from '@/assets/login.png'
const $router: Router = useRouter()
const userStore = useUserStore()

interface LoginInfo {
  username: string
  password: string
}

const showInfo = {
  developers: `前端：王子 王占锋
  后端：赵沛文 肖琰 梅书豪 汤子涵 韦秉芮
  产品：尹梦琦 孙贤为`,
  more: [
    { title: '我们的仓库', url: 'https://space.bilibili.com/12334246' },
    { title: '我们组织官网', url: 'https://space.bilibili.com/12334246' },
    { title: 'Saber项目介绍', url: 'https://space.bilibili.com/12334246' }
  ],
  sign: `Copyright &copy; 2024 SIPC.All rights reserved.`,
  email: `1473352497@qq.com
  3485966150@qq.com`
}

const isShowMore = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const loginInfo: LoginInfo = reactive({
  username: '',
  password: ''
})

async function submitLogin() {
  if (isLoading.value) return
  isLoading.value = true
  const username = await Login(loginInfo)
  if (typeof username !== undefined) {
    userStore.updateName(username as string)
    $router.replace('/manage/rule')
  }
  isLoading.value = false
}
const image = ref<boolean>(false)
onMounted(() => {
  const img = new Image()
  img.onload = () => {
    image.value = true
  }
  img.src = loginImg
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(125deg, #eeeefe 55%, var(--color-background) 20%);

  header {
    margin: 30px 0 0 30px;
    height: 30px;
    line-height: 30px;
    .logo {
      width: 200px;
      img {
        width: 30px;
      }
      /* 定义进入和离开的过渡状态 */

      span {
        font-family: Arbitron;
        font-size: 24px;
        padding-left: 14px;
        vertical-align: 14%;
        color: #4b45c8;
      }
    }
  }

  .article {
    display: flex;
    justify-content: right;
    align-items: center;
    transition: transform 1.5s ease;

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 1.5s ease;
      transition: transform 1.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
      transform: scale(0);
    }
    .img {
      width: 30%;
      margin-right: 6%;
      transition: transform 1.5s ease-in-out;
    }
    margin-right: 16%;
    .form {
      width: 400px;
      height: 430px;
      padding: 40px 30px;
      border-radius: 10px;
      background-color: var(--color-background);
      box-shadow: 0 0 10px 1px #c2bef1;
      transition: all 1.5s ease-in-out;

      .title {
        color: #4d45ea;
        font-size: 24px;
        text-align-last: left;
        margin: 10px 0;
        padding-left: 5px;
        font-weight: bolder;
      }
      .input {
        height: 45px;
        margin: 20px 0;
        border-bottom: 1px solid rgb(207, 207, 207);
        font-size: 20px;
        width: 100%;
        ::v-deep(.el-input__wrapper) {
          box-shadow: none;
        }
      }
      .button {
        width: 100%;
        height: 45px;
        font-size: 20px;
        margin: 30px 0;
      }
    }
  }

  footer {
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 15px 25px;
    color: #4b45c8;
    span {
      font-size: 13px;
      font-weight: bolder;
    }
  }
  @media (max-width: 600px) {
    .article {
      justify-content: center;
      margin: 0;
      img {
        display: none;
      }
    }
  }
  @media (max-width: 440px) {
    .article {
      margin: 0 10px;
      min-width: 260px;
    }
    footer {
      flex-direction: column;
      align-items: start;
      min-width: 260px;
    }
  }
}
.show-more {
  position: fixed;
  inset: 0;
  .box {
    position: absolute;
    flex-direction: column;
    right: 20px;
    bottom: 50px;
    color: #313d89c5;
    background-color: var(--color-background-light);
    width: 260px;
    border-radius: 10px;
    box-shadow: 0 0 10px 1px #bab6f4ab;
    padding: 5px 20px;
    span {
      padding: 5px 0;
    }
  }
}

.team-about {
  flex-direction: column;
  align-items: start;
  .base {
    color: #313d89c5;
  }

  .span {
    color: #0b22b8c5;
  }
  span,
  .el-link {
    padding: 2px 5px;
    white-space: pre-line;
  }
}
</style>
