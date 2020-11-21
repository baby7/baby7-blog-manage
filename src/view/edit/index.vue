<template>
    <div class="app-container">
        <basic-container>
            <el-container>
                <!------ 博客属性 ------->
                <el-aside width="30%" style="border-right:1px solid #DCDFE6;">
                    <div class="blog_attributes">
                        <h3 v-if="form.id">博客属性&nbsp;<el-tag>编辑</el-tag>
                        </h3>
                        <h3 v-if="!form.id">博客属性&nbsp;<el-tag>新增</el-tag>
                        </h3>
                        <el-divider></el-divider>
                        <el-form ref="form" :model="form" label-width="40px">
                            <el-form-item v-show="form.id" label="ID">
                                <el-input disabled v-model="form.id" class="one_hundred_percent"></el-input>
                            </el-form-item>
                            <el-form-item label="标题">
                                <el-input v-model="form.title" class="one_hundred_percent"></el-input>
                            </el-form-item>
                            <el-form-item label="介绍">
                                <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 3, maxRows: 5}"
                                    placeholder="请输入内容"
                                    v-model="form.introduce"
                                    class="one_hundred_percent">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="菜单">
                                <div class="block">
                                    <el-select v-model="form.menuId" placeholder="请选择" class="one_hundred_percent">
                                        <el-option v-for="item in menuList" :key="item.id+''" :label="item.name"
                                                   :value="item.id+''"></el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                            <el-form-item label="标签">
                                <el-select v-model="labelIds" multiple placeholder="请选择"
                                           class="one_hundred_percent" value="labelIds">
                                    <el-option v-for="item in labelList" :key="item.id" :label="item.label"
                                               :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="图片" class='add_company'>
                                <el-upload
                                    class="avatar-uploader"
                                    :action="actionPath"
                                    accept="image/jpeg,image/gif,image/png,image/bmp"
                                    :data="postData"
                                    :on-success="(response)=>{return imgSuccess(response, form)}">
                                    <img v-if="form.img" :src="form.img" class="avatar one_hundred_percent"
                                         alt="shortImg">
                                    <i v-else class="el-icon-plus avatar-uploader-icon short_img_icon"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item>
                                <el-button v-if="form.id" type="primary" @click="setBlogData(form)">保存</el-button>
                                <el-button v-if="!form.id" type="primary" @click="addBlogData(form)">创建</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-aside>
                <!------ 博客编辑 ------->
                <el-main style="padding: 0;">
                    <div class="blog_attributes">
                        <h3 style="height: 32px;">博客编辑</h3>
                        <el-divider></el-divider>
                        <div v-if="isShowContent" class="one_hundred_percent">
                            <mavon-editor
                                ref="md"
                                v-model="form.content"
                                @imgAdd="handleEditorImgAdd"
                                @imgDel="handleEditorImgDel"/>
                        </div>
                    </div>
                </el-main>
            </el-container>
        </basic-container>
    </div>
</template>

<script>
import {getMenuList} from "@/api/menu";
import {getLabelList} from "@/api/label";
import {addBlog, getBlog, putBlog} from "@/api/blog";
import {upload} from "@/api/file";

export default {
    name: "index",
    data() {
        return {
            labelList: [{id: 0, label: ""}],
            menuList: [{id: 0, name: ""}],
            options: [],
            form: {
                id: this.$route.query.id,
                menuId: [],
                content: '',
                title: '',
                img: '',
                introduce: ''
            },
            labelIds: [],
            isShowContent: true,
            editType: this.$route.query.editType,
            value: "",
            imgFile: [],
            postData: {},
            actionPath: "/blog/file/change/save"
        }
    },
    methods: {
        imgSuccess(res, form) {
            if(res.data.substring(0,1) != "h"){
                form.img = '/blog' + res.data
            }
            else {
                form.img = res.data
            }
        },
        getBlogMenuList() {
            getMenuList().then(res => {
                this.menuList = res.data
            })
        },
        getBlogLabelList() {
            getLabelList().then(res => {
                this.labelList = res.data
            })
        },
        getBlogInfo() {
            if (this.$route.query.id != null) {
                getBlog(this.form.id).then(res => {
                    this.form = res.data
                    this.labelIds = []
                    for (let i = 0; i < res.data.labelList.length; i++) {
                        this.labelIds.push(res.data.labelList[i].id)
                    }
                })
            }
        },
        getData() {
            this.getBlogMenuList()
            this.getBlogLabelList()
            this.getBlogInfo()
        },
        setBlogData(form) {
            form.labelIdList = this.labelIds
            putBlog(form).then(res => {
                this.$message.success('修改成功！');
            })
        },
        addBlogData(form) {
            addBlog(form).then(res => {
                this.$message.success('添加成功！');
            })
        },
        handleEditorImgAdd (pos, $file) {
            let formdata = new FormData()
            formdata.append('file', $file)
            this.imgFile[pos] = $file
            upload(formdata).then(response => {
                let url = response.data
                if(url.substring(0,1) != "h"){
                    url = '/blog' + url
                }
                let name = $file.name
                if (name.includes('-')) {
                    name = name.replace(/-/g, '')
                }
                let content = this.form.content
                // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)  这里是必须要有的
                if (content.includes(name)) {
                    let oStr = `(${pos})`
                    let nStr = `(${url})`
                    let index = content.indexOf(oStr)
                    let str = content.replace(oStr, '')
                    let insertStr = (soure, start, newStr) => {
                        return soure.slice(0, start) + newStr + soure.slice(start)
                    }
                    this.form.content = insertStr(str, index, nStr)
                }
            })
        },
        handleEditorImgDel (pos) {
            delete this.imgFile[pos]
        },
    },
    created() {
        this.menuList = []
        this.labelList = []
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

.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
}

.avatar-uploader {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.blog_attributes {
    padding: 10px;
    margin: 10px 5px 5px;
}

.one_hundred_percent {
    width: 100%;
    height: 100%;
}
</style>
