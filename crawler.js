"use strict"
var phantomjs = require('phantomjs-prebuilt')
var webdriverio = require('webdriverio')
var wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }
var MPromise = require('mpromise');
var cheerio = require('cheerio')
var sendAliMessage = require('./SMS_serve').default;
//链接数据库
var mongoose = require('mongoose');
var Shuju = require('./mongodb/mongodbConfig').shuju; //存储数据
var userShuju = require('./mongodb/mongodbConfig').userShuju; //初始化用户参数
mongoose.Promise = global.Promise;

var events = require('events');
var emitter = new events.EventEmitter();

const spawn = require('child_process').spawn;



let calcNum = 0; //计数
let dbcon = null; //mongodb

const defineSelect_web = {
    msd: { url: 'http://www.maishoudang.com/', name: '买手党' },
    msd2: { url: 'http://www.maishoudang.com/', name: '买手党222222' }
}

const opts = {
    server: {
        socketOptions: {
            socketTimeoutMS: 0,
            connectTimeoutMS: 0
        }
    }
}

const waitTime = 100 //等待时间轮询
const limit = 1000

const getTime = () => {
    let date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();
    let time = year + '/' + month + '/' + day + '/' + hour + ':' + minute + ':' + second
    return time
}

const devMsg = (msg) => {
    console.log(getTime() + '  ---->   ' + msg)
}

function reConnect() {
    dbcon.on('close', function() {
        start()
    })
}



//打开数据库
let openDatabase = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect('mongodb://localhost:27017/liudo_crawler', opts);
        dbcon = mongoose.connection; //获取Connection 连接对象
        dbcon.on('error', function(error) {
            devMsg('数据库连接错误');
            dbcon.readyState = "disconnected";
            reConnect();
        });
        //监听关闭事件并重连
        dbcon.on('disconnected', function() {
            devMsg('断开连接');
            dbcon.readyState = "disconnected";
            dbcon.close();
        });
        dbcon.on('close', function(err) {
            dbcon.readyState = "disconnected";
            reConnect();
            devMsg('close-event-to-connect');
        });
        dbcon.on('connecting', function() {
            devMsg('connecting1111');
        });
        dbcon.on('connected', function() {
            devMsg('成功链接数据库');
        });
        dbcon.on('disconnecting', function() {
            devMsg('disconnecting');
        });
        resolve(dbcon)
    })
}

//调用系统命令清理内存
let cleanMemory = () => {
    const clean = spawn('echo', ['1', '>', '/proc/sys/vm/drop_caches']);
    // 捕获标准输出并将其打印到控制台 
    clean.stdout.on('data', function(data) {
        console.log('standard output:\n' + data);
    });
    // 捕获标准错误输出并将其打印到控制台 
    clean.stderr.on('data', function(data) {
        console.log('standard error output:\n' + data);
    });
    // 注册子进程关闭事件 
    clean.on('exit', function(code, signal) {
        console.log('child process eixt ,exit:' + code);
    });
}

//调用系统命令检查内存
let free = () => {
    const free = spawn('free', ['-m']);
    // 捕获标准输出并将其打印到控制台 
    free.stdout.on('data', function(data) {
        console.log(typeof data);
        console.log('standard output:\n' + data[2][2]);
    });
    // 捕获标准错误输出并将其打印到控制台 
    free.stderr.on('data', function(data) {
        console.log('standard error output:\n' + data);
    });
    // 注册子进程关闭事件 
    free.on('exit', function(code, signal) {
        console.log('child process eixt ,exit:' + code);
    });
}

//递归
emitter.on('init', function() {
    process.nextTick(function() {
        free();
        init();
    })
})

//初始化
const init = () => {
    return new Promise((resolve, reject) => {
        userShuju.find({}, function(err, docs) {
            console.log(docs)
            if (docs.length > 0) {
                let len = docs.length;
                let start = async() => {
                    calcNum++;
                    devMsg('----第' + calcNum + '次-------操作开始-----------------------------------');
                    for (let i = 0; i < len; i++) {
                        await userDate(docs[i]).catch((err) => {
                            console.log('userDate------出错了 收集错误' + err)
                        })
                    }
                    devMsg('-----------------------------------操作结束');
                    setTimeout(() => { emitter.emit('init'); }, waitTime)
                    resolve('init')

                }
                start()

            } else {
                devMsg('初始化数据出错了' + err)
                reject('错误')
            }
        })
    })
}

