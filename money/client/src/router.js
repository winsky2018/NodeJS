import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index'
import Register from './views/Register'
import Login from './views/Login'
import Home from './views/Home'
import Infoshow from './views/Infoshow'
import NotFound from './views/404'
import FundList from './views/FundList'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {path: '', component: Home},
        {path: '/home', name: 'home', component: Home},
        {path: '/infoshow', name: 'infoshow', component: Infoshow},
        {path: '/fundlist', name: 'fundlist', component: FundList}
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      name: '404',
      component: NotFound
    }    
  ]
})

//全局守卫

router.beforeEach((to, from, next) => {
  //获取登录状态
  const isLogin = localStorage.eleToken ? true : false
  if(to.path === '/login' || to.path === '/register'){
    next()
  }else{
    isLogin ? next() : next('/login')
  }
})


export default router