<template>
  <div>
    <van-nav-bar :title="`${commentList.length}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
      {{ comment.content }}
    </van-nav-bar>
    <div class="scroll-wrap">
      <CommentItem :comment="comment"></CommentItem>
      <!-- 评论的评论回复列表 -->
      <van-cell title="全部回复" />
      <CommentList
        :list="commentList"
        :source="comment.com_id"
        type="c"
      ></CommentList>
    </div>
    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button size="small" round class="post-btn" @click="isPostShow = true"
        >写评论</van-button
      >
    </div>
    <van-popup v-model="isPostShow" position="bottom">
      <CommentPost
        :target="comment.com_id"
        @post-success="onPostSuccess"
      ></CommentPost>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './CommentItem'
import CommentList from './CommentList'
import CommentPost from './CommentPost'
export default {
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isPostShow: false,
      commentList: []
    }
  },
  methods: {
    onPostSuccess(data) {
      /* eslint-disable */ this.comment.reply_count++
      this.isPostShow = false
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style lang="less" scoped>
.scroll-wrap {
  height: calc(100vh-92px-88px);
  overflow: auto;
}
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
