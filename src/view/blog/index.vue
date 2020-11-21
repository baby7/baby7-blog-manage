<template>
    <div class="app-container">
        <el-dialog title="评论" :visible.sync="dialogFormVisible" append-to-body>
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
        </el-dialog>
        <el-button type="primary" icon="el-icon-edit" size="small" style="margin-bottom: 10px" @click="editBlog(0)">发布博客</el-button>
        <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            border>
            <el-table-column align="center" label="ID" width="50">
                <template slot-scope="scope">
                    {{ scope.row.id }}
                </template>
            </el-table-column>
            <el-table-column label="标题">
                <template slot-scope="scope">
                    {{ scope.row.title }}
                </template>
            </el-table-column>
            <el-table-column label="介绍">
                <template slot-scope="scope">
                    {{ scope.row.introduce }}
                </template>
            </el-table-column>
            <el-table-column label="图片" width="50" align="center">
                <template slot-scope="scope">
                    <i v-if="scope.row.img != null" class="el-icon-picture-outline"></i>
                </template>
            </el-table-column>
            <el-table-column label="点击量" width="70" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.lookNum }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="发布时间" width="160">
                <template slot-scope="scope">
                    <span>{{ ' ' + scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="最后修改" width="160">
                <template slot-scope="scope">
                    <span>{{ ' ' + scope.row.updateTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="操作" width="160">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editComment(scope.row.id)">评论管理</el-button>
                    <el-button type="text" size="small" @click="editBlog(scope.row.id)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteBlog(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :current-page="query.current"
                :page-size="query.size"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {getBlogPage} from '@/api/blog'
import {delComment, getCommentTree} from "@/api/comment";

export default {
    name: "Blog",
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: 'success',
                draft: 'gray',
                deleted: 'danger'
            }
            return statusMap[status]
        }
    },
    data() {
        return {
            query: {
                current: 1,
                size: 10
            },
            total: 0,
            list: [
                {
                    id: '',
                    img: '',
                    title: '',
                    lookNum: '',
                    introduce: '',
                    createTime: '',
                    updateTime: '',
                }
            ],
            listLoading: true,
            dialogFormVisible: false,
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            this.listLoading = true
            this.list = null
            getBlogPage(this.query).then(response => {
                this.list = response.data.records
                this.total = response.data.total
                this.listLoading = false
            })
        },
        //分页
        handleCurrentChange(val) {
            this.query.current = val;
            this.fetchData();
        },
        editBlog(id) {
            if(id === 0){
                this.$router.push({path: '/edit'})
            }
            else {
                this.$router.push({path: '/edit?id=' + id})
            }
        },
        editComment(id) {
            this.dialogFormVisible = true
            getCommentTree(id).then(res => {
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
        deleteBlog(id) {
            this.$confirm('此操作将永久删除该博客, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            })
        },
        delComment(id) {
            this.$confirm('此操作将永久删除该博客, 是否继续?', '提示', {
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
    }
}
</script>

<style>
.block {
    margin-top: 10px;
    text-align: right;
}

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
