//logs.js
import { supabase } from '../../lib/supabase'
Page({
  data: {
    logs: [],
    get_started_highscore:null,
    classic_highscore:null,
    extreme_speed_highscore:null,
    userInfo:null
  },
  onShow: function () {
    this.setData({
      userInfo : wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : null
    })
    if(this.data.userInfo){
      this.getScore()
    }
  },
  //获取用户排名情况
 async getScore(){
    const get_started_highscore = await supabase.from('gamer').select('*').order('get_started_highscore', { ascending: false });
    const classic_highscore = await supabase.from('gamer').select('*').order('classic_highscore', { ascending: false });
    const extreme_speed_highscore = await supabase.from('gamer').select('*').order('extreme_speed_highscore', { ascending: false });
    if(get_started_highscore.data){
      this.setData({
        get_started_highscore:get_started_highscore.data.data
      })
    }
    if(classic_highscore.data){
      this.setData({
        classic_highscore:classic_highscore.data.data
      })
    }
    if(extreme_speed_highscore.data){
      this.setData({
        extreme_speed_highscore:extreme_speed_highscore.data.data
      })
    }
  }
})
