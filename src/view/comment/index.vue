<template>
    <div class="app-container">
        <el-tree
            :default-expand-all="true"
            :data="data"
            :props="defaultProps">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                        <el-button
                            type="text"
                            size="large"
                            @click="() => delComment(data.id)">
                            删除
                        </el-button>
                    </span>
                </span>
        </el-tree>
    </div>
</template>

<script>
import {getCommentTree,delComment} from "@/api/comment";

export default {
    name: "comment",
    data() {
        return {
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            commentTree: []
        }
    },
    methods: {
        getData() {
            getCommentTree(0).then(res => {
                let commentTree = res.data
                this.data = []
                for (let i = 0; i < commentTree.length; i++) {
                    let commentNode = commentTree[i]
                    let dataNode = {
                        id: commentNode.id,
                        label: commentNode.nickname + " - " +  commentNode.content.substring(0,20),
                        children: []
                    }
                    for (let j = 0; j < commentNode.childrenList.length; j++) {
                        dataNode.children.push({
                            id: commentNode.childrenList[j].id,
                            label: commentNode.childrenList[j].nickname + " - " +  commentNode.childrenList[j].content
                        })
                    }
                    this.data.push(dataNode)
                }
            })
        },
        delComment(id) {
            this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delComment(id).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getData()
                })
            })
        }
    },
    created() {
        this.getData()
    }
}
</script>

<style scoped>
.app-container {
    margin: 5px;
    padding: 10px;
    font-size: 12px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    padding-right: 8px;
}
</style>
