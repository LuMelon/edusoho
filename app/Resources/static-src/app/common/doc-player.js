import swfobject from 'es-swfobject';
import 'app/common/watermark';

class DocPlayer {
  constructor({ element, swfUrl, pdfUrl, watermarkOptions, canCopy }) {
    this.element = $(element);
    this.swfUrl = swfUrl || '';
    this.pdfUrl = pdfUrl || '';
    this.swfPlayerWidth = '100%';
    this.swfPlayerHeight = '100%';
    this.swfPlayerUrl = '';
    this.watermarkOptions = watermarkOptions || '';
    this.canCopy = canCopy || false;
    this.init();

    console.log(watermarkOptions);
  }

  init() {
    if (this.isSupportHtml5() && !this.isIE9()) {
      this.initPDFJSViewer();
    } else {
      this.initSwfViewer();
    }
  }

  isIE9() {
    return navigator.appVersion.indexOf("MSIE 9.") != -1;
  }

  isSupportHtml5() {
    return $.support.leadingWhitespace;
  }

  initPDFJSViewer() {
    $("html").attr('dir', 'ltr');

    let src = 'http://opencdn.edusoho.net/pdf.js/v3/viewer.html#' + this.pdfUrl;

    if (!this.canCopy) {
      src += '#false';
    }

    let iframe = document.createElement('iframe');
    iframe.style.height = '100%';
    iframe.allowfullscreen = true;
    iframe.style.width = '100%';
    iframe.id = 'doc-pdf-player';
    iframe.src = src;
    this.element.get(0).appendChild(iframe);
    this.addWatermark();
  }

  initSwfViewer() {
    $.html(`<div id="website"><p align="center" class="style1">${Translator.trans('您还没有安装flash播放器 请点击')}<a href="http://www.adobe.com/go/getflashplayer">${Translator.trans('这里')}</a>${Translator.trans('安装')}</p></div>`);

    let flashVars = {
      doc_url: decodeURI(this.swfUrl.value)
    };

    let params = {
      bgcolor: '#efefef',
      allowFullScreen: true,
      wmode: 'window',
      allowNetworking: 'all',
      allowscriptaccess: 'always',
      autoPlay: false
    };

    let attributes = {
      id: 'website'
    };

    swfobject.embedSWF(
      this.swfPlayerUrl,
      'website',
      this.swfPlayerWidth,
      this.swfPlayerHeight,
      "9.0.45",
      null,
      flashVars,
      params,
      attributes
    );

    this.addWatermark();
  }

  addWatermark() {
    this.watermarkOptions && this.element.WaterMark(this.watermarkOptions);
  }
}

var DocumentPlayer = Widget.extend({
        attrs: {
            swfFileUrl:'',
            pdfFileUrl:'',
            swfPlayerUrl:'../../bundles/topxiaweb/js/controller/swf/edusohoViewer.swf',
            swfPlayerWidth:'100%',
            swfPlayerheight:'100%',
            watermark: ''
        },

        events: {
        },

        setup: function() {
            var self = this;
            docPlayer = $(this.element).attr("id");
            self.init(this.element);
        },

        init: function ($thiz) {

            if (this.isSupportHtml5() && !this.isIE9()) {
                this.initPDFJSViewer($thiz);
            }else{
                this.initSwfViewer($thiz);
            }

        },
        isIE9: function(){
            return navigator.appVersion.indexOf("MSIE 9.")!=-1;
        },
        isSupportHtml5: function(){

            return $.support.leadingWhitespace;

        },

        initPDFJSViewer: function($thiz) {
            self=this;
            $("html").attr('dir','ltr');
            var jsPath = __URL_PROTOCOL + '://service-cdn.qiqiuyun.net/js-sdk/document-player/v7/viewer.html#'+self.attrs.pdfFileUrl.value;
            if(app.lessonCopyEnabled==0){
                jsPath = jsPath+'#false';
            }

            $('#viewerIframe').attr('src', jsPath);

            if (this.get('watermark')) {
                this.element.WaterMark(this.get('watermark'));
            }
        },

        initSwfViewer: function($thiz){

            $thiz.html('<div id="website"><p align="center" class="style1">'+Translator.trans('您还没有安装flash播放器 请点击')+'<a href="http://www.adobe.com/go/getflashplayer">'+Translator.trans('这里')+'</a>'+Translator.trans('安装')+'</p></div>');
            var flashvars = {
              doc_url: escape(this.attrs.swfFileUrl.value) 
            };
            var params = {
                //menu: "false",
                bgcolor: '#efefef',
                allowFullScreen: 'true',
                wmode:'window',
                allowNetworking:'all',
                allowscriptaccess:'always',
                wmode: 'transparent',
                autoPlay:false
              };
            var attributes = {
                id: 'website'
            };

            swfobject.embedSWF(
                this.get('swfPlayerUrl'),
                'website',
                this.get('swfPlayerWidth'),  this.get('swfPlayerheight') , "9.0.45", null, flashvars, params, attributes
            );

            if (this.get('watermark')) {
                this.element.WaterMark(this.get('watermark'));
            }

        }

    });

export default DocPlayer;