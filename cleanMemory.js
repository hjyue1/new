const spawn = require('child_process').spawn;

//调用系统命令清理内存
(function cleanMemory() {
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
})()