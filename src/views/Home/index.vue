<template>
  <div>
    <!-- 搜索框 -->
    <van-nav-bar class="navbar">
      <template #title>
        <van-button icon="search" block round size="small">搜索</van-button>
      </template>
    </van-nav-bar>
    <!-- 导航 -->
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <article-list :id="item.id"></article-list>
      </van-tab>
      <span class="toutiao toutiao-gengduo" @click="isShow = true"></span>
    </van-tabs>
    <!-- 弹出层 -->
    <van-popup
      closeable
      close-icon-position="top-left"
      v-model="isShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <channel-edit
        v-if="isShow"
        :my-channels="channels"
        @change-active=";[(isShow = false), (active = $event)]"
        @del-channel="delChannel"
        @add-channel="addChannel"
      ></channel-edit>
    </van-popup>
  </div>
</template>
<script>
import { getChannelAPI, delChannelAPI, addChannelAPI } from '@/api'
import ChannelEdit from '@/views/Home/components/ChannelEdit.vue'
import ArticleList from '@/components/ArticleList.vue'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'home',
  data() {
    return {
      active: 2,
      channels: [],
      isShow: false
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  created() {
    this.initChannels()
  },
  computed: {
    ...mapGetters(['isLogin'])
  },
  methods: {
    ...mapMutations(['SET_MY_CHANNELS']),
    initChannels() {
      if (this.isLogin) {
        this.getChannel()
      } else {
        const myChannels = this.$store.state.myChannels
        if (myChannels.length === 0) {
          this.getChannel()
        } else {
          this.channels = myChannels
        }
      }
    },
    async getChannel() {
      try {
        const { data } = await getChannelAPI()
        this.channels = data.data.channels
      } catch (err) {
        if (!err.response) {
          throw err
        } else {
          const status = err.repomse.status
          status === 507 ?? this.$toast.fail('服务端异常，请重新刷新')
        }
      }
    },
    async delChannel(id) {
      try {
        const newchannels = this.channels.filter((item) => item.id !== id)
        if (this.isLogin) {
          await delChannelAPI(id)
        } else {
          this.SET_MY_CHANNELS(newchannels)
        }
        this.channels = newchannels
        this.$toast.success('成功删除频道')
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请登录在删除')
        } else {
          throw error
        }
      }
    },
    async addChannel(channel) {
      try {
        if (this.isLogin) {
          await addChannelAPI(channel.id, this.channels.length)
        } else {
          this.SET_MY_CHANNELS([...this.channels, channel])
        }
        this.channels.push(channel)
        this.$toast.success('添加频道成功')
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请登录再添加')
        } else {
          throw error
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.navbar {
  background-color: #3296fa;

  // inherit 继承
  // unset 不设置
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button--default {
    background-color: #5babfb;
    border: 0;
    color: #fff;
    font-size: 30px;
  }

  .van-icon {
    color: #fff;
  }
  .van-button--block {
    width: 7.4rem;
  }
}
/* tabs导航条样式 */
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.toutiao-gengduo {
  position: absolute;
  top: 0;
  right: 0;
  width: 66px;
  height: 82px;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/images/gradient-gray-line.png');
  }
}
</style>
