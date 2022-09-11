<template>
  <div>
    <article-item
      v-for="item in articles"
      :key="item.art_id"
      :article="item"
    ></article-item>
  </div>
</template>
<script>
import { getArticles } from '@/api'
import ArticleItem from '@/components/ArticleItem.vue'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  data() {
    return {
      articles: []
    }
  },
  props: {
    id: [String, Number]
  },
  created() {
    this.getFirstPageArticles()
  },
  methods: {
    async getFirstPageArticles() {
      try {
        const { data } = await getArticles(this.id, +new Date())
        this.articles = data.data.results
        console.log(this.articles)
      } catch (err) {
        if (!err.response || err.response?.status === 507) {
          throw err
        } else {
          if (err.response?.status === 400) {
            throw new Error(err.response.data.message)
          }
        }
      }
    }
  }
}
</script>
