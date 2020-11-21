<template>
    <div class="app-container">
        <mavon-editor
            ref="md"
            v-model="value"
            @imgAdd="handleEditorImgAdd"
            @imgDel="handleEditorImgDel"/>
        <div style="height: 45px">
            <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                style="margin-top: 10px;float: right"
                @click="setBloggerInfo">
                修改博主介绍
            </el-button>
        </div>
    </div>
</template>

<script>
import {getBlogger,setBlogger} from "@/api/setting";
import {upload} from "@/api/file";

export default {
    name: "index",
    data() {
        return {
            value: "",
            imgFile: []
        }
    },
    methods: {
        getBloggerInfo() {
            getBlogger().then(res => {
                this.value = res.data.blogger
            })
        },
        setBloggerInfo() {
            setBlogger({blogger:this.value}).then(res => {
                this.$message.success('修改成功！');
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
                let content = this.value
                // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)  这里是必须要有的
                if (content.includes(name)) {
                    let oStr = `(${pos})`
                    let nStr = `(${url})`
                    let index = content.indexOf(oStr)
                    let str = content.replace(oStr, '')
                    let insertStr = (soure, start, newStr) => {
                        return soure.slice(0, start) + newStr + soure.slice(start)
                    }
                    value = insertStr(str, index, nStr)
                }
            })
        },
        handleEditorImgDel (pos) {
            delete this.imgFile[pos]
        },
    },
    created() {
        this.getBloggerInfo()
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
</style>
