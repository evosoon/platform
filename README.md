# Platform
这里是 Saber 的前端仓库。Saber 是一个专为中小型组织设计的消息推送和触达平台。该平台使用现代技术栈构建，包括 Vite、Vue3、Vue-router、TypeScript、Element Plus 和 Echarts。Saber 集成了飞书、短信、邮箱等多种下游服务，为上游应用提供了便捷且灵活的消息接入通道。



[点击跳转至 Saber 后端仓库](https://github.com/steadon/saber)
## 使用情况
目前已成功部署于一个超过500名成员的学 生组织，服务用户超过2000人，并衍生了多个优秀的上游应用。

## 部分页面
![saber-1](https://github.com/user-attachments/assets/51fec905-92e7-4154-add6-f9bfe5d01849)

![saber-2](https://github.com/user-attachments/assets/cd10d775-15c0-4d0b-a7be-4bcb264557a8)

![saber-3](https://github.com/user-attachments/assets/ba295d76-91a2-4c87-8ae0-1c096a0b241a)

![saber-4](https://github.com/user-attachments/assets/3cb8b0ec-cd5a-4c6e-ba78-be0a7d14501c)



## 使用说明
##### 依赖安装
```sh
pnpm install
```

##### 连接您的后端服务
编辑 vite.config.ts 文件，设置 baseUrl 为您的后端服务地址：
```typescript
// vite.config.ts
const baseUrl = 'https://example.com'
```

##### 启动项目

```sh
npm run dev
```

##### 打包项目

```sh
npm run build
```
