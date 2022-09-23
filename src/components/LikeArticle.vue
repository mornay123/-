<template>
  <van-button
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{ liked: value === 1 }"
    :loading="loading"
    @click="onLiked"
  />
</template>
<script>
import { addLiked, deleteLiked } from '@/api'
export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async onLiked() {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          await addLiked(this.articleId)
        } else {
          await deleteLiked(this.articleId)
          status = 1
        }
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (error) {
        this.$toast.fail('操作失败，请重试！')
      }
      this.loading = false
    }
  }
}
</script>
<style lang="less" scoped>
.liked {
  :deep(.van-icon) {
    color: #e5645f;
  }
}
</style>
