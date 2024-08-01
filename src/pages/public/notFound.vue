<template>
  <div class="not-found color backgroundColor flex">
    <span class="span">页面不见了 ( 404 )</span>
    <el-button type="text" class="button"><router-link :to="{ path: 'manage/' }">点击回到首页</router-link></el-button>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.not-found {
  justify-content: center;
  align-items: center;
  padding: 16% 0 10% 0;
  flex-direction: column;
  box-shadow: 0px 5px 10px 5px var(--color-border);

  .span {
    font-size: 1.2em;
    margin-bottom: 10px;
  }
  .button{
    padding: 0 10px;
  }
}
</style>
