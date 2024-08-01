<template>
  <div class="box flex">
    <img src="@/assets/login.png" class="img" alt="" />
    <div class="color text">页面正在开发中</div>
  </div>
</template>
<script></script>
<style lang="scss" scoped>
.box {
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  background-color: var(--color-background);
  margin: 8px;
  border-radius: 6px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .img{
    width: 10%;
  }
  .text{
    padding-top: 10px;
    font-weight: bolder;
  }
}
</style>
