//封装的关于统计的方法
import { post } from './request'
import { base64Encode } from './common.js'
import { gdKey } from './config.js'


/**
 * 初始化统计
 * @params showDebug Boolean 是否开启统计日志，默认false 不开启
 * @zjf-2021-06-27
 */
export function initStat(showDebug = false, initStatCommonProperty) {
	localStorage.sldStatShowDebug = showDebug;
	//获取udid
	let uuid = ''
	if (localStorage.getItem('sldStatCommonProperty')&&JSON.parse(localStorage.getItem('sldStatCommonProperty')).uuid) {
		uuid = JSON.parse(localStorage.getItem('sldStatCommonProperty')).uuid
	} else {
		uuid = getUUID();
	}

	initStatCommonProperty = {
		...initStatCommonProperty,
		uuid: uuid,
	}
	updateStatCommonProperty(initStatCommonProperty)
}

/**
 * 设置/更新统计的公共属性
 * @params data Object 要更新的属性数据
 * @zjf-2021-06-27
 */
export function updateStatCommonProperty(data) {
	let target = {};
	const value = localStorage.getItem('sldStatCommonProperty');
	if (value) {
		target = JSON.parse(value);
	}
	target = {
		...target,
		...data
	}; //更新或者新增统计的公共属性
	localStorage.sldStatCommonProperty = JSON.stringify(target);
}

/**
 * 同步获取指定key对应的内容
 * @params key 指定的缓存key
 * @zjf-2021-06-27
 */
export function getStatStorage(key) {
	let target = {};
	const value = localStorage.getItem(key);
	if (value) {
		target = JSON.parse(value);
	}
	return target;
}

/**
 * 获取uuid
 * 如：1624819897644-1389918-0ed8161319cedb-22991203
 * Math.random().toString(16).replace('.', '')：0～1的随机数以十六进制显示，并去掉小数点，如：0.f03fb618bf531，并去掉小数点
 * @zjf-2021-06-27
 */
export function getUUID() {
	return "" + Date.now() + '-' + Math.floor(1e7 * Math.random()) + '-' + Math.random().toString(16).replace('.', '') +
		'-' + String(Math.random() * 31242).replace('.', '').slice(0, 8);
}

/**
 * 获取地理位置信息,各个终端分别获取
 * @zjf-2021-06-27
 */
export async function getLocation() {
	let locationData = {
		cityCode: '', //城市编码
		cityName: '', //城市名称
		location: '', //经纬度，英文逗号分隔
		provinceCode: '', //	省份编码
		provinceName: '', //	省份名称
	};

	locationData = await getH5Location(locationData);

	return locationData;
}

/**
 * 获取H5的地理位置
 * @zjf-2021-06-28
 */
export function getH5Location(locationData) {
	return new Promise(func => {
		//普通h5获取定位
		var script = document.createElement('script');
		script.src = "https://webapi.amap.com/maps?v=1.4.15&key=" + gdKey +
			"&callback=mapInit";
		document.body.appendChild(script);
		//这里要加window., loadScrpit的callback才会执行
		window.mapInit = function () {
			let mapObj = new AMap.Map('iCenter');
			mapObj.plugin('AMap.Geolocation', function () {
				let geolocation = new AMap.Geolocation({
					enableHighAccuracy: false, //是否使用高精度定位，默认:true
					timeout: 5000, //超过5秒后停止定位，默认：无穷大
				});
				geolocation.getCurrentPosition();
				//返回定位信息
				AMap.event.addListener(geolocation, 'complete', function (res) {
					locationData.location = res.position.lng + ',' + res.position.lat;
					if (res.addressComponent && res.addressComponent.city == '') {
						locationData.provinceName = res.addressComponent.province
							.substring(0, res.addressComponent.province.length - 1);
						locationData.cityName = res.addressComponent.province;
					}
					func(locationData);
				});
				//返回定位出错信息
				AMap.event.addListener(geolocation, 'error', function (err) {
					console.info('获取地理位置信息出错，出错信息为：', err);
					func(locationData);
				});
			});
		}
	})
}

/**
 * 获取浏览器信息
 * @zjf-2021-06-27
 */
export function getSystemInfo() {

}

/**
 * 统计事件
 * @params params Object 参数
 * @zjf-2021-06-27
 */
export async function sldStatEvent(data) {
	//将data和公共属性合并得到最终要发送的数据
	let sldStatCommonProperty = getStatStorage('sldStatCommonProperty');
	let targetParams = {
		...sldStatCommonProperty,
		...data
	};
	//没有位置信息
	//获取位置信息
	if (!targetParams.location) {
		//获取位置信息
		let location = await getLocation();
		targetParams = {
			...targetParams,
			...location
		};
		updateStatCommonProperty(location)
	}
	//日志开启的话需要打印数据
	const sldStatShowDebug = localStorage.getItem('sldStatShowDebug');
	if (sldStatShowDebug == 'true') {
		console.info('统计传输数据: ', targetParams);
	}
	//发送请求
	post("v3/statistics/front/member/behavior/save", { u: base64Encode(JSON.stringify(targetParams)) }).then();
}
