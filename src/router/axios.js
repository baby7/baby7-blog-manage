import axios from 'axios'

const instance = axios.create({
    baseURL: '/blog', // api的base_url
    timeout: 10000, // 请求超时时间
    validateStatus: function(status) {
        return status >= 200 && status <= 500 // 返回其他状态码
    }
});
// request拦截器
instance.interceptors.request.use(
    e => {
        let token = window.sessionStorage.getItem('baby7blog-token');
        e.params = e.params || {};
        if(token != null){
            e.headers = {
                Authorization: token
            };
        }
        else {
            e.headers = e.headers || {};
        }
        //set 默认值
        return e
    },
    error => ({ status: 0, msg: error.message })
);
// respone拦截器
instance.interceptors.response.use(
    response => {
        console.log(response.status)
        const resp = response.data;
        if (response.status === 200) {
            return resp
        }
        if (response.status === 403) {
            window.location.href = "/login"
            return
        }
        return resp
    },
    error => {
        console.log('err' + error); // for debug
        return Promise.reject(error)
    }
);
export default instance
