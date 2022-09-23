<template>
  <div>
    <van-nav-bar
      class="navbar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!--  头像 -->
    <div>
      <input
        type="file"
        ref="file"
        hidden
        accept=".png,.pdf,.jpg"
        @change="selectPhoto"
      />
      <van-cell title="头像" is-link @click="$refs.file.click()">
        <van-image round width="0.8rem" height="0.8rem" :src="avatar" />
      </van-cell>
      <van-popup
        v-model="isShowPhoto"
        closeable
        position="bottom"
        :style="{ height: '100%' }"
      >
        <update-avator
          v-if="isShowPhoto"
          :photo="photo"
          :avatar.sync="avatar"
        ></update-avator>
      </van-popup>
    </div>
    <!-- 昵称 -->
    <van-cell title="昵称" :value="name" is-link @click="isShowNickName = true">
    </van-cell>
    <van-popup
      v-model="isShowNickName"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <van-nav-bar
        title="更新昵称"
        left-text="取消"
        right-text="保存"
        @click-left="isShowNickName = false"
        @click-right="nameConfirm"
      />
      <van-field
        v-model="name"
        :value="name"
        ref="name"
        rows="2"
        type="textarea"
        maxlength="11"
        show-word-limit
      />
    </van-popup>
    <!-- 性别 -->
    <div class="gender">
      <van-cell
        title="性别"
        :value="gender ? '女' : '男'"
        is-link
        @click="isShowGender = true"
      >
      </van-cell>
      <van-popup
        v-model="isShowGender"
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-picker
          ref="gender"
          v-model="gender"
          :default-index="gender"
          title="更新性别"
          show-toolbar
          :columns="columns"
          @cancel="isShowGender = false"
          @confirm="genderConfirm"
        />
      </van-popup>
    </div>
    <!-- 生日 -->
    <div class="birth">
      <van-cell title="生日" :value="birth" is-link @click="isShowBirth = true">
      </van-cell>
      <van-popup
        v-model="isShowBirth"
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-datetime-picker
          ref="birth"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          v-model="currentDate"
          :value="currentDate"
          @cancel="isShowBirth = false"
          @confirm="birthConfirm"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import UpdateAvator from './components/UpdateAvator.vue'
import { resolveToBase64 } from '@/utils'
import { getDetailUserInfo, getDetailUser } from '@/api'
export default {
  components: {
    UpdateAvator
  },
  data() {
    return {
      avatar: '',
      isShowPhoto: false,
      photo: '',
      isShowNickName: false,
      name: '',
      isShowGender: false,
      columns: ['男', '女'],
      gender: '',
      value: '',
      isShowBirth: false,
      birth: '',
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date()
    }
  },
  created() {
    this.getDetailUserInfo()
  },
  methods: {
    async selectPhoto() {
      const file = this.$refs.file.files[0]
      const base64 = await resolveToBase64(file)
      this.photo = base64
      this.isShowPhoto = true
      this.$refs.file.value = ''
    },
    async getDetailUserInfo() {
      const { data } = await getDetailUserInfo()
      this.avatar = data.data.photo
      this.name = data.data.name
      this.gender = data.data.gender
      this.birth = data.data.birthday
      this.currentDate = new Date(this.birth)
      console.log(data)
    },
    async genderConfirm() {
      this.isShowGender = false
      const gender1 = this.$refs.gender.getColumnValue(0) === '男' ? '0' : '1'
      await getDetailUser({ gender: gender1 })
      await this.getDetailUserInfo()
    },
    async birthConfirm() {
      this.isShowBirth = false
      const birth1 = this.$refs.birth.getPicker().getValues()
      await getDetailUser({ birthday: birth1.join('-') })
      await this.getDetailUserInfo()
    },
    async nameConfirm() {
      this.isShowNickName = false
      const name1 = this.$refs.name.value
      await getDetailUser({ name: name1 })
      await this.getDetailUserInfo()
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  background-color: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  :deep(.van-icon) {
    color: #fff;
  }
}
.gender,
.birth {
  :deep(.van-overlay) {
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
