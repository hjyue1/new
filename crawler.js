"use strict"
var phantomjs = require('phantomjs-prebuilt')
var webdriverio = require('webdriverio')
var wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }
var MPromise = require('mpromise');
var cheerio = require('cheerio')

//链接数据库
var mongoose = require('mongoose');
var Shuju = require('./mongodbConfig').shuju;
mongoose.Promise = global.Promise


const defineSelect_web = {
    msd: 'http://www.maishoudang.com/'
}


const search = {
    select_web: defineSelect_web.msd, //关注的网站
    frequency: 1, //监控的频率
    waitTime: 30, //等待超时的时间
    notice: true, //是否通知手机
    cycleTime: 1, //关注的周期
    keywords: ['绿豆糕','保温杯'], //搜索关键词

}


function openDatabase() {
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
let calcNum = 0;

let crawler = () => {
    calcNum++
    console.log('----第'+calcNum+'次-------操作开始')
    return new Promise((resole, reject)=>{
        phantomjs.run('--webdriver=4444').then(program => {
            let browser = webdriverio.remote(wdOpts);
            browser
            .init().then(()=>{console.log('尝试链接URL')})
            .url(search.select_web)
            .getHTML('.tb-c-li').then((html)=>{
                console.log('捕获到数据')
                console.log('准备开始遍历')
                html.map((item)=>{
                    let $ = cheerio.load(item)
                    let info = {
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
                           
                    search.keywords.map(async(key_item)=>{
                        if(info.title.indexOf(key_item) !== -1) { 
                        //找到了。 
                        Shuju.find({title:info.title}, function(err, docs) {
                            if (!!docs.length) {
                                //console.log('该条信息--:'+info.title+'--存在了');
                                console.log('数据存在---结束--');
                                resole(docs)
                                return 
                            }
                            DateItem.save(function(err, docs) {
                                if (!err) {
                                    if (docs != '') {
                                        console.log('新数据存入数据库--完毕');
                                        //通知
                                        resole(docs)
                                    }
                                    return
                                }else{
                                    reject()
                                }
                                return 
                            })
                        });

                        
                        }
                    })
                })
                crawler()
            })
        })
    })
}

openDatabase().then(db => {
    crawler()

    db.close();
}).catch(() => {})
