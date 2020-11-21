<template>
    <div class="app-container">
        <el-dialog title="分类" :visible.sync="dialogFormVisible" append-to-body>
            <el-form :model="form">
                <el-form-item label="标签">
                    <el-input v-model="form.label"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setLabel(form)">确 定</el-button>
            </div>
        </el-dialog>
        <el-button type="primary" icon="el-icon-plus" size="small" style="margin-bottom: 10px" @click="editLabel({})">
            新增标签
        </el-button>
        <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            border>
            <el-table-column align="center" label="ID" width="100">
                <template slot-scope="scope">
                    {{ scope.row.id }}
                </template>
            </el-table-column>
            <el-table-column label="标签">
                <template slot-scope="scope">
                    {{ scope.row.label }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="创建时间" width="160">
                <template slot-scope="scope">
                    <span>{{ ' ' + scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="更新时间" width="160">
                <template slot-scope="scope">
                    <span>{{ ' ' + scope.row.updateTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editLabel(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="delLabel(scope.row.id)">删除</el-button>
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
import {delLabel, getLabelPage, putLabel, addLabel} from "@/api/label";

export default {
    name: "label",
    data() {
        return {
            form: {},
            query: {
                current: 1,
                size: 10
            },
            total: 0,
            list: [
                {
                    id: '',
                    label: '',
                    createTime: '',
                    updateTime: '',
                }
            ],
            listLoading: true,
            dialogFormVisible: false,
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            this.listLoading = true
            this.list = null
            getLabelPage(this.query).then(response => {
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
        editLabel(form) {
            this.form = form
            this.dialogFormVisible = true
        },
        setLabel(form) {
            if(form.id != null) {
                putLabel(form).then(res => {
                    this.dialogFormVisible = false
                    this.$message.success('修改成功！');
                })
            }
            else {
                addLabel(form).then(res => {
                    this.dialogFormVisible = false
                    this.$message.success('添加成功！');
                })
            }
        },
        delLabel(id) {
            this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delLabel(id).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            })
        }
    }
}
</script>

<style scoped>
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

.el-table .cell {
    font-size: 12px;
}
</style>
