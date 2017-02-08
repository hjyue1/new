"use strict"
var phantomjs = require('phantomjs-prebuilt')
var webdriverio = require('webdriverio')
var wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }
var MPromise = require('mpromise');
var cheerio = require('cheerio')
var sendAliMessage = require ('./SMS_serve').default;
//链接数据库
var mongoose = require('mongoose');
var Shuju = require('./mongodb/mongodbConfig').shuju; //存储数据
var userShuju = require('./mongodb/mongodbConfig').userShuju; //初始化用户参数
mongoose.Promise = global.Promise

var  events = require('events');
var emitter = new events.EventEmitter();

let calcNum = 0; //计数
let dbcon = null;//mongodb

const defineSelect_web = {
    msd: {url:'http://www.maishoudang.com/', name: '买手党'},
    msd2: {url:'http://www.maishoudang.com/', name: '买手党222222'}
}

const opts =  {
                server: {
                    socketOptions: {
                      socketTimeoutMS: 0,
                      connectTimeoutMS: 0
                    }
                }
            }

const waitTime = 10000 //等待时间轮询

// let openDatabase = () => {
//     return new Promise((resolve, reject)=>{
//         mongoose.connect('mongodb://localhost:27017/liudo_crawler', (err, db)=>{
//             if (!err) {
//                 console.log('成功链接数据库')
//                 resolve(db)
//             }else{
//                 console.log('链接数据库失败')
//                 reject()
//             }
//         });

//     })
// }

function reConnect(){
        dbcon.on('close', function(){
            openDatabase()
        })
    }

let openDatabase = () => {
    return new Promise((resolve, reject)=>{
        mongoose.connect('mongodb://localhost:27017/liudo_crawler', opts);
        dbcon = mongoose.connection;//获取Connection 连接对象
        dbcon.on('error', function(error) {
            console.log('数据库连接错误');
            dbcon.readyState = "disconnected";
            reConnect();
        });
        //监听关闭事件并重连
        dbcon.on('disconnected', function() {
            console.log('断开连接');
            dbcon.readyState = "disconnected";
            dbcon.close();
        });
        dbcon.on('close', function(err) {
            dbcon.readyState = "disconnected";
            reConnect();
            console.log('close-event-to-connect');
        });
        dbcon.on('connecting', function() {
            console.log('connecting');
        });
        dbcon.on('connected', function() {
            console.log('connected');
        });
        dbcon.on('disconnecting', function() {
            console.log('disconnecting');
        });
        resolve(dbcon)
    })
}

emitter.on('init', function(){
    init();
})

const init = () => {
    return new Promise((resolve, reject)=>{
        userShuju.find({}, function(err, docs) {
            if (docs.length > 0) {
                let len = docs.length;
                let start = async ()=> {
                    calcNum++;
                    console.log('----第'+calcNum+'次-------操作开始-----------------------------------');
                    for (let i = 0; i<len; i++) {
                        await userDate(docs[i])
                    }  
                    console.log('-----------------------------------操作结束');
                    setTimeout(()=>{emitter.emit('init');}, waitTime)
                    resolve('init')
                }
                start()

            }else{
                console.log('初始化数据出错了'+err)
                reject('错误')
            }
        })
    })
}

const userDate = (obj) => {
    return new Promise( async (resolve, reject)=>{
        let select_web_len= obj.select_web.length
        for (let i = 0; i<select_web_len; i++) {
            const search = {
                select_web_url: defineSelect_web[obj.select_web[i]].url, //关注的网站
                select_web_name : defineSelect_web[obj.select_web[i]].name, //网站名字
                frequency: obj.frequency, //监控的频率
                waitTime: obj.waitTime, //等待超时的时间
                notice: obj.notice, //是否通知手机
                cycleTime: obj.cycleTime, //关注的周期
                keywords: obj.keywords, //搜索关键词
                iphoneNumber: obj.iphoneNumber, //手机号码
                userName: obj.userName, //用户名字
            }
            console.log('用户：'+search.userName+'开始从“'+search.select_web_name+'”抓取数据')
            await crawler(search).then((e)=>{
                console.log('当前用户：'+search.userName+'数据抓取完毕，执行下一个用户')
                resolve('userDate')
            })
        }
    })
}


const handleDate = (findObj, DateItem, keywords, iphoneNumber)=>{
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
                            sendAliMessage(findObj, keywords, iphoneNumber)
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

const crawler = (search) => {
    // calcNum++
    // console.log('----第'+calcNum+'次-------操作开始------------------------关键词为:'+ search.keywords.join(','))
    return new Promise((resolve, reject)=>{
        console.log('111')
        // phantomjs.run('--webdriver=4444').then(program => {
        //     let browser = webdriverio.remote(wdOpts);
        //     browser
        //     .init().then(()=>{console.log('开始链接URL')})
        //     .url(search.select_web_url)
        //     .getHTML('.tb-c-li').then(async (html)=>{

        //         let keywordsLen = search.keywords.length
        //         console.log('成功取回数据')
        //         // console.log('准备开始遍历')
        //         // console.log('-有'+keywordsLen+'个关键词:'+search.keywords)
        //         for(let i =0;i<html.length;i++) {
        //             let $ = cheerio.load(html[i])
        //             let info = {
        //                     select_web_name : search.select_web_name,
        //                     title : $('h2').find('em').text(),
        //                     time : new Date().getTime(),
        //                     url : $('.tb-li-tjly').find('a').attr('href'),
        //                     money : $('h2').find('i').text()
        //                 };
        //             let DateItem = new Shuju();
        //             DateItem.title = info.title;
        //             DateItem.time = info.time;
        //             DateItem.url = info.url;
        //             DateItem.money = info.money;
        //             DateItem.select_web_name = info.select_web_name;
        //             for(let j = 0; j<keywordsLen ;j++) {
        //                 if(info.title.indexOf(search.keywords[j]) !== -1) { 
        //                     //找到了。 
        //                     console.log('找到关键词:'+ search.keywords[j])
        //                     await handleDate(info, DateItem, search.keywords[j], search.iphoneNumber)
        //                 }
        //             }
        //         }
        //         resolve('crawler')
        //         // console.log('----第'+calcNum+'次-------操作------------------------结束')
        //         // console.log('开始等待'+search.waitTime+'s')
        //         // setTimeout(()=>{crawler()}, search.waitTime*1000)
        //     })
        // })
    })
}

openDatabase().then(db => {
    init()
}).catch(() => {})
