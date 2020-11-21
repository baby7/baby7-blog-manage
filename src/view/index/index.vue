<template>
    <div style="margin: 5px">
        <el-card class="box-card-info">
            <div slot="header" class="clearfix">
                <span>博客统计</span>
            </div>
            <div class="text item">
                总共发布的博客数量：
                <i v-if="loading" class="el-icon-loading"/>
                <template v-if="!loading">{{metric.blogCount}}</template>
            </div>
            <div class="text item">
                博客总点击量：
                <i v-if="loading" class="el-icon-loading"/>
                <template v-if="!loading">{{metric.lookCount}}</template>
            </div>
            <div class="text item">
                分类总数量：
                <i v-if="loading" class="el-icon-loading"/>
                <template v-if="!loading">{{metric.menuCount}}</template>
            </div>
            <div class="text item">
                标签总数量：
                <i v-if="loading" class="el-icon-loading"/>
                <template v-if="!loading">{{metric.labelCount}}</template>
            </div>
        </el-card>
    </div>
</template>

<script>
import {getMetric} from "@/api/setting";

export default {
    name: "index",
    data() {
        return {
            metric: {
                blogCount: 0,
                lookCount: 0,
                menuCount: 0,
                labelCount: 0
            },
            loading: true
        }
    },
    created() {
        this.loading = true
        this.getMetricInfo()
    },
    methods: {
        getMetricInfo(){
            getMetric().then(res => {
                this.metric = res.data
                this.loading = false
            })
        }
    }
}
</script>

<style scoped>
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card-info {
    width: 480px;
}
</style>
