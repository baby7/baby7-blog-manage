<template>
    <div class="app-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="博客信息" name="blog">
                <el-form ref="form" :model="form" label-width="120px" style="width: 700px">
                    <el-form-item label="图标">
                        <el-upload
                            class="avatar-uploader"
                            :multiple="true"
                            :action="actionPath"
                            accept="image/jpeg,image/gif,image/png,image/bmp"
                            :data="postData"
                            :on-success="blogImageSuccess">
                            <img v-if="form.icon" :src="form.icon" class="avatar one_hundred_percent"
                                 alt="shortImg">
                            <i v-else class="el-icon-plus avatar-uploader-icon" style="line-height: 178px;"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="博客标题">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="博客介绍">
                        <el-input v-model="form.describe"></el-input>
                    </el-form-item>
                    <el-form-item label="博客创建时间">
                        <el-input v-model="form.createTime" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="最后修改时间">
                        <el-input v-model="form.updateTime" :disabled="true"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="博主信息" name="blogger">
                <el-form ref="form" :model="form" label-width="120px" style="width: 700px">
                    <el-form-item label="博主头像">
                        <el-upload
                            class="avatar-uploader"
                            :multiple="true"
                            :action="actionPath"
                            accept="image/jpeg,image/gif,image/png,image/bmp"
                            :data="postData"
                            :on-success="bloggerAvatarSuccess">
                            <img v-if="form.avatar" :src="form.avatar" class="avatar one_hundred_percent"
                                 alt="shortImg">
                            <i v-else class="el-icon-plus avatar-uploader-icon" style="line-height: 178px;"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="博主名称">
                        <el-input v-model="form.nickname"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="社交账号" name="socialAccounts">
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="社交账号">
                        <template v-for="(socialAccount, i) in form.socialAccounts">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>{{ socialAccount.type }}</span>
                                    <el-button style="float: right; padding: 12px" type="text"
                                               @click="delSocialAccount(socialAccount.type)">删除
                                    </el-button>
                                </div>
                                <div class="social-img">
                                    <el-form-item label="图标" label-width="60px">
                                        <el-upload
                                            class="avatar-uploader"
                                            style="height: 130px"
                                            :multiple="true"
                                            :action="actionPath"
                                            accept="image/jpeg,image/gif,image/png,image/bmp"
                                            :data="postData"
                                            :on-success="(response)=>{return socialImgSuccess(response, form.socialAccounts, i)}">
                                            <img v-if="socialAccount.icon" :src="socialAccount.icon" class="avatar"
                                                 style="height: 130px" alt="shortImg">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"
                                               style="line-height: 130px;height: 130px"></i>
                                        </el-upload>
                                    </el-form-item>
                                    <el-form-item label="二维码" label-width="60px">
                                        <el-upload
                                            class="avatar-uploader"
                                            style="margin-top: 10px"
                                            :multiple="true"
                                            :action="actionPath"
                                            accept="image/jpeg,image/gif,image/png,image/bmp"
                                            :data="postData"
                                            :on-success="(response)=>{return socialQrSuccess(response, form.socialAccounts, i)}">
                                            <img v-if="socialAccount.qr" :src="socialAccount.qr" class="avatar"
                                                 alt="shortImg">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"
                                               style="line-height: 178px;"></i>
                                        </el-upload>
                                    </el-form-item>
                                </div>
                            </el-card>
                        </template>
                        <el-button type="primary"
                                   icon="el-icon-user"
                                   @click="addSocialAccount">
                            添加社交账号
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="上传设置" name="upload">
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="社交账号">
                    <el-card class="box-card" style="height: 309px">
                        <div slot="header" class="clearfix" style="font-size: 16px">
                            <span>
                                {{ form.uploadFile.local.name }}&nbsp;
                                <el-tag v-if="form.uploadFile.local.state">默认</el-tag>
                            </span>
                            <el-button
                                v-if="!form.uploadFile.local.state"
                                style="float: right; padding: 12px"
                                type="text"
                                @click="setUploadServer(form.uploadFile.local.name)">设为默认
                            </el-button>
                        </div>
                        <div class="social-img">
                            <span>
                                直接上传到服务器存储，但是加载速度受限于服务器带宽，带宽不高的博主不建议采用
                            </span>
                        </div>
                    </el-card>
                    <el-card class="box-card" style="width: 500px">
                        <div slot="header" class="clearfix" style="font-size: 16px">
                            <span>
                                {{ form.uploadFile.qiniu.name }}&nbsp;
                                <el-tag v-if="form.uploadFile.qiniu.state">默认</el-tag>
                                    <el-button
                                        v-if="form.uploadFile.local.state"
                                        style="float: right; padding: 12px"
                                        type="text"
                                        @click="setUploadServer(form.uploadFile.qiniu.name)">设为默认
                                    </el-button>
                            </span>
                        </div>
                        <div class="social-img">
                            <el-form-item label="accessKey" style="margin-bottom: 22px">
                                <el-input v-model="form.uploadFile.qiniu.accessKey"></el-input>
                            </el-form-item>
                            <el-form-item label="secretKey" style="margin-bottom: 22px">
                                <el-input v-model="form.uploadFile.qiniu.secretKey"></el-input>
                            </el-form-item>
                            <el-form-item label="bucket" style="margin-bottom: 22px">
                                <el-input v-model="form.uploadFile.qiniu.bucket"></el-input>
                            </el-form-item>
                            <el-form-item label="path" style="margin-bottom: 22px">
                                <el-input v-model="form.uploadFile.qiniu.path"></el-input>
                            </el-form-item>
                            <el-form-item label="地区" style="margin-bottom: 22px">
                                <el-select v-model="form.uploadFile.qiniu.local" placeholder="请选择">
                                    <template v-for="item in localOptions">
                                        <el-option
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-card>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="背景图片" name="background">
                <el-form ref="form" :model="form" label-width="120px" style="width: 700px">
                    <el-form-item label="背景图片">
                        <el-upload
                            class="avatar-uploader"
                            style="height: 400px;width: 800px;"
                            :multiple="true"
                            :action="actionPath"
                            accept="image/jpeg,image/gif,image/png,image/bmp"
                            :data="postData"
                            :on-success="backgroundSuccess">
                            <img v-if="form.backgroundImg" :src="form.backgroundImg" class="avatar"
                                 style="height: 400px;width: 800px;" alt="shortImg">
                            <i v-else class="el-icon-plus avatar-uploader-icon"
                               style="line-height: 400px;height: 400px;width: 800px;"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="默认博客图片" name="defaultImg">
                <el-form ref="form" :model="form" label-width="120px" style="width: 700px">
                    <el-form-item label="默认博客图片">
                        <el-upload
                            class="avatar-uploader"
                            style="height: 400px;width: 400px;"
                            :multiple="true"
                            :action="actionPath"
                            accept="image/jpeg,image/gif,image/png,image/bmp"
                            :data="postData"
                            :on-success="blogDefaultImgSuccess">
                            <img v-if="form.defaultImg" :src="form.defaultImg" class="avatar"
                                 style="height: 400px;width: 400px;" alt="shortImg">
                            <i v-else class="el-icon-plus avatar-uploader-icon"
                               style="line-height: 400px;height: 400px;width: 400px;"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="自动收录" name="push">
                <el-form ref="form" :model="form" label-width="120px" style="width: 700px">
                    <el-form-item label="百度" class="plugins">
                        <el-switch v-model="form.push.baidu.state"></el-switch>
                    </el-form-item>
                    <el-form-item label="360" class="plugins" style="height: 120px">
                        <el-switch v-model="form.push['360'].state"></el-switch>
                        <el-form-item label="绑定值" label-width="70px">
                            <el-input v-model="form.push['360'].value"></el-input>
                            <div class="el-form-item__error">
                                绑定值是各大搜索引擎所属站长平台分配给站长的唯一值
                            </div>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="头条" class="plugins" style="height: 120px">
                        <el-switch v-model="form.push.toutiao.state"></el-switch>
                        <el-form-item label="绑定值" label-width="70px">
                            <el-input v-model="form.push.toutiao.value"></el-input>
                            <div class="el-form-item__error">
                                绑定值是各大搜索引擎所属站长平台分配给站长的唯一值
                            </div>
                        </el-form-item>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="插件" name="plugins">
                <el-form ref="form" :model="form" label-width="120px" style="width: 700px">
                    <el-form-item label="背景粒子特效" class="plugins">
                        <el-switch v-model="form.plugins.particles.state"></el-switch>
                    </el-form-item>
                    <el-form-item label="背景穿越特效" class="plugins">
                        <el-switch v-model="form.plugins.starfield.state"></el-switch>
                    </el-form-item>
                    <el-form-item label="背景下雪特效" class="plugins">
                        <el-switch v-model="form.plugins.snow.state"></el-switch>
                    </el-form-item>
                    <el-form-item label="下方海中鱼特效" class="plugins">
                        <el-switch v-model="form.plugins.flyingFish.state"></el-switch>
                    </el-form-item>
                    <el-form-item label="上吊猫" class="plugins" style="height: 120px">
                        <el-switch v-model="form.plugins.backToTop.state"></el-switch>
                        <el-form-item label="资源路径" label-width="70px">
                            <el-input v-model="form.plugins.backToTop.cdnPath"></el-input>
                            <div class="el-form-item__error">
                                上吊猫插件默认服务器存储地址为:static/backToTop/gototop.png，可以下载插件文件后配置cdn地址进行加速
                            </div>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="Live2d" class="plugins">
                        <el-switch v-model="form.plugins.live2dw.state"></el-switch>
                        <el-form-item label="位置" label-width="70px">
                            <el-radio v-model="form.plugins.live2dw.position" label="left">左边</el-radio>
                            <el-radio v-model="form.plugins.live2dw.position" label="right">右边</el-radio>
                        </el-form-item>
                        <el-form-item label="高度" label-width="70px">
                            <el-input v-model="form.plugins.live2dw.height"></el-input>
                        </el-form-item>
                        <el-form-item label="宽度" label-width="70px">
                            <el-input v-model="form.plugins.live2dw.width"></el-input>
                        </el-form-item>
                        <el-form-item label="高度偏移" label-width="70px">
                            <el-input v-model="form.plugins.live2dw.hOffset"></el-input>
                        </el-form-item>
                        <el-form-item label="宽度偏移" label-width="70px">
                            <el-input v-model="form.plugins.live2dw.vOffset"></el-input>
                        </el-form-item>
                        <el-form-item label="资源路径" label-width="70px">
                            <el-input v-model="form.plugins.live2dw.cdnPath"></el-input>
                            <div class="el-form-item__error">
                                Live2d插件默认服务器存储地址为:static/，可以下载插件文件后配置cdn地址进行加速
                            </div>
                        </el-form-item>
                        <el-form-item label="看板娘" label-width="70px" style="margin-top: 35px">
                            <el-select v-model="form.plugins.live2dw.type" placeholder="请选择">
                                <template v-for="item in live2dwList">
                                    <el-option
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="网站信息" name="website">
                <el-form ref="form" :model="form" label-width="120px" style="width: 700px">
                    <el-form-item label="管局地址">
                        <el-input v-model="form.recordUrl"></el-input>
                    </el-form-item>
                    <el-form-item label="备案号">
                        <el-input v-model="form.recordNumber"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <div style="height: 45px">
            <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                style="margin-left: 120px"
                @click="changeSetting">
                修改博客设置
            </el-button>
        </div>
    </div>
