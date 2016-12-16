var Jsqr = {};
 !
function($) {
    var size = 256;
    var option = {
        size: size,
        ecLevel: 'M',
        quiet: 1

    }

    function clearCanvas(canvas) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    }

    function generate(text, canvas) {
        // utf8 支持
        console.log(text);
        console.log(canvas);
        option.text = String(text).replace(
        /[\u0080-\u07ff]/g,
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);

        }
        ).replace(
        /[\u0800-\uffff]/g,
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3f, 0x80 | cc & 0x3f);

        }
        );
        clearCanvas(canvas);
        $(canvas).qrcode(option);//asinw edit

    }
    var status = "init";
    function showInput() {
        if (status != "input") {
            $(".result").hide();
            $(".btns").show();
            $(".text").height(225);
            $(".input").width(256);
            $(".input").height($(".text").height() + $(".btns").height());

            status = "input";

        }

    }
    function showCode() {
        if (status != "code") {
            $(".btns").hide();
            $(".text").height(18);
            $(".input").height($(".text").height());
            $(".result").show();

            status = "code";

        }

    }

    function initPopup() {
        chrome.tabs.query({
            currentWindow: true,
            active: true

        },
        function(tab) {
            option.text = tab[0].url;
            $("canvas").qrcode(option);

        });
        $("#cancel").text(chrome.i18n.getMessage('cancel'));
        $("#ok").text(chrome.i18n.getMessage('ok'));
        $(".text").attr("placeholder", chrome.i18n.getMessage('popup_text_hint'));
        $(".text").click(showInput);
        /*
	   有可能在某种情况下，页面弹出时，text 会立刻获得焦点
	   比如 Mac ，但给 canvas 加了 tabindex 后就可以避免
	*/
        setTimeout(function() {
            $(".text").focus(showInput)
        },
        50);
        $("#cancel").click(showCode);
        $("#ok").click(function() {
            generate($(".text").val(), $("canvas")[0]);
            showCode();

        })

    }

    function generateInject(text,isArray) {
        var size = 256;
        var div = $("<div>[关闭]</div>");

        div.click(function(e) {
            console.log('click');
            var eTarget = (e.target)?e.target:e.srcElement;//asinw edit
	        if (eTarget == this)
	        {
	            div.remove();
	        }

        })
        $("body").append(div);

        div.css({
            'position': 'fixed',
            'top': 0,
            'right': '10px',
            'width': size+'px',
            'max-height': '100%',
            'border': '10px solid black',
            'background': 'white',
            'overflow': 'auto',
            'z-index': '9876543210'
        });
        var texts = (text.match(/^http\S+$/g)?text.split(','):[text]);//asinw add
        for (var i in texts)//asinw add
        {
        	var text = texts[i];
	        var $canvas = $("<canvas width=\"" + size + "\" height=\"" + size + "\"></canvas>");
	        $(div).append($canvas);
	        $(div).append('<div style="width: '+size+'px;word-wrap: break-word;">'+text+'</div><br/><br/>');
	        generate(text, $canvas[0]);
        }
    }

    Jsqr.initPopup = initPopup;
    Jsqr.generateInject = generateInject;


} (jQuery);
