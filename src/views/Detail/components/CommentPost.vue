<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button :disabled="!message.length" class="post-btn" @click="onPost"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from '@/api'
export default {
  name: 'CommentPost',
  components: {},
  // 祖先元素提供的数据
  inject: {
    articleId: {
      type: [Number, String],
      default: null
    }
  },
  props: {
    target: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    loading() {
      this.$toast.loading({
        message: '发布中……',
        forbidClick: true,
        duration: 0
      })
    },
    async onPost() {
      try {
        const { data } = await addComment({
          target: this.target.toString(),
          content: this.message,
          art_id: this.articleId ? this.articleId.toString() : null
        })
        console.log(data)
        this.message = ''
        this.$emit('post-success', data.data)
        this.$toast.success('发布成功')
      } catch (error) {
        this.$toast.fail('发布失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
