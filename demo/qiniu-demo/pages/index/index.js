const qiniuUploader = require("../../utils/qiniuUploader");
//index.js

// 初始化七牛相关参数
function initQiniu() {
    var options = {
        qiniuRetryDomainNum: 1, //上传重试策略，=0:不重试,=1:重试一个域名三次,=2:重试两个域名各三次
        region: 'ECN', // 华东区
        //uptokenURL: 'http://node.ijemy.com/get/uptoken',
        uptoken: 'bjtWBQXrcxgo7HWwlC_bgHg81j352_GhgBGZPeOW:_ePL3nGB7BE526rUaszpLgqS6TM=:eyJzY29wZSI6Ind4YXBwdGVzdCIsImRlYWRsaW5lIjoxNTgyOTY1MzEzfQ==', //2020-02-29 16:35:13
        domain: 'http://wxapp.qiniu.ijemy.com',
        shouldUseQiniuFileName: false
    };
    qiniuUploader.init(options);
}

//获取应用实例
var app = getApp()
Page({
    data: {
        imageObject: {}
    },
    //事件处理函数
    onLoad: function() {
        console.log('onLoad')
        var that = this;
    },
    didPressChooesImage: function() {
        var that = this;
        didPressChooesImage(that);
    },
    didPressChooesVideo: function() {
        var that = this;
        didPressChooesVideo(that);
    },
    didCancelTask: function() {
        this.data.cancelTask()
    }
});

function didPressChooesVideo(that) {
    initQiniu();
    that.setData({
        'mediaType': 1
    });
    // 微信 API 选文件
    wx.chooseVideo({
        success: function(res) {
            var filePath = res.tempFilePath;
            // 交给七牛上传
            qiniuUploader.upload(filePath, (res) => {
                    that.setData({
                        'mediaObject': res
                    });
                    console.log('file url is: ' + res.fileUrl)
                }, (error) => {
                    console.error('error: ' + JSON.stringify(error));
                },
                null, // 可以使用上述参数，或者使用 null 作为参数占位符
                (progress) => {
                    that.setData({
                        'progress': progress.progress,
                    });
                    console.log('上传进度', progress.progress)
                    console.log('已经上传的数据长度', progress.totalBytesSent)
                    console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
                }, cancelTask => that.setData({
                    cancelTask
                })
            );
        }
    })
}

function didPressChooesImage(that) {
    initQiniu();
    that.setData({
        'mediaType': 0
    });
    // 微信 API 选文件
    wx.chooseImage({
        count: 1,
        success: function(res) {
            var filePath = res.tempFilePaths[0];
            // 交给七牛上传
            qiniuUploader.upload(filePath, (res) => {
                    that.setData({
                        'mediaObject': res
                    });
                    console.log(JSON.stringify(res));
                    console.log('file url is: ' + res.fileUrl)
                }, (error) => {
                    console.error('error: ' + JSON.stringify(error));
                },
                null, // 可以使用上述参数，或者使用 null 作为参数占位符
                (progress) => {
                    that.setData({
                        'progress': progress.progress,
                    });
                    console.log('上传进度', progress.progress)
                    console.log('已经上传的数据长度', progress.totalBytesSent)
                    console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
                }, cancelTask => that.setData({
                    cancelTask
                })
            );
        }
    })
}
