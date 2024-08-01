// import { h, ref, createApp } from "vue";
// import { ElDialog } from "element-plus";

// export function useDialog(options:any) {
//   const { props, slots, events } = options;
//   const visible = ref(false);
//   // 事件
//   const showEvent = {
//     // 关闭事件
//      onClose: () => {
//         visible.value = false;
//       }
//   };
//   for (const key in events) {
//     if (Object.hasOwnProperty.call(events, key)) {
//       showEvent[`on${key.charAt(0).toUpperCase() + key.slice(1)}`] =
//         events[key];
//     }
//   }
//     const app = createApp({
//         render() {
//           return h(
//             ElDialog,
//             {
//               modelValue: visible.value,
//               ...props,
//               ...showEvent,
//               onClosed:()=>{
//                 console.log(props)
//                 console.log(visible.value)
//               }
//             },
//             slots
//           );
//         },
//       })
//       app.mount("#app");
//   return {
//     show() {
//       visible.value = true;
//     },
//   };
// }
