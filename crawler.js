"use strict"
//phantomjs 一个浏览器
var phantomjs = require('phantomjs-prebuilt')

//主要爬取功能
var webdriverio = require('webdriverio')

// webdriverio 的配置文件，指定在phantomjs浏览器环境下
var wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }

//var MPromise = require('mpromise');

//解析抓取回来的html
var cheerio = require('cheerio')

//发送短信组件
var sendAliMessage = require('./SMS_serve').default;

//链接数据库
var mongoose = require('mongoose');
var Shuju = require('./mongodb/mongodbConfig').shuju; //存储数据
var userShuju = require('./mongodb/mongodbConfig').userShuju; //初始化用户参数
mongoose.Promise = global.Promise;

//nodejs原生事件
var events = require('events');
var emitter = new events.EventEmitter();

//用于输入命令行
const spawn = require('child_process').spawn;



let calcNum = 0; //计数
let dbcon = null; //mongodb

const defineSelect_web = {
    msd: { url: 'http://www.maishoudang.com/', name: '买手党' },
    msd2: { url: 'http://www.maishoudang.com/', name: '买手党222222' }
}

let waitTime = 5000 //等待时间轮询

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
        start()//重启打开数据库
    })
}

//打开数据库
let openDatabase = () => {
    return new Promise((resolve, reject) => {
        const opts = {
            server: {
                socketOptions: {
                    socketTimeoutMS: 0,
                    connectTimeoutMS: 0
                }
            }
        }
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
const cleanMemory = () => {
    const clean = spawn('echo', ['1', '>', '/proc/sys/vm/drop_caches'], {
        shell: true
    });
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
const free = () => {
    const free = spawn('free', ['-m']);
    // 捕获标准输出并将其打印到控制台 
    free.stdout.on('data', function(data) {
        console.log('standard output:\n' + data);
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

//重复爬取
emitter.on('init', function() {
    process.nextTick(function() {
        if (calcNum % 5000 == 0) {
            //每5000次清理下内存
            cleanMemory();
        }
        init();
    })
})

//初始化
const init = () => {
    return new Promise((resolve, reject) => {
        userShuju.find({}, function(err, docs) {
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
                    resolve('init完成')
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
        //如果数据库没有select_web 就设置下默认
        let select_web = obj.select_web.length == 0 ? ['msd'] : obj.select_web
        let select_web_len = select_web.length || ['msd']
        for (let i = 0; i < select_web_len; i++) {
            const search = {
                select_web_url: defineSelect_web[select_web[i]].url, //关注的网站
                select_web_name: defineSelect_web[select_web[i]].name, //网站名字
                waitTime: obj.waitTime, //等待超时的时间
                notice: obj.notice, //是否通知手机
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



//爬取操作
const crawler = (search) => {
    return new Promise((resolve, reject) => {
        phantomjs.run('--webdriver=4444').then(program => {
            let browser = webdriverio.remote(wdOpts);
            browser.timeouts('pageLoad', 10000);
            browser.init().then(() => { devMsg('开始链接URL') })
                .url(search.select_web_url).then(() => { devMsg('成功取回数据') })
                .getHTML('body').then(async(body) => {
                    let _$$ = cheerio.load(body);
                    let html = _$$('.tb-c-li');
                    let keywordsLen = search.keywords.length
                    for (let i = 0; i < html.length; i++) {
                        let $ = cheerio.load(html[i])
                        let info = {
                            select_web_name: search.select_web_name,
                            title: $('h2').find('em').text(),
                            time: new Date().getTime(),
                            url: $('.tb-li-tjly').find('a').attr('href'),
                            money: $('h2').find('i').text()
                        };
                        let DateItem = new Shuju();
                        DateItem.title = info.title;
                        DateItem.time = info.time;
                        DateItem.url = info.url;
                        DateItem.money = info.money;
                        DateItem.select_web_name = info.select_web_name;
                        for (let j = 0; j < keywordsLen; j++) {
                            if (info.title.indexOf(search.keywords[j]) !== -1) {
                                //找到了。 
                                devMsg('找到关键词:' + search.keywords[j])
                                await handleDate(info, DateItem, search.keywords[j], search.iphoneNumber, search.notice).catch((err) => {
                                    console.log('handleDate------出错了 收集错误' + err)
                                })
                            }
                        }
                    }
                    program.kill();
                    resolve('crawler')
                })
        })
    })
}


//检查数据是否存在并发送短信
const handleDate = (findObj, DateItem, keywords, iphoneNumber, notice) => {
    return new Promise((resolve, reject) => {
        Shuju.find({ title: findObj.title }, function(err, docs) {
            if (!!docs.length) {
                devMsg('数据存在--结束--');
                resolve(docs)
            } else {
                DateItem.save(function(err, docs) {
                    devMsg(docs)
                    if (!err && docs != '') {
                        if(!notice) {
                            devMsg('新数据存入数据库（' + findObj.title + '）--完毕--（用户不需要发送短信通知）');
                            resolve(docs) 
                        }else {
                            devMsg('新数据存入数据库（' + findObj.title + '）--完毕--（准备发短信提醒）');
                            //通知
                            devMsg(keywords)
                            sendAliMessage(findObj, keywords, iphoneNumber)
                            resolve(docs)
                        }
                    } else {
                        reject('错误')
                    }
                })
            }

        });
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