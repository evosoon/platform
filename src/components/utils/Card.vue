<template>
  <div @click.stop="show = !show"><slot name="header"></slot></div>
  <teleport to="body" v-if="show">
    <div
      class="teleport-box flex"
      :class="{
        'right-box': props.position === 'right',
        'center-box': props.position === 'center'
      }"
      @click.self="show = !show"
    >
      <div :class="{ 'teleport-center': props.position === 'center' }">
        <div style="flex: 1">
          <slot name="center"></slot>
        </div>
        <div
          v-if="props.position == 'center' && !props.hidBtn"
          class="teleport-center-btns flex"
        >
          <div class="teleport-btn pointer color" @click="show = !show">
            取消
          </div>
          <div @click="handleHide" class="teleport-btn pointer color">
            <slot name="btn">确定</slot>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const props = defineProps({
  position: {
    type: String,
    default: 'center',
    required: false
  },
  hidBtn: {
    type: Boolean,
    default: false,
    required: false
  }
})
const emits = defineEmits(['confirm'])

const show = ref<boolean>(false)

function handleHide() {
  show.value = false
}

defineExpose({
  handleHide
});

// const confirmOption = ()=>{
//     emits("confirm",{})
//     show.value = !show.value
// }
</script>

<style lang="scss" scoped>
.teleport-box {
  background-color: rgba(42, 42, 46, 0.342);
  position: fixed;
  z-index: 5;

  .teleport-center {
    background-color: var(--color-background);
    border-radius: 15px;
    padding: 25px 15px 15px 15px;
    min-width: 20px;
    max-width: 80%;
    min-height: 80px;
    flex-direction: column;
    display: flex;
    .teleport-center-btns {
      justify-content: space-around;
      align-items: end;
      .teleport-btn {
        background-color: transparent;
        border: 1px solid var(--color-border);
        border-radius: 6px;
        width: 60px;
        text-align: center;
        margin-top: 10px;
      }
    }
  }
}
.right-box {
  inset: 0;
  justify-content: end;
}
.center-box {
  justify-content: center;
  align-items: center;
  inset: 0;
}
</style>
