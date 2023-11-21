<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>娜娜采集管理系统</h2>
        <p>
          为了让娜娜项目网合伙人解放双手，娜娜特地开发了本套系统。
        </p>
        <p>
          本系统可以自动采集娜娜项目网最新项目，将项目自动同步到合伙人网站，实现项目网全自动流程。
        </p>
        <p>
          <b>当前版本:</b> <span>v{{ version }}</span>
        </p>
        <p>
          <el-tag type="danger">&yen;合伙人免费</el-tag>
          <el-tag type="danger" style="margin-left: 10px">普通用户 &yen;200 永久</el-tag>
        </p>
        <p>

        </p>
        <p>
          <el-button
            icon="HomeFilled"
            plain
            @click="goTarget('https://www.nanaxm.cn')"
            >访问娜娜项目网</el-button
          >
          <el-button
              icon="Cloudy"
              plain
              @click="goTarget('https://www.taonana.cn')"
          >访问淘娜娜副业社</el-button
          >
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>使用教程</h2>
          </el-col>
        </el-row>
        <p>
          1.点击采集管理，然后点击站点管理新增站点
        </p>
        <p>
          2.输入自己的网站域名，需要包含http，如：https://www.taonnana.cn
        </p>
        <p>
          3.输入放入宝塔同步文件里面的密码，默认为nana1234，可自行修改
        </p>
        <p>
          4.点击获取分类，然后选择实战项目，状态和自动同步默认启动即可
        </p>
        <p>
          <span style="color: #ed5565">注：</span>状态启用，系统会自动将抓取到的项目保存起来，供手动点击更新操作
        </p>
        <p>
          <span style="color: #ed5565">注：</span>自动同步启用，系统会自动将保存起来的项目，自动进行更新操作，无需人工手动点击
        </p>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>联系信息</span>
            </div>
          </template>
          <div class="body">
            <p>
              <i class="el-icon-s-promotion"></i> 官网：<el-link
                href="https://www.nanaxm.cn"
                target="_blank"
                >https://www.nanaxm.cn</el-link
              >
            </p>
            <p>
              <i class="el-icon-chat-dot-round"></i> 微信：<a
                href="javascript:;"
                >nanadh666</a
              >
            </p>
            <p>
              <i class="el-icon-money"></i> QQ：<a
                href="javascript:;"
                class="支付宝信息"
                >99611624</a
              >
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>更新日志</span>
            </div>
          </template>
          <el-collapse accordion>
            <el-collapse-item title="v1.0.0 - 2023-12-01">
              <ol>
                <li>娜娜采集管理系统正式发布</li>
                <li>新增自动采集功能</li>
                <li>新增自动同步功能</li>
              </ol>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
<!--      <el-col :xs="24" :sm="24" :md="12" :lg="8">-->
<!--        <el-card class="update-log">-->
<!--          <template v-slot:header>-->
<!--            <div class="clearfix">-->
<!--              <span>捐赠支持</span>-->
<!--            </div>-->
<!--          </template>-->
<!--          <div class="body">-->
<!--            <img-->
<!--              src="@/assets/images/pay.png"-->
<!--              alt="donate"-->
<!--              style="width:100%"-->
<!--            />-->
<!--&lt;!&ndash;            <span style="display: inline-block; height: 30px; line-height: 30px"&ndash;&gt;-->
<!--&lt;!&ndash;              >你可以请作者喝杯咖啡表示鼓励</span&ndash;&gt;-->
<!--&lt;!&ndash;            >&ndash;&gt;-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-col>-->
    </el-row>
  </div>
</template>

<script setup name="Index">
const version = ref('1.0.0')

function goTarget(url) {
  window.open(url, '__blank')
}
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

