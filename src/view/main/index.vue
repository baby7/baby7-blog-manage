<template>
    <el-container class="main-container">
        <div>
            <div v-if="!isCollapse" class="menu-logo">
                <span class="menu-title">博客后台管理</span>
            </div>
            <div v-if="isCollapse" class="menu-logo-display">
            </div>
            <SideBar :is-collapse="isCollapse"/>
        </div>
        <el-container>
            <el-header class="menu-header" style="font-size: 12px;">
                <div style="float: left;">
                    <span style="font-size: 20px">
                        <i v-if="!isCollapse" class="el-icon-s-fold" @click="changeCollapse"></i>
                        <i v-if="isCollapse" class="el-icon-s-unfold" @click="changeCollapse"></i>
                    </span>
                    <span style="font-size: 18px">{{ ' ' + menuTitle }}</span>
                </div>
                <div style="float: right;">
                    <el-dropdown>
                        <el-avatar
                            class="nav-bar-avatar"
                            shape="square"
                            size="large"
                            :src="userInfo.avatar"></el-avatar>
                        <span style="color: #ffffff">{{' ' + userInfo.name}}</span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item><div @click="manager">修改信息</div></el-dropdown-item>
                            <el-dropdown-item><div @click="logOut">退出登录</div></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-main style="padding: 5px;background: #f0f2f5;">
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>

import SideBar from "@/view/main/side-bar/index";
import {logout, getInfo} from "@/api/user"

export default {
    name: "main",
    components: {
        SideBar
    },
    data() {
        return {
            isCollapse: false,
            menuTitle: this.$store.state.NowMenuTitle,
            userInfo: {}
        }
    },
    methods: {
        getData(){
            getInfo().then(res => {
                this.userInfo = res.data
            })
        },
        changeCollapse() {
            this.isCollapse = !this.isCollapse
        },
        logOut(){
            logout().then(res => {
                window.sessionStorage.setItem('baby7blog-token', null)
                this.$router.push({path: '/login'})
            })
        },
        manager() {
            this.$router.push({path: '/manager'})
        }
    },
    computed: {
        isFollow() {
            return this.$store.state.NowMenuTitle;
        }
    },
    watch: {
        isFollow(newVal, oldVal) {
            this.menuTitle = this.$store.state.NowMenuTitle
        },
    },
    created() {
        this.getData()
    }
}
</script>

<style scoped>
.main-container {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
}

.menu-header {
    background-color: #409EFF;
    color: #ffffff;
    line-height: 60px;
}

.nav-bar-avatar {
    vertical-align: middle;
    display: inline-block;
}

.menu-logo {
    height: 60px;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    transition: width .2s;
    background-color: #409EFF;
    color: #ffffff;
}

.menu-logo-display {
    transition: width .2s;
    height: 60px;
    background-color: #409EFF;
    color: #ffffff;
}

.menu-title {
    display: inline-block;
    width: 200px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
}
</style>
