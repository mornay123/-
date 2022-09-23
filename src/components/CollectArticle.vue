<template>
  <van-button
    :loading="loading"
    :class="{ collected: value }"
    :icon="value ? 'star' : 'star-o'"
    @click="onCollect"
  />
</template>
<script>
import { addCollect, deleteCollect } from '@/api'
export default {
  props: {
    value: {
      type: Boolean,
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
    async onCollect() {
      this.loading = true
      try {
        if (this.value) {
          await deleteCollect(this.articleId)
        } else {
          await addCollect(this.articleId)
        }
        this.$emit('input', !this.value)
        this.$toast.success(this.value ? '取消收藏' : '收藏成功')
      } catch (error) {
        this.$toast.fail('操作失败，请重试！')
      }
      this.loading = false
    }
  }
}
</script>
<style lang="less" scoped>
.collected {
  :deep(.van-icon) {
    color: #ffa500 !important;
  }
}
</style>