//遍历多个用户
const userDate = (obj) => {
    return new Promise(async(resolve, reject) => {
        let select_web_len = obj.select_web.length
        for (let i = 0; i < select_web_len; i++) {
            const search = {
                select_web_url: defineSelect_web[obj.select_web[i]].url, //关注的网站
                select_web_name: defineSelect_web[obj.select_web[i]].name, //网站名字
                frequency: obj.frequency, //监控的频率
                waitTime: obj.waitTime, //等待超时的时间
                notice: obj.notice, //是否通知手机
                cycleTime: obj.cycleTime, //关注的周期
                keywords: obj.keywords, //搜索关键词
                iphoneNumber: obj.iphoneNumber, //手机号码
                userName: obj.userName, //用户名字
            }
            devMsg('用户：' + search.userName + '开始从“' + search.select_web_name + '”抓取数据')
            await crawler(search).then((e) => {
                devMsg('当前用户：' + search.userName + '数据抓取完毕，执行下一个用户')
                resolve('userDate')
            }).catch((err) => {
                console.log('crawler------出错了 收集错误' + err)
            })
        }
    })
}

//检查数据是否存在并发送短信
const handleDate = (findObj, DateItem, keywords, iphoneNumber) => {
    return new Promise((resolve, reject) => {
        Shuju.find({ title: findObj.title }, function(err, docs) {
            if (!!docs.length) {
                devMsg('数据存在--结束--');
                resolve(docs)
            } else {
                DateItem.save(function(err, docs) {
                    devMsg(docs)
                    if (!err && docs != '') {
                        devMsg('新数据存入数据库（' + findObj.title + '）--完毕--（准备发短信提醒）');
                        //通知
                        devMsg(keywords)
                        sendAliMessage(findObj, keywords, iphoneNumber)
                        resolve(docs)
                    } else {
                        reject('错误')
                    }
                })
            }

        });
    })
}

//爬取操作
const crawler = (search) => {
    return new Promise((resolve, reject) => {
        phantomjs.run('--webdriver=4444').then(program => {
            let browser = webdriverio.remote(wdOpts);
            browser
                .init().then(() => { devMsg('开始链接URL') })
                .url(search.select_web_url)
                .getHTML('.tb-c-li').then(async(html) => {

                    let keywordsLen = search.keywords.length
                    devMsg('成功取回数据')
                        // for(let i =0;i<html.length;i++) {
                        //     let $ = cheerio.load(html[i])
                        //     let info = {
                        //             select_web_name : search.select_web_name,
                        //             title : $('h2').find('em').text(),
                        //             time : new Date().getTime(),
                        //             url : $('.tb-li-tjly').find('a').attr('href'),
                        //             money : $('h2').find('i').text()
                        //         };
                        //     let DateItem = new Shuju();
                        //     DateItem.title = info.title;
                        //     DateItem.time = info.time;
                        //     DateItem.url = info.url;
                        //     DateItem.money = info.money;
                        //     DateItem.select_web_name = info.select_web_name;
                        //     for(let j = 0; j<keywordsLen ;j++) {
                        //         if(info.title.indexOf(search.keywords[j]) !== -1) { 
                        //             //找到了。 
                        //             devMsg('找到关键词:'+ search.keywords[j])
                        //             await handleDate(info, DateItem, search.keywords[j], search.iphoneNumber).catch((err) => {
                        //                 console.log('handleDate------出错了 收集错误'+err)
                        //             })
                        //         }
                        //     }
                        // }
                    program.kill();
                    resolve('crawler')
                })
        })
    })
}

//执行
function start() {
    openDatabase().then(db => {
        init().catch((err) => {
            console.log('init--------出错了 收集错误' + err)
        })
    }).catch((err) => {
        console.log('openDatabase------出错了 收集错误' + err)
    })
}
start()