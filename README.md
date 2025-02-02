# Jsmoke 🚬🚬 by Yn8rt

## 写在前面

**没事大家可以多分享一下，前几天想回去找一篇文章，结果发现撤回了，这搞的，越来越~~**😶

**有什么不足的地方希望大家及时告诉我，或者有做二次开发记得@我一下**

## 项目简介

该插件可以理解为**主动版的hae和apifinder**，因为其中的大多数规则我都引用了，当你认为当前页面，以及其调用的js文件存在敏感信息的时候，可以用它来帮你打开突破口，速度很快，非常方便，也比较直观

该插件用于检测网页中的敏感信息泄露，包括但不限于 API 密钥、邮箱、手机号等。
通过对当前页面的 HTML 和 JavaScript 文件进行扫描，帮助开发者及时发现潜在的安全隐患。

**当前页面检测：**

![image-20250202222407216](img/image-20250202222407216.png)

**深层js检测：**

![image-20250202222428069](img/image-20250202222428069.png)

## 功能特性

- **当前页面检测**：扫描当前页面的 HTML 内容，检测是否存在敏感信息泄露。
- **深层 JS 检测**：分析页面引入的 JavaScript 文件，查找可能的敏感信息泄露。

## 安装与使用

1. **安装插件**：将插件**文件夹**托到浏览器的扩展程序中就ok了。
2. **使用插件**：点击浏览器工具栏中的插件图标，选择“当前页面检测”或“深层 JS 检测”进行扫描。
3. **查看结果**：扫描完成后，插件会在弹出窗口中显示检测结果，标明发现的敏感信息及其位置。

## 支持的敏感信息类型

- **API 密钥**：如 `api_key=xxx` 或 `API_KEY=xxx`。
- **邮箱地址**：如 `user@example.com`。
- **手机号**：如 `+86 138 0000 0000`。
- **身份证号**：如 `身份证号：123456789012345678`。
- **阿里云 AK**：如 `LTAIxxxxxxxxxxxx`。
- **腾讯云 AK**：如 `AKIDxxxxxxxxxxxx`。
- **百度云 AK**：如 `AKxxxxxxxxxxxx`。
- **京东云**：如 `JDC_XXXXXXXXXXXXXXXX`。
- **火山引擎**：如 `AKLTxxxxxxxxxxxx`。
- **密码**：如 `password=xxx` 或 `passwd=xxx`。
- **用户名**：如 `username=xxx` 或 `user=xxx`。

**等等众多匹配机制，参考了很多hae规则以及经过处理和加工，刚出炉就直接开源，希望大家有补充的好用的匹配规则也可以分享出来，还是那句话：分享出来的不一定有价值，藏着的也不一定有价值**

## 开发者

该插件由 Yn8rt 开发，旨在提高网页安全性，帮助开发者及时发现并修复敏感信息泄露问题。

如需更多信息或有任何疑问，请参阅项目文档或联系开发者。