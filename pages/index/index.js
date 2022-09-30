//index.js
import { supabase } from '../../lib/supabase'
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    heighestStartScore: 0,
    heighestClassicScore:0,
    heighestExtremeSpeedScore:0,
    longestTime: 0,
    showModalStatus:false,
    maskTitle:'登录',
    email:'',
    password:null,
    userInfo:null,
  },
 
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo : wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : ''
      })
    // })
    if(this.data.userInfo){
      this.getGameSorce()
    }
  },
  onShow(){
    if(this.data.userInfo){
      this.getGameSorce()
    }
  },
  //注册
  loginUp(){
    //打开注册弹窗
    this.setData({
      maskTitle:'注册',
      showModalStatus:true
    })
  },
  //登录
  login(){
    //打开登录弹窗
    this.setData({
      maskTitle:'登录',
      showModalStatus:true
    })
  },
  //弹窗登录操作
  getUserName:function (e){
    this.setData({
      email:e.detail.value
    })
  },
  getPassword:function (e){
    this.setData({
      password:e.detail.value
    })
  },
  reviseTap:async function (){
    //输入款完整校验
    if(!this.data.email || !this.data.password){
      wx.showToast({
        title: '请输入完整的用户名和密码',
        icon: 'none',
        duration: 3000
      });
      return;
    }
    //登录：查询gamer表是否有该用户名，有的话在校验密码，没有直接让去注册
    if(this.data.maskTitle == '登录'){
      const { user, error } = await supabase.auth.signIn({ email: this.data.email, password: this.data.password });
      if (error) {
        wx.showToast({
          title: error.data.error_description  || error.data.msg,
          icon: 'none',
          duration: 3000
        });
        wx.hideLoading();
        return;
      }
      if (data.data) {
        wx.showToast({
          title: '登录成功！',
          icon: 'success',
          duration: 3000
        });
        this.setData({
          userInfo:{email:this.data.email}
        })
        this.getGameSorce()
        wx.setStorageSync('userInfo', {email:this.data.email})
        wx.hideLoading();
      }
    }else if(this.data.maskTitle == '注册'){
    //注册：查询gamer表是否有该用户名，有的话提示用户已存在，没有就帮注册再存储用户信息
    const { data, error } = await supabase.auth.signUp({ email: this.data.email, password: this.data.password });
        if (error) {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
          wx.hideLoading();
          return;
        }
        if (data.data) {
         wx.showToast({
            title: '登录成功！',
            icon: 'success',
            duration: 3000
          });
          this.setData({
            userInfo:{email:this.data.email}
          })
          const resUser= await supabase
          .from('gamer')
          .insert({ user_name:this.data.email,extreme_speed_highscore:0,get_started_highscore:0,classic_highscore:0})
          wx.setStorageSync('userInfo', {email:this.data.email});
          wx.hideLoading();
        }
    }
    this.setData({
      showModalStatus:false
    })
  },
  //登陆成功后查询用户游戏记录
  async getGameSorce(){
    // heighestStartScore heighestClassicScore heighestExtremeSpeedScore
    const startData= await supabase
    .from('get_started')
    .select(`score`).eq("user_name", this.data.userInfo.email).order('score', { ascending: false });
    const classicData = await supabase
    .from('classic')
    .select(`score`).eq("user_name", this.data.userInfo.email).order('score', { ascending: false });
    const extremeSpeedData = await supabase
    .from('extreme_speed')
    .select(`score`).eq("user_name", this.data.userInfo.email).order('score', { ascending: false });
    if(startData.data && startData.data.data.length > 0){
      this.setData({
        heighestStartScore:startData.data.data[0].score
      })
    }else if(startData.error){
      wx.showToast({
        title: '查询最高分出错',
        icon: 'error',
        duration: 3000
      });
    }
    if(classicData.data && classicData.data.data.length > 0){
      this.setData({
        heighestClassicScore:classicData.data.data[0].score
      })
    }else if(classicData.error){
      wx.showToast({
        title: '查询最高分出错',
        icon: 'error',
        duration: 3000
      });
    }
    if(extremeSpeedData.data && extremeSpeedData.data.data.length > 0){
      this.setData({
        heighestExtremeSpeedScore:extremeSpeedData.data.data[0].score
      })
    }else if(extremeSpeedData.error){
      wx.showToast({
        title: '查询最高分出错',
        icon: 'error',
        duration: 3000
      });
    }
  },
  loginOut(){
    wx.removeStorageSync('userInfo');
    this.setData({
      userInfo:null
    })
  },
  //查看排名
  rankings(){
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goGame: function(event){
    if(!this.data.userInfo.email){
      wx.showToast({
        title: '请先加入全国队列哦，请登录',
        icon: 'none',
        duration: 3000
      });
      return
    }
    var gameType = event.target.id;
    wx.navigateTo({
      url: '../'+gameType+'/play'
    })
  },
  close:function (){
    this.setData({
      showModalStatus:false
    })
  },

})
