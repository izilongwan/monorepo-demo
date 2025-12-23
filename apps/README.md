### XSS

> 原因：通过innerHTML注入
>
> 方案：使用textContent展示/使用转义 `</>`字符  `onload` `onerror` 属性

* 存储型

  > 数据库存储
  >
* 反射型

  > url的query携带
  >
* DOM

  > dom展示
  >


## CSRF（跨域请求伪造)

> 用户登录网站A，但未退出（保存了Cookie)
>
> 网站B请求网站A的api

* Token 请求头携带，做验证
* 验证Referer和Origin
  * Referer 完整请求路径，可伪造，安全度较低
  * Origin 简易请求域名，跨域时自动携带，不可修改，安全度高


## 点击劫持

> 通过Iframe嵌入，使其透明，用户无感知操作

* X-Frame-Options：Deny/SAMEORIGIN/Allow-FROM uri
* Js脚本：self.location === top.location
* Content-Security-Policy: defalut-src 'self'; script-src 'self'
