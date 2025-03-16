/* eslint-disable */
// refer to DamonOehlman/detect-browser
"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
      to[j] = from[i];
    return to;
  };

void 0;
var BrowserInfo = /** @class */ (function () {
  function BrowserInfo(name, version, os) {
    this.name = name;
    this.version = version;
    this.os = os;
    this.type = "browser";
  }
  return BrowserInfo;
})();
var NodeInfo = /** @class */ (function () {
  function NodeInfo(version) {
    this.version = version;
    this.type = "node";
    this.name = "node";
    this.os = process.platform;
  }
  return NodeInfo;
})();
var SearchBotDeviceInfo = /** @class */ (function () {
  function SearchBotDeviceInfo(name, version, os, bot) {
    this.name = name;
    this.version = version;
    this.os = os;
    this.bot = bot;
    this.type = "bot-device";
  }
  return SearchBotDeviceInfo;
})();
var BotInfo = /** @class */ (function () {
  function BotInfo() {
    this.type = "bot";
    this.bot = true; // NOTE: deprecated test name instead
    this.name = "bot";
    this.version = null;
    this.os = null;
  }
  return BotInfo;
})();
var ReactNativeInfo = /** @class */ (function () {
  function ReactNativeInfo() {
    this.type = "react-native";
    this.name = "react-native";
    this.version = null;
    this.os = null;
  }
  return ReactNativeInfo;
})();
// tslint:disable-next-line:max-line-length
var SEARCHBOX_UA_REGEX =
  /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
