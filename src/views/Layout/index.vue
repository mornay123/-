<template>
  <div>
    <router-view></router-view>
    <van-tabbar class="tabbar" route>
      <van-tabbar-item to="/ ">
        <template #icon><i class="toutiao toutiao-shouye"></i> </template>
        首页
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <template #icon><i class="toutiao toutiao-shipin"></i> </template>
        视频
      </van-tabbar-item>
      <van-tabbar-item to="/qa">
        <template #icon><i class="toutiao toutiao-wenda"></i> </template>
        问答
      </van-tabbar-item>
      <van-tabbar-item to="/profile">
        <template #icon><i class="toutiao toutiao-wode"></i> </template>
        {{ isLogin ? '我的' : '未登录' }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['isLogin'])
  }
}
</script>
<style lang="less" scoped>
.tabbar {
  .toutiao {
    font-size: 40px;
  }
  .van-tabbar-item {
    font-size: 30px;
  }
}
</style>
