 /**
 * 浏览器的 UA 信息
 *
 * @author			Leo
 * @version			0.0.1
 * @copyright		Copyright (c) 2008 - 2013, Kingsoft, Inc.
 * @license			http://www.kingsoft.com/
 * @link			http://qing.wps.com
 */
var ua = {},
	agent = window.navigator.userAgent,
	nv = window.navigator.appVersion,
	html = document.documentElement,
	r, m, optmz;

if (window.ActiveXObject || window.msIsStaticHTML) {
	ua.ie = 6;
	(window.XMLHttpRequest || agent.indexOf("MSIE 7.0") > -1) && (ua.ie = 7);
	(window.XDomainRequest || agent.indexOf("Trident/4.0") > -1) && (ua.ie =
	8);
	agent.indexOf("Trident/5.0") > -1 && (ua.ie = 9);
	agent.indexOf("Trident/6.0") > -1 && (ua.ie = 10);
	agent.indexOf("Trident/7.0") > -1 && (ua.ie = 11);
	ua.isBeta = window.navigator.appMinorVersion && window.navigator.appMinorVersion.toLowerCase().indexOf("beta") > -1;
	if (ua.ie < 7){
		try {
			document.execCommand("BackgroundImageCache", false, true)
		} catch (E) {}
	}
	optmz = function(st) {
		return function(fns, tm) {
			var aargs;
			if (typeof fns == "string")
				return st(fns, tm);
			else {
				aargs = Array.prototype.slice.call(arguments, 2);
				return st(function() {
					fns.apply(null,
					aargs)
				}, tm)
			}
		}
	};
	window.setTimeout = optmz(window.setTimeout);
	window.setInterval = optmz(window.setInterval)
} else if (document.getBoxObjectFor || typeof window.mozInnerScreenX != "undefined") {
	r = /(?:Firefox|GranParadiso|Iceweasel|Minefield).(\d+\.\d+)/i;
	ua.firefox = parseFloat((r.exec(agent) || r.exec("Firefox/3.3"))[1], 10)
} else if (!window.navigator.taintEnabled) {
	m = /AppleWebKit.(\d+\.\d+)/i.exec(agent);
	ua.webkit = m ? parseFloat(m[1], 10) : document.evaluate ? document.querySelector ? 525 : 420 : 419;
	if ((m = /Chrome.(\d+\.\d+)/i.exec(agent)) || window.chrome)
		ua.chrome = m ? parseFloat(m[1], 10) : "2.0";
	else if ((m = /Version.(\d+\.\d+)/i.exec(agent)) || window.safariHandler)
		ua.safari = m ? parseFloat(m[1], 10) : "3.3";
	ua.air = agent.indexOf("AdobeAIR") > -1 ? 1 : 0;
	ua.isiPod = agent.indexOf("iPod") > -1;
	ua.isiPad = agent.indexOf("iPad") > -1;
	ua.isiPhone = agent.indexOf("iPhone") > -1
} else if (window.opera)
	ua.opera = parseFloat(window.opera.version(), 10);
else
	ua.ie = 6;
if (!(ua.macs = agent.indexOf("Mac OS X") > -1)) {
	ua.windows = (m = /Windows.+?(\d+\.\d+)/i.exec(agent),
	m && parseFloat(m[1], 10));
	ua.linux = agent.indexOf("Linux") > -1;
	ua.android = agent.indexOf("Android") > -1
}

ua.iOS = agent.indexOf("iPhone OS") > -1;
ua.weixin = agent.indexOf("MicroMessenger") > -1;
!ua.iOS && (m = /OS (\d+(?:_\d+)*) like Mac OS X/i.exec(agent), ua.iOS = m && m[1] ? true : false);

ua.isMobile = ua.weixin || ua.isiPod || ua.isiPad || ua.isiPhone || ua.android;
ua.isIphoneMobile = ua.air || ua.isiPod || ua.isiPad || ua.isiPhone;
ua.isDesktop = !ua.isMobile && (ua.macs || ua.windows || ua.linux);

export default ua;
/* End file ua.js */
/* Location: qing_wps_cn/www/static/javascripts/src/modules/preivew_v1/core/ua.js */
