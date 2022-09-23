<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="navbar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>

    <div>
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- 用户详情 -->
      <div v-else-if="article.title" class="article-detail">
        <div class="main">
          <h2>{{ article.title }}</h2>
          <van-cell
            class="user-info"
            center
            :border="false"
            :title="article.aut_name"
            :label="label"
          >
            <van-image
              class="avatar"
              slot="icon"
              round
              fit="cover"
              :src="article.aut_photo"
            />
            <FollowUser
              class="follow-btn"
              :userId="article.aut_id"
              :isFollowed="article.is_followed"
              @update-is_followed="article.is_followed = $event"
            ></FollowUser>
          </van-cell>
          <!-- 文章内容 -->
          <div
            ref="article-content"
            class="article-content markdown-body"
            v-html="article.content"
          ></div>
          <van-divider>正文结束</van-divider>
          <!-- 评论 -->
          <CommentList
            :list="CommentList"
            :source="article.art_id"
            @onload-success="totalCommentCount = $event.total_count"
            @reply-click="onReplyClick"
          ></CommentList>
        </div>
        <!-- 底部 -->
        <div class="article-bottom">
          <van-button
            @click="isPostShow = true"
            class="comment-btn"
            type="default"
            round
            size="small"
            >写评论</van-button
          >
          <van-icon name="comment-o" :badge="totalCommentCount" color="#777" />
          <!-- 收藏文章 -->
          <CollectArticle
            :articleId="article.art_id"
            v-model="article.is_collected"
          ></CollectArticle>
          <!-- 点赞 -->
          <LikeArticle
            v-model="article.attitude"
            :articleId="article.art_id"
          ></LikeArticle>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- 发布评论 -->
        <van-popup v-model="isPostShow" position="bottom"
          ><CommentPost :target="article.art_id" @post-success="onPostSuccess"
        /></van-popup>
      </div>
      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn">点击重试</van-button>
      </div>
    </div>
    <!-- 评论回复 -->
    <!-- 弹出层懒渲染，只有第一次展示时候渲染里面的内容，之后只是在显示和隐藏这个内容 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
      <CommentReply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      ></CommentReply>
    </van-popup>
  </div>
</template>

<script>
import './github-markdown.css'
import dayjs from '@/utils/dayjs'
import { getArticleById } from '@/api'
import FollowUser from '@/components/follow-user.vue'
import CollectArticle from '@/components/CollectArticle.vue'
import LikeArticle from '@/components/LikeArticle.vue'
import CommentList from './components/CommentList'
import CommentPost from './components/CommentPost'
import CommentReply from './components/CommentReply'
//  图片预览
import { ImagePreview } from 'vant'
// ImagePreview([
//   'https://img01.yzcdn.cn/vant/apple-1.jpg',
//   'https://img01.yzcdn.cn/vant/apple-2.jpg'
// ]
// )
export default {
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  // 给所有后代传值
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      article: {},
      loading: true,
      errStatus: 0,
      totalCommentCount: 0,
      isPostShow: false,
      CommentList: [],
      isReplyShow: false,
      currentComment: [] // 当前点击回复的评论项
    }
  },
  created() {
    this.loadArticle()
  },
  methods: {
    async loadArticle() {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // 数据驱动视图这件事儿不是立即的
        this.article = data.data
        // console.log(this.article)
        // 初始化图片点击预览
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        console.log(err.message)
      }
      this.loading = false
    },
    previewImage() {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images,
            startPosition: index
          })
        }
      })
    },
    onPostSuccess(data) {
      this.isPostShow = false
      this.CommentList.unshift(data.new_obj)
    },
    onReplyClick(comment) {
      this.currentComment = comment
      this.isReplyShow = true
    }
  },
  computed: {
    label() {
      return dayjs(this.article.pubdate).fromNow()
    }
  }
}
</script>

<style scoped lang="less">
.main {
  height: calc(100vh - 92px - 100px);
  overflow: auto;
}
:deep(.navbar) {
  background-color: #3296fa;
  .van-nav-bar__title {
    color: #fff;
  }
  .van-icon-arrow-left:before {
    color: #fff;
  }
}
h2 {
  font-size: 0.53333rem;
  padding: 0.66667rem 0.42667rem;
  margin: 0;
  color: #3a3a3a;
}
:deep(.user-info) {
  padding: 0 32px;
  .avatar {
    width: 70px;
    height: 70px;
    margin-right: 17px;
  }
  .van-cell__label {
    margin-top: 0;
  }
  .user-name {
    font-size: 24px;
    color: #3a3a3a;
  }
  .publish-date {
    font-size: 23px;
    color: #b7b7b7;
  }
  .follow-btn {
    width: 170px;
    height: 58px;
  }
}
:deep(.article-content) {
  padding: 55px 32px;
  p {
    text-align: justify;
  }
}
:deep(.error-wrap) {
  padding: 200px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  .van-icon {
    font-size: 122px;
    color: #b4b4b4;
  }
  .text {
    font-size: 30px;
    color: #666666;
    margin: 33px 0 46px;
  }
  .retry-btn {
    width: 280px;
    height: 70px;
    line-height: 70px;
    border: 1px solid #c3c3c3;
    font-size: 30px;
    color: #666666;
  }
}
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 88px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 282px;
    height: 46px;
    border: 2px solid #eeeeee;
    font-size: 30px;
    line-height: 46px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 40px;
    .van-info {
      font-size: 16px;
      background-color: #e22829;
    }
  }
}
</style>
