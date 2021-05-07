<template>
  <div class="usermanage-container">
    <div class="userManage-text">this is userManage page</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UserManage',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
.userManage {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
