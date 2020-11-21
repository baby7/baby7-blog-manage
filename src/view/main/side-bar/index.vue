<template>
    <el-menu class="el-menu-vertical-demo" :collapse="isCollapse">
        <template v-for="(menu, index) in menuList">
            <div @click="goTo(menu.path, menu.query, menu.title)">
                <el-menu-item :index="index">
                    <i :class="'el-icon-'+menu.icon"></i>
                    <span slot="title">{{ menu.title }}</span>
                </el-menu-item>
            </div>
        </template>
    </el-menu>
</template>

<script>
export default {
    name: "SideBar",
    props: {
        isCollapse: {
            type: Boolean,
            require: true
        }
    },
    data() {
        return {
            menuList: [
                {icon: "house", title: "博客信息", path: "/index", query: {}},
                {icon: "document-copy", title: "博客列表", path: "/myBlog", query: {}},
                {icon: "edit", title: "博客编辑", path: "/edit", query: {}},
                {icon: "menu", title: "分类管理", path: "/menu", query: {}},
                {icon: "collection-tag", title: "标签管理", path: "/label", query: {}},
                {icon: "link", title: "友链管理", path: "/link", query: {}},
                {icon: "chat-dot-square", title: "留言板管理", path: "/comment", query: {}},
                {icon: "user", title: "博主介绍", path: "/my", query: {}},
                {icon: "setting", title: "博客设置", path: "/setting", query: {}},
            ]
        }
    },
    methods: {
        goTo(path, query, title) {
            this.$store.state.NowMenuTitle = title
            this.$router.push({path: path, query: query})
        }
    },
    computed: {
        isFollow () {
            return this.$store.state.NowMenuIndex;
        }
    },
    watch: {
        isFollow (newVal, oldVal) {

        },
    }
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    height: 100%;
}
</style>
