/*global alert*/
'use strict';

function insertSiblingBefore(info, tab) {

    //Add all you functional Logic here
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {

            "functiontoInvoke": "insertSiblingBefore"
        });
        console.log('message sent');
    });
}
function insertSiblingAfter(info, tab) {

    //Add all you functional Logic here
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {

            "functiontoInvoke": "insertSiblingAfter"
        });
    });
}
function insertFirstChild(info, tab) {

    //Add all you functional Logic here
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {

            "functiontoInvoke": "insertFirstChild"
        });
    });
}
function insertLastChild(info, tab) {

    //Add all you functional Logic here
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {

            "functiontoInvoke": "insertLastChild"
        });
    });
}
function insertParent(info, tab) {

    //Add all you functional Logic here
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {

            "functiontoInvoke": "insertParent"
        });
    });
}
function insertSiblingBeforeSummary(info, tab) {

    //Add all you functional Logic here
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {

            "functiontoInvoke": "insertSiblingBeforeSummary"
        });
        console.log('message sent');
    });
}
function insertSiblingAfterSummary(info, tab) {

    //Add all you functional Logic here
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {

            "functiontoInvoke": "insertSiblingAfterSummary"
        });
    });
}
function insertFirstChildSummary(info, tab) {

    //Add all you functional Logic here
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {

            "functiontoInvoke": "insertFirstChildSummary"
        });
    });
}
function insertLastChildSummary(info, tab) {

    //Add all you functional Logic here
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {

            "functiontoInvoke": "insertLastChildSummary"
        });
    });
}
function insertParentSummary(info, tab) {

    //Add all you functional Logic here
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {

            "functiontoInvoke": "insertParentSummary"
        });
    });
}

// Create one test item for each context type.
var menuItems = [["Summary: Insert as Sibling Before",insertSiblingBeforeSummary],["Summary: Insert as Sibling After",insertSiblingAfterSummary],["Summary: Insert as First Child",insertFirstChildSummary],["Summary: Insert as Last Child",insertLastChildSummary],["Summary: Insert as Parent",insertParentSummary],["Main: Insert as Sibling Before",insertSiblingBefore],["Main: Insert as Sibling After",insertSiblingAfter],["Main: Insert as First Child",insertFirstChild],["Main: Insert as Last Child",insertLastChild],["Main: Insert as Parent",insertParent]];
var contexts = ["page", "selection", "link", "editable", "image", "video",
    "audio"];
for (var i = 0; i < menuItems.length; i++) {
    var id = chrome.contextMenus.create({
        "title": menuItems[i][0],
        "contexts": contexts,
        "onclick": menuItems[i][1]
    });
   
}


var PROXY_NOT_CONNECTED = 'not connected';
var PROXY_COULD_NOT_START_PORT_ERROR = 'could not start port error';
var PROXY_COULD_NOT_START_LIBS_ERROR = 'could not start libs error';
var PROXY_STARTED = 'proxy started';
var PROXY_CONNECTED = 'proxy connected';
var PROXY_DISCONNECTED = 'proxy disconnected';

var nativeMessagingPort;
var couldNotStartProxy;

/*************************/
/******* FIRST RUN *******/
/*************************/

function showFirstRunMessage() {
	if (localStorage.getItem('installTime')) {
		return;
	}

	localStorage.setItem('installTime', new Date().getTime());
	chrome.tabs.create({url: 'first-run.html'});
}
showFirstRunMessage();

/*************************/
/********** INIT *********/
/*************************/

var settings = {};
var defaultSettings = {
	isProxyEnabled: true,
	pacScript:	'function FindProxyForURL(url, host) {\n' +
				'    if (host == "localhost")\n' +
				'        return "DIRECT";\n' +
				'    return "PROXY localhost:%%PORT%%";\n' +
				'}',
	sidebarWidth: '250px',
	editorCommandLine: '',
	proxyPort: 8080
};

// if (window.navigator.appVersion.match(/OS X/)) {
// 	defaultSettings.editorCommandLine = 'subl';
// } else if (window.navigator.appVersion.match(/win/i)) {
// 	defaultSettings.editorCommandLine = null;
// }

for (var key in defaultSettings) {
	if (localStorage.getItem(key)) {
		settings[key] = localStorage.getItem(key);
	} else {
		settings[key] = defaultSettings[key];
		localStorage.setItem(key, settings[key]);
	}
	localStorage.setItem('default.' + key, defaultSettings[key]);
}

if (!localStorage.getItem('rules')) {
	localStorage.setItem('rules', '[]');
}

// chrome.tabs.onUpdated.addListener(function (tabId) {
// 	if (chrome.pageAction) {
// 		chrome.pageAction.show(tabId);
// 	}
// });

var proxyState = PROXY_NOT_CONNECTED;

/*************************/
/********* PROXY *********/
/*************************/

var config = {
	system: {
		mode: 'system'
	},
	tamper: {
		mode: 'fixed_servers',
		rules: {
			proxyForHttp: {
				host: 'localhost',
				port: 8889
			},
			proxyForHttps: {
				host: 'localhost',
				port: 8889
			},
			bypassList: ['localhost:8001', 'localhost:35729']
		}
	}
};

chrome.proxy.settings.set({value: config.system, scope: 'regular'}, function() {});

var openCount = 0;
var ports = [];

function sendMessageToAllPorts(message) {
	for (var i = 0; i < ports.length; i++) {
		console.log('Sending message ', message, 'to port', ports[i]);
		ports[i].postMessage(message);
	}
}

