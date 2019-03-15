<template>
    <div class="index">
        <HeadNav></HeadNav>
        <LeftMenu></LeftMenu>
        <div class="rightContainer">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

import HeadNav from '../components/HeadNav'
import LeftMenu from '../components/LeftMenu'

export default {
    name: "index",
    components: {
        HeadNav,
        LeftMenu
    }
}
</script>

<style scoped>
.index{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.rightContainer{
    width: calc(100% - 180px);
    margin-left: 180px;
    height: 100%;
}
</style>

