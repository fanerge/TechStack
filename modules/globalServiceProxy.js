/*
* 全局请求拦截（全局处理token过期、session过期、请求超时、服务失败）
*/
// 我司工具函数库，包括网络请求
import util from 'util'; 

const ErrorMap = {
  '10001': '登录凭证实现，请重新登录！',
  '10002': '登录失效，请重新登录！',
  '10003': '调用服务超市，请稍后再试！',
  '10004': '服务位发布，请联系管理员！',
  '10005': '参数出错，请检查入参！'
};

function serviceProxy() {
  // 保存原函数引用，该函数返回 Promise
  const func = util.service;

  util.service = function() {
    const promise = new Promise((resolbe, reject) => {
      func.apply(util, arguments).then(res => {

        // 处理服务器无返回数据场景
        if(!res) {
          util.message.error('服务无返回')；
          return;
        }

        // 服务处理失败场景
        if(!res.success){

          util.message.error(ErrorMap[res.errorCode])；
          return;
        }

        // 正常情况对应方法进行处理
        resolve(res)
      }).catch(err => {
        reject(err);
      });
    });

    // 和原 util.service 一样均返回 Promise
    return promise;
  };

}