function updateProxyConfig() {
	if (!settings.isProxyEnabled || proxyState !== PROXY_STARTED) {
		chrome.proxy.settings.set({value: config.system, scope: 'regular'}, function() {});
	} else {
		chrome.proxy.settings.set({
			value: {
				mode: 'pac_script',
				pacScript: {
					data: settings.pacScript.replace('%%PORT%%', settings.proxyPort)
				}
			},
			scope: 'regular'
		}, function() {});
	}
	localStorage.setItem('isProxyEnabled', settings.isProxyEnabled);
}

function updateProxyIcon() {
	if (proxyState !== PROXY_STARTED) {
		chrome.browserAction.setIcon({'path': {'19': 'images/icon_error.png', '38': 'images/icon_error@2x.png'}});
		chrome.browserAction.setTitle({title: 'Error starting proxy'});
	} else {
		if (settings.isProxyEnabled) {
			chrome.browserAction.setIcon({'path': {'19': 'images/icon_on.png', '38': 'images/icon_on@2x.png'}});
			chrome.browserAction.setTitle({title: 'Tamper is enabled'});
		} else {
			chrome.browserAction.setIcon({'path': {'19': 'images/icon_off.png', '38': 'images/icon_off@2x.png'}});
			chrome.browserAction.setTitle({title: 'Tamper is disabled'});
		}
	}
}

//TODO use observe instead
function onProxyStateChange() {
	updateProxyConfig();
	updateProxyIcon();
	sendMessageToAllPorts({
		method: 'proxy-state-update',
		isProxyEnabled: settings.isProxyEnabled,
		proxyState: proxyState
	});
}

chrome.runtime.onConnect.addListener(function (port) {
	console.log(port);
	if (port.name === 'devtools-page') {
		openCount++;
		console.log('hye');
		ports.push(port);
		onProxyStateChange();

		port.onDisconnect.addListener(function(port) {
			console.log('bye');
			openCount--;
			ports.splice(ports.indexOf(port), 1);
			onProxyStateChange();
		});

		port.onMessage.addListener(function (message) {
			switch (message.method) {
				case 'update-settings':
					settings.editorCommandLine = localStorage.getItem('editorCommandLine');
					settings.pacScript = localStorage.getItem('pacScript');
					settings.proxyPort = localStorage.getItem('proxyPort');
					updateProxyConfig();
					updateProxyIcon();
					break;
				default:
					console.log('Posting message to proxy', message);
					nativeMessagingPort.postMessage(message);
					break;
			}
		});
	}
	console.log('sending proxy state update',settings.isProxyEnabled,proxyState);
	port.postMessage({
		method: 'proxy-state-update',
		isProxyEnabled: settings.isProxyEnabled,
		proxyState: proxyState
	});
});

chrome.runtime.onMessage.addListener(function (message) {
	console.log(message);
	switch (message.method) {
		case 'toggle-proxy':
			settings.isProxyEnabled = message.isEnabled;
			onProxyStateChange();
			break;
	}
});

function toggleProxy() {
	settings.isProxyEnabled = !settings.isProxyEnabled;
	onProxyStateChange();
}

chrome.browserAction.onClicked.addListener(function () {
	toggleProxy();
});

chrome.commands.onCommand.addListener(function(command) {
	if (command === 'toggle-tamper') {
		toggleProxy();
	}
});

function connectToProxy() {
	console.log('connecting to proxy');
	nativeMessagingPort = chrome.runtime.connectNative('com.dutzi.tamper');

	setTimeout(function () {
		if (nativeMessagingPort) {
			nativeMessagingPort.postMessage({method: 'hello'});
			nativeMessagingPort.postMessage({method: 'start-proxy', port: settings.proxyPort});
			nativeMessagingPort.postMessage({
				method: 'update-rules',
				rules: JSON.parse(localStorage.getItem('rules'))
			});
		}
	}, 1000);

	nativeMessagingPort.onMessage.addListener(function(msg) {
		if (msg.msg.method !== 'log') {
			console.log('Got message: ', msg.msg);
		}

		var oldProxyState = proxyState;

		if (proxyState !== PROXY_CONNECTED && proxyState !== PROXY_STARTED) {
			proxyState = PROXY_CONNECTED;
		}

		switch (msg.msg.method) {
			case 'log':
				console.log('Proxy Log:', msg.msg.message);
				break;
			case 'version':
				console.log('Mitmproxy Extension Version: ' + msg.msg.version);
				localStorage.setItem('mitmproxyExtensionVersion', msg.msg.version);
				break;
			case 'proxy-error':
				console.error('Proxy Error (' + msg.msg.errorCode + '): ' + msg.msg.errorDesc);
				switch (msg.msg.errorCode) {
					case 100:
						proxyState = PROXY_COULD_NOT_START_PORT_ERROR;
						break;
					case 101:
						proxyState = PROXY_COULD_NOT_START_LIBS_ERROR;
						break;
				}
				break;
			case 'proxy-started':
				proxyState = PROXY_STARTED;
				break;
			default:
				sendMessageToAllPorts(msg.msg);
				break;
		}

		if (oldProxyState !== proxyState) {
			onProxyStateChange();
		}
	});

	nativeMessagingPort.onDisconnect.addListener(function() {
		console.log('Disconnected');
		if (proxyState !== PROXY_COULD_NOT_START_LIBS_ERROR) {
			proxyState = PROXY_DISCONNECTED;
			nativeMessagingPort = null;
			onProxyStateChange();
			setTimeout(connectToProxy, 1000);
		}
	});
}

connectToProxy();

settings.isProxyEnabled = localStorage.getItem('isProxyEnabled') === 'true';
onProxyStateChange();
