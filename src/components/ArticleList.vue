<template>
  <div class="article">
    <van-pull-refresh v-model="refreshLoading" @refresh="getNextPageArticle">
      <van-list
        v-model="loading"
        @load="getNextPageArticle"
        offset="100"
        :immediate-check="false"
        :finished="finished"
        :error.sync="error"
        error-text="请求失败，请点击重新加载"
        finished-text="没有更多文章了"
      >
        <article-item
          v-for="item in articles"
          :key="item.art_id"
          :article="item"
        ></article-item>
      </van-list>
    </van-pull-refresh>
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
      articles: [],
      preTimeStamp: '',
      loading: false,
      finished: false,
      error: false,
      refreshLoading: false
    }
  },
  props: {
    id: [String, Number]
  },
  created() {
    this.getFirstPageArticle()
  },
  methods: {
    async getFirstPageArticle() {
      try {
        const { data } = await getArticles(this.id, +new Date())
        this.articles = data.data.results
        this.preTimeStamp = data.data.pre_timestamp
        // console.log(this.articles)
      } catch (err) {
        if (!err.response || err.response?.status === 507) {
          throw err
        } else {
          if (err.response?.status === 400) {
            throw new Error(err.response.data.message)
          }
        }
      }
    },
    async getNextPageArticle() {
      try {
        // if (Math.random() < 0.5) {
        //   throw new Error()
        // }
        const { data } = await getArticles(this.id, this.preTimeStamp)
        if (!data.data.pre_timestamp) {
          this.finished = true
        }
        if (this.loading) {
          this.articles.push(...data.data.results)
        } else {
          this.articles.unshift(...data.data.results)
        }
        this.preTimeStamp = data.data.pre_timestamp
      } catch (err) {
        this.error = true
      } finally {
        this.loading = false
        this.refreshLoading = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.article {
  height: calc(100vh - 92px - 83px - 100px);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 10px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #698598;
    border-radius: 10px;
  }
}
</style>
