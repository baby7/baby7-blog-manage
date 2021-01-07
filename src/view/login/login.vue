<template>
    <div class="login-main">
        <div id="particles"></div>
        <div class="login-container">
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
                <div class="title-container">
                    <h3 class="title">博客后台管理登录</h3>
                </div>
                <el-form-item prop="username">
                    <span class="svg-container">
                        <svg-icon icon-class="user"/>
                    </span>
                    <el-input
                        class="login-input"
                        ref="username"
                        v-model="loginForm.username"
                        placeholder="用户名"
                        name="username"
                        type="text"
                        tabindex="1"
                        auto-complete="on"/>
                </el-form-item>
                <el-form-item prop="password">
                    <span class="svg-container">
                        <svg-icon icon-class="password"/>
                    </span>
                    <el-input
                        class="login-input"
                        :key="passwordType"
                        ref="password"
                        v-model="loginForm.password"
                        :type="passwordType"
                        placeholder="密码"
                        name="password"
                        tabindex="2"
                        auto-complete="on"
                        @keyup.enter.native="handleLogin"/>
                    <span class="show-pwd" @click="showPwd">
                        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
                    </span>
                </el-form-item>
                <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                           @click.native.prevent="handleLogin">登录
                </el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
import {validUsername} from '@/utils/validate'
import {login} from "@/api/user";

export default {
    name: 'login',
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!validUsername(value)) {
                callback(new Error('请输入正确的用户名'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码不能少于6位'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                username: '',
                password: ''
            },
            loginRules: {
                username: [{required: true, trigger: 'blur', validator: validateUsername}],
                password: [{required: true, trigger: 'blur', validator: validatePassword}]
            },
            loading: false,
            passwordType: 'password',
            redirect: undefined
        }
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    methods: {
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    login(this.loginForm).then(res => {
                        window.sessionStorage.setItem('baby7blog-token', res.data.token)
                        this.loading = false
                        this.$router.push({path: '/index'})
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    },
    mounted() {
        $('#particles').particleground({
            dotColor: '#E8DFE8',
            lineColor: '#133b88'
        });
    }
}
</script>

<style scoped>
.login-main {
    background-image: url("Starry.jpg");
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
}

.login-container {
    position: relative;
}

#particles {
    opacity: 0.7;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
}

.login-container {
    box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
    height: 240px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    top: 0;
    bottom: 0;
    padding: 40px 40px 40px 40px;
    width: 300px;
    background: linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, rgb(0, 0, 0) 100%);
    z-index: 999;
}
.title {
    color: #ffffff;
}
</style>