var SEARCHBOT_OS_REGEX =
  /(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
var REQUIRED_VERSION_PARTS = 3;
var userAgentRules = [
  ["aol", /AOLShield\/([0-9\._]+)/],
  ["edge", /Edge\/([0-9\._]+)/],
  ["edge-ios", /EdgiOS\/([0-9\._]+)/],
  ["yandexbrowser", /YaBrowser\/([0-9\._]+)/],
  ["kakaotalk", /KAKAOTALK\s([0-9\.]+)/],
  ["samsung", /SamsungBrowser\/([0-9\.]+)/],
  ["silk", /\bSilk\/([0-9._-]+)\b/],
  ["miui", /MiuiBrowser\/([0-9\.]+)$/],
  ["beaker", /BeakerBrowser\/([0-9\.]+)/],
  ["edge-chromium", /EdgA?\/([0-9\.]+)/],
  [
    "chromium-webview",
    /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/,
  ],
  ["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
  ["phantomjs", /PhantomJS\/([0-9\.]+)(:?\s|$)/],
  ["crios", /CriOS\/([0-9\.]+)(:?\s|$)/],
  ["firefox", /Firefox\/([0-9\.]+)(?:\s|$)/],
  ["fxios", /FxiOS\/([0-9\.]+)/],
  ["opera-mini", /Opera Mini.*Version\/([0-9\.]+)/],
  ["opera", /Opera\/([0-9\.]+)(?:\s|$)/],
  ["opera", /OPR\/([0-9\.]+)(:?\s|$)/],
  ["ie", /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
  ["ie", /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
  ["ie", /MSIE\s(7\.0)/],
  ["bb10", /BB10;\sTouch.*Version\/([0-9\.]+)/],
  ["android", /Android\s([0-9\.]+)/],
  ["ios", /Version\/([0-9\._]+).*Mobile.*Safari.*/],
  ["safari", /Version\/([0-9\._]+).*Safari/],
  ["facebook", /FBAV\/([0-9\.]+)/],
  ["instagram", /Instagram\s([0-9\.]+)/],
  ["ios-webview", /AppleWebKit\/([0-9\.]+).*Mobile/],
  ["ios-webview", /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
  ["curl", /^curl\/([0-9\.]+)$/],
  ["searchbot", SEARCHBOX_UA_REGEX],
];
var operatingSystemRules = [
  ["iOS", /iP(hone|od|ad)/],
  ["Android OS", /Android/],
  ["BlackBerry OS", /BlackBerry|BB10/],
  ["Windows Mobile", /IEMobile/],
  ["Amazon OS", /Kindle/],
  ["Windows 3.11", /Win16/],
  ["Windows 95", /(Windows 95)|(Win95)|(Windows_95)/],
  ["Windows 98", /(Windows 98)|(Win98)/],
  ["Windows 2000", /(Windows NT 5.0)|(Windows 2000)/],
  ["Windows XP", /(Windows NT 5.1)|(Windows XP)/],
  ["Windows Server 2003", /(Windows NT 5.2)/],
  ["Windows Vista", /(Windows NT 6.0)/],
  ["Windows 7", /(Windows NT 6.1)/],
  ["Windows 8", /(Windows NT 6.2)/],
  ["Windows 8.1", /(Windows NT 6.3)/],
  ["Windows 10", /(Windows NT 10.0)/],
  ["Windows ME", /Windows ME/],
  ["Open BSD", /OpenBSD/],
  ["Sun OS", /SunOS/],
  ["Chrome OS", /CrOS/],
  ["Linux", /(Linux)|(X11)/],
  ["Mac OS", /(Mac_PowerPC)|(Macintosh)/],
  ["QNX", /QNX/],
  ["BeOS", /BeOS/],
  ["OS/2", /OS\/2/],
];
function detect(userAgent) {
  if (!!userAgent) {
    return parseUserAgent(userAgent);
  }
  if (
    typeof document === "undefined" &&
    typeof navigator !== "undefined" &&
    navigator.product === "ReactNative"
  ) {
    return new ReactNativeInfo();
  }
  if (typeof navigator !== "undefined") {
    return parseUserAgent(navigator.userAgent);
  }
  return getNodeVersion();
}
function matchUserAgent(ua) {
  // opted for using reduce here rather than Array#first with a regex.test call
  // this is primarily because using the reduce we only perform the regex
  // execution once rather than once for the test and for the exec again below
  // probably something that needs to be benchmarked though
  return (
    ua !== "" &&
    userAgentRules.reduce(function (matched, _a) {
      var browser = _a[0],
        regex = _a[1];
      if (matched) {
        return matched;
      }
      var uaMatch = regex.exec(ua);
      return !!uaMatch && [browser, uaMatch];
    }, false)
  );
}
function browserName(ua) {
  var data = matchUserAgent(ua);
  return data ? data[0] : null;
}
function parseUserAgent(ua) {
  var matchedRule = matchUserAgent(ua);
  if (!matchedRule) {
    return null;
  }
  var name = matchedRule[0],
    match = matchedRule[1];
  if (name === "searchbot") {
    return new BotInfo();
  }
  // Do not use RegExp for split operation as some browser do not support it (See: http://blog.stevenlevithan.com/archives/cross-browser-split)
  var versionParts =
    match[1] && match[1].split(".").join("_").split("_").slice(0, 3);
  if (versionParts) {
    if (versionParts.length < REQUIRED_VERSION_PARTS) {
      versionParts = __spreadArray(
        __spreadArray([], versionParts),
        createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length)
      );
    }
  } else {
    versionParts = [];
  }
  var version = versionParts.join(".");
  var os = detectOS(ua);
  var searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua);
  if (searchBotMatch && searchBotMatch[1]) {
    return new SearchBotDeviceInfo(name, version, os, searchBotMatch[1]);
  }
  return new BrowserInfo(name, version, os);
}
function detectOS(ua) {
  for (var ii = 0, count = operatingSystemRules.length; ii < count; ii++) {
    var _a = operatingSystemRules[ii],
      os = _a[0],
      regex = _a[1];
    var match = regex.exec(ua);
    if (match) {
      return os;
    }
  }
  return null;
}
function getNodeVersion() {
  var isNode = typeof process !== "undefined" && process.version;
  return isNode ? new NodeInfo(process.version.slice(1)) : null;
}
function createVersionParts(count) {
  var output = [];
  for (var ii = 0; ii < count; ii++) {
    output.push("0");
  }
  return output;
}
// end of detect-browser

// browsers that support es5 features
var defaultSettings = {
  edge: "79",
  firefox: "88",
  chrome: "90",
  safari: "15",
  opera: "15",
  ie: "12",
  ios: "15",
  android: "8.0",
  samsung: "8",
  chromium: "90",
};
var MinimumRequirement = /** @class */ (function () {
  function MinimumRequirement(setting) {
    this.setting = defaultSettings;
  }
  return MinimumRequirement;
})();
function canAppSupport(req, userAgent) {
  if (req === void 0) {
    req = {};
  }
  if (userAgent === void 0) {
    userAgent = undefined;
  }
  var config = new MinimumRequirement(req);
  var info = detect(userAgent);
  if (info && info.type === "browser") {
    if (!config.setting[info.name]) {
      return true;
    } else if (
      compareVersions(info.version, config.setting[info.name]) === -1
    ) {
      return true;
    }
  }
  return false;
}

//判断版本号
function compareVersions(version1, version2) {
  var v1 = version1.split(".").map(Number);
  var v2 = version2.split(".").map(Number);

  for (var i = 0; i < Math.max(v1.length, v2.length); i++) {
    var num1 = i < v1.length ? v1[i] : 0;
    var num2 = i < v2.length ? v2[i] : 0;

    if (num1 > num2) {
      return 1; // version1 > version2
    } else if (num1 < num2) {
      return -1; // version1 < version2
    }
  }

  return 0; // version1 = version2
}

var info = detect();
if (canAppSupport()) {
  if (info) {
    if (info.name === "ie") {
      document.body.innerHTML =
        '<div style="padding: 20px"><style>h1 { font-size: 32px } div { line-height: 1.6; margin-top: 10px } a { color: #04b }</style><h1>浏览器需要升级</h1><div>你好，你正在使用IE浏览器。该浏览器于 1995 年跟随 Windows 系统发布，为因特网早期的发展做出了不可估量的贡献。但是在随后的二十多年，浏览器技术发生了天翻地覆的变化，这款老旧的浏览器因携带了太多历史包袱而无法对新技术提供足够多的支持。因此微软已经决定在2020年底停止对其进行更新和支持，并推荐用户使用全新的<a href="https://www.microsoft.com/zh-cn/edge" target="_blank" rel="noopener">Edge浏览器</a>。当然你也可以从其他众多的现代浏览器中进行选择：<a href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank" rel="noopener">谷歌Chrome浏览器</a>、<a href="http://www.firefox.com.cn/download/" target="_blank" rel="noopener">火狐浏览器</a>、<a href="https://browser.qq.com/" target="_blank" rel="noopener">QQ浏览器</a>、<a href="https://ie.sogou.com/" target="_blank" rel="noopener">搜狗浏览器</a>、<a href="http://browser.360.cn/" target="_blank" rel="noopener">360安全浏览器</a>、<a href="https://browser.360.cn/ee/" target="_blank" rel="noopener">360极速浏览器</a>。<br />最后，祝你在新的浏览器里发现一个精彩纷呈的世界！</div></div>';
    } else if (
      defaultSettings[info.name] &&
      info.version < defaultSettings[info.name]
    ) {
      document.body.innerHTML =
        '<div style="padding: 20px"><style>h1 { font-size: 32px } div { line-height: 1.6; margin-top: 10px } a { color: #04b }</style><h1>浏览器需要升级</h1><div>你好，你正在使用' +
        info.name +
        "浏览器 (" +
        "版本:" +
        info.version +
        ')，因版本较低不在该系统的支持范围内，请升级浏览器或者换用其他浏览器。<br />推荐以下浏览器：<a href="https://www.microsoft.com/zh-cn/edge"      target="_blank"      rel="noopener"      >Edge浏览器</a    >(版本79以上)。当然你也可以从其他众多的现代浏览器中进行选择：<a      href="https://www.google.cn/intl/zh-CN/chrome/"      target="_blank"      rel="noopener"      >谷歌Chrome浏览器</a    >(版本90以上)、<a      href="http://www.firefox.com.cn/download/"      target="_blank"      rel="noopener"      >火狐浏览器</a    >(版本88以上)<br />最后，祝你在新的浏览器里发现一个精彩纷呈的世界！</div>';
    }
  }
}