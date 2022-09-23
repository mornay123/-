<template>
  <div @click="$router.push(`/articles/${article.art_id}`)">
    <!-- 没有图片 -->
    <van-cell
      :title="article.title"
      v-if="article.cover.type === 0"
      :label="label"
    >
    </van-cell>
    <!-- 一张图片 -->
    <van-cell
      :title="article.title"
      v-else-if="article.cover.type === 1"
      :label="label"
    >
      <template>
        <van-image width="100" height="100" :src="article.cover.images[0]" />
      </template>
    </van-cell>
    <!-- 三张图片 -->
    <van-cell :title="article.title" v-else-if="article.cover.type === 3">
      <template #label>
        <van-image
          v-for="(item, index) in article.cover.images"
          :key="index"
          width="100"
          height="100"
          :src="item"
        />
        <p>{{ label }}</p>
      </template>
    </van-cell>
  </div>
</template>
<script>
import dayjs from '@/utils/dayjs'
export default {
  props: {
    article: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    label() {
      return `${this.article.aut_name} ${this.article.comm_count}评论 ${dayjs(
        this.article.pubdate
      ).fromNow()}`
    }
  }
}
</script>
