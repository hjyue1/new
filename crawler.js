"use strict"
var phantomjs = require('phantomjs-prebuilt')
var webdriverio = require('webdriverio')
var wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }
var MPromise = require('mpromise');
var cheerio = require('cheerio')
var sendAliMessage = require ('./SMS_serve').default;
//链接数据库
var mongoose = require('mongoose');
var Shuju = require('./mongodbConfig').shuju;
mongoose.Promise = global.Promise


let calcNum = 0;
const defineSelect_web = {
    msd: {url:'http://www.maishoudang.com/', name: '买手党'}
}


const search = {
    select_web: defineSelect_web.msd.url, //关注的网站
    web_name : defineSelect_web.msd.name, //网站名字
    frequency: 1, //监控的频率
    waitTime: 30, //等待超时的时间
    notice: true, //是否通知手机
    cycleTime: 1, //关注的周期
    keywords: ['亚瑟士'], //搜索关键词

}


let openDatabase = () => {
    return new Promise((resolve, reject)=>{
        mongoose.connect('mongodb://localhost:27017/liudo_crawler', (err, db)=>{
            if (!err) {
                console.log('成功链接数据库')
                resolve(db)
            }else{
                reject()
            }
        });

    })
}

let handleDate = (findObj, DateItem, keywords)=>{
    return new Promise((resolve, reject)=>{
        Shuju.find({title:findObj.title}, function(err, docs) {
            if (!!docs.length) {
                //console.log('该条信息--:'+info.title+'--存在了');
                console.log('数据存在--结束--');
                resolve(docs)
            }else{
                DateItem.save(function(err, docs) {
                    if (!err) {
                        if (docs != '') {
                            console.log('新数据存入数据库（'+findObj.title+'）--完毕--（准备发短信提醒）');
                            //通知
                            console.log(keywords)
                            sendAliMessage(findObj, keywords)
                            resolve(docs)
                        }
                    }else{
                        reject('错误')
                    }
                })
            }
            
        });
    })
}

let crawler = () => {
    calcNum++
    console.log('----第'+calcNum+'次-------操作开始------------------------')
    return new Promise((resolve, reject)=>{
        phantomjs.run('--webdriver=4444').then(program => {
            let browser = webdriverio.remote(wdOpts);

            browser
            .init().then(()=>{console.log('开始链接URL')})
            .url(search.select_web)
            .getHTML('.tb-c-li').then(async (html)=>{

                let keywordsLen = search.keywords.length
                console.log('成功取回数据')
                // console.log('准备开始遍历')
                // console.log('-有'+keywordsLen+'个关键词:'+search.keywords)
                for(let i =0;i<html.length;i++) {
                    let $ = cheerio.load(html[i])
                    let info = {
                            web_name : search.web_name,
                            title : $('h2').find('em').text(),
                            time : new Date().getTime(),
                            url : $('.tb-li-tjly').find('a').attr('href'),
                            money : $('h2').find('i').text()
                        };
                    let DateItem = new Shuju();
                    DateItem.title = info.title;
                    DateItem.time = info.time;
                    DateItem.url = info.url;
                    DateItem.money = info.money;
                    DateItem.web_name = info.web_name;
                    for(let j = 0; j<keywordsLen ;j++) {
                        if(info.title.indexOf(search.keywords[j]) !== -1) { 
                            //找到了。 
                            await handleDate(info, DateItem, search.keywords[j])
                        }
                    }
                }
                console.log('----第'+calcNum+'次-------操作------------------------结束')
                console.log('开始等待'+search.waitTime+'s')
                setTimeout(()=>{crawler()}, search.waitTime*1000)
            })
        })
    })
}

openDatabase().then(db => {
    crawler()
    db.close();
}).catch(() => {})
