module.exports = {
    apps: [{
        name: "server", // 应用名称
        script: "./src/server/server.js", // 启动脚本路径
        env_production: {
            NODE_ENV: 'production', // 设置环境变量
        },
        // 日志设置
        error_file: './logs/app-err.log', // 错误日志文件路径
        out_file: './logs/app-out.log', // 标准输出日志文件路径
        merge_logs: true, // 如果为true，会将所有实例的日志合并到一个文件中
        log_date_format: 'YYYY-MM-DD HH:mm Z', // 日志时间格式
        // 其他可选配置...
    }]
};
