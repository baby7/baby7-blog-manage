<template>
    <div class="app-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="basic">
                <el-form ref="form" :model="form" label-width="80px" style="width: 500px">
                    <el-form-item label="头像">
                        <el-upload
                            class="avatar-uploader"
                            :multiple="true"
                            :action="actionPath"
                            accept="image/jpeg,image/gif,image/png,image/bmp"
                            :data="postData"
                            :on-success="handleAvatarSuccess">
                            <img v-if="form.avatar" :src="form.avatar" class="avatar one_hundred_percent"
                                 alt="shortImg">
                            <i v-else class="el-icon-plus avatar-uploader-icon" style="line-height: 178px;"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名">
                        <el-input :disabled="true" v-model="form.username"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="password">
                <el-form ref="form" :model="form" label-width="80px" style="width: 500px">
                    <el-form-item label="原密码">
                        <el-input v-model="oldPassword" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input v-model="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input v-model="passwordAgain" show-password></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <div style="height: 45px">
            <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                style="margin-left: 80px"
                @click="onSubmit">
                修改
            </el-button>
        </div>
    </div>
</template>

<script>
import {getInfo,setInfo,setPassword} from "@/api/user";

export default {
    name: "manager",
    data() {
        return {
            form: {
                name: "",
                avatar: "",
                username: "",
                password: ""
            },
            passwordAgain: "",
            postData: {},
            actionPath: "/blog/file/change/save",
            activeName: "basic",
            oldPassword: "",
            password: "",
            tableIndex: 0
        }
    },
    methods: {
        getData() {
            getInfo().then(res => {
                this.form = res.data
            })
        },
        handleAvatarSuccess(res, file) {
            if(res.data.substring(0,1) != "h"){
                this.form.avatar = '/blog' + res.data
            }
            else {
                this.form.avatar = res.data
            }
        },
        onSubmit() {
          if(this.tableIndex == 0){
            //修改用户信息
            setInfo(this.form.name, this.form.avatar, this.form.username).then(res => {
              this.$message.success('修改成功！');
              // setTimeout(function(){ location.reload(); }, 500);
            })
          }
          else {
            //修改密码
            if(this.password !== this.passwordAgain) {
              this.$message.error('输入两次密码不一致');
            }
            else {
              setPassword(this.oldPassword, this.password, this.form.username).then(res => {
                if(res.code == 0){
                  this.$message.success('修改成功！');
                  setTimeout(function(){ location.reload(); }, 500);
                }
                else {
                  this.$message.error(res.msg);
                }
              })
            }
          }
        },
        handleClick(item) {
          this.tableIndex = item.$data.index
        }
    },
    created() {
        this.$store.state.NowMenuTitle = "管理员设置"
        this.getData()
    }
}
</script>

<style>
.app-container {
    margin: 5px;
    font-size: 12px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    padding: 10px;
    padding-left: 30px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
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
</style>