</template>

<script>
import {getSetting,putSetting} from "@/api/setting";

export default {
    name: "index",
    data() {
        return {
            form: {
                nickname: "",
                title: "",
                icon: "",
                avatar: "",
                socialAccounts: [
                    {
                        type: "微信",
                        icon: "https://media.baby7blog.com/img/blogger/weixin.png",
                        qr: ""
                    },
                    {
                        type: "QQ",
                        icon: "https://media.baby7blog.com/img/blogger/qq.png",
                        qr: ""
                    }
                ],
                push: {
                    baidu: {
                        state: false
                    },
                    360: {
                        state: false,
                        value: ""
                    },
                    toutiao: {
                        state: false,
                        value: ""
                    }
                },
                uploadFile: {
                    local: {
                        state: true,
                        name: "服务器上传"
                    },
                    qiniu: {
                        state: true,
                        name: "七牛云存储",
                        accessKey: "",
                        secretKey: "",
                        bucket: "",
                        path: "",
                        local: ""
                    }
                },
                plugins: {
                    particles: {
                        state: false
                    },
                    starfield: {
                        state: false
                    },
                    live2dw: {
                        state: false,
                        cdnPath: "http://cdn.baby7blog.com/",
                        type: "rem",
                        position: "right",
                        width: 250,
                        height: 500,
                        hOffset: 0,
                        vOffset: -110
                    },
                    flyingFish: {
                        state: false
                    },
                    backToTop: {
                        state: false,
                        cdnPath: "http://cdn.baby7blog.com/gototop.png"
                    },
                    snow: {
                        state: false
                    }
                },
                describe: "主要记录自己在写程序过程中的发现、问题、成果",
                backgroundImg: "",
                defaultImg: "",
                recordUrl: "http://beian.miit.gov.cn",
                recordNumber: "",
                createTime: "2019-04-10 20:51:03",
                updateTime: "2020-11-03 00:00:00"
            },
            localOptions: [
                {value: 'huadong', label: '华东'},
                {value: 'huabei', label: '华北'},
                {value: 'huanan', label: '华南'},
                {value: 'beimei', label: '北美'},
                {value: 'xinjiapo', label: '东南亚'}
            ],
            postData: {},
            actionPath: "/blog/file/change/save",
            activeName: "blog",
            live2dwList: [
                { value: "chitose", label: "chitose"},
                { value: "epsilon2_1", label: "Epsilon2.1"},
                { value: "gf", label: "Gantzert_Felixander"},
                { value: "haru_1", label: "haru1"},
                { value: "haru_2", label: "haru2"},
                { value: "haruto", label: "haruto"},
                { value: "hijiki", label: "hijiki"},
                { value: "izumi", label: "izumi"},
                { value: "koharu", label: "koharu"},
                { value: "miku", label: "miku"},
                { value: "ni-j", label: "ni-j"},
                { value: "nico", label: "nico"},
                { value: "nietzsche", label: "nietzche"},
                { value: "nipsilon", label: "nipsilon"},
                { value: "nito", label: "nito"},
                { value: "rem", label: "rem"},
                { value: "shizuku", label: "shizuku"},
                { value: "tororo", label: "tororo"},
                { value: "tsumiki", label: "tsumiki"},
                { value: "unitychan", label: "Unitychan"},
                { value: "wanko", label: "wanko"},
                { value: "z16", label: "z16"}
            ]
        }
    },
    methods: {
        getData() {
            getSetting().then(res => {
                this.form = res.data
            })
        },
        addSocialAccount() {
            this.$prompt('请输入社交网站名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({value}) => {
                this.form.socialAccounts.push({
                    type: value,
                    icon: "",
                    qr: ""
                })
            });
        },
        delSocialAccount(type) {
            let socialAccounts = []
            for (let i = 0; i < this.form.socialAccounts.length; i++) {
                if (this.form.socialAccounts[i].type + "" !== type + "") {
                    socialAccounts.push(this.form.socialAccounts[i])
                }
            }
            this.form.socialAccounts = socialAccounts
        },
        handleClick() {

        },
        setUploadServer(name){
            for (let uploadFileKey in this.form.uploadFile) {
                this.form.uploadFile[uploadFileKey].state = name === this.form.uploadFile[uploadFileKey].name;
            }
        },
        changeSetting() {
            putSetting(this.form).then(res => {
                this.$message.success('修改成功！');
            })
        },
        // 博客图片
        blogImageSuccess(res) {
            if(res.data.substring(0,1) != "h")
                this.form.icon = '/blog' + res.data
            else
                this.form.icon = res.data
        },
        // 博主头像
        bloggerAvatarSuccess(res) {
            if(res.data.substring(0,1) != "h")
                this.form.avatar = '/blog' + res.data
            else
                this.form.avatar = res.data
        },
        // 社交图标
        socialImgSuccess(res, socialAccounts, i) {
            if(res.data.substring(0,1) != "h")
                socialAccounts[i].icon = '/blog' + res.data
            else
                socialAccounts[i].icon = res.data
        },
        // 社交二维码
        socialQrSuccess(res, socialAccounts, i) {
            if(res.data.substring(0,1) != "h")
                socialAccounts[i].qr = '/blog' + res.data
            else
                socialAccounts[i].qr = res.data
        },
        // 背景图片
        backgroundSuccess(res) {
            if(res.data.substring(0,1) != "h")
                this.form.backgroundImg = '/blog' + res.data
            else
                this.form.backgroundImg = res.data
        },
        // 博客默认图片
        blogDefaultImgSuccess(res) {
            if(res.data.substring(0,1) != "h")
                this.form.defaultImg = '/blog' + res.data
            else
                this.form.defaultImg = res.data
        },
    },
    created() {
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
    padding: 20px 10px 10px;
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

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    width: 260px;
    float: left;
    margin-right: 10px;
}

.box-card > div {
    padding: 5px 5px 5px 10px;
}

.plugins {
    margin: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .2);
    padding: 20px 10px 10px;
}
</style>
