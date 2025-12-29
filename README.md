# 项目DEMO——一个基础的Web App
为了配合PWA中相关知识的学习，我专门创建了一个demo Web App——

一个根据关键字查询图书信息的demo。

这个Web App最开始是不具备任何PWA的能力。我会在这一系列文章中以这个demo为例，阐述各项技术的同时，将其应用在demo上。也就是说，在这一系列的文章中，我会和大家一起将一个普通的网页应用逐步升级为一个简单的PWA，通过这种方式一起学习。

首先简单介绍一下这个demo。这是一个根据关键词搜索图书信息的应用，用户在前端输入关键词，点击搜索，会请求我们自己的服务器，来获取数据。

![图书搜索demo](https://upload-images.jianshu.io/upload_images/6476654-61e8e1ee38c99d84.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

项目使用[KOA](http://koajs.com/)来搭建node服务器，所以需要node版本>7.6.0，可以使用[nvm](https://github.com/creationix/nvm)来切换到适合的node版本。
