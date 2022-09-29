<!--
 * @Author: zoucb
 * @Date: 2021-03-23
 * @LastEditTime: 2021-05-26 15:37:13
 * @LastEditors: Please set LastEditors
 * @FilePath: /src/views/service/chatPage.vue
-->
<!--客服聊天界面 @zoucb-2021-03-23-->
<template>
    <div class="sld_chat">
        <div class="chat_wrap" :style="'height:'+clientHeight+'px'">
            <div class="chat_top">
                <!-- 左上角用户信息start -->
                <div class="head_user">
                    <div class="user_avatar">
                        <div class="img_bg">
                            <img :src="memberInfo.memberAvatar" alt="">
                        </div>
                    </div>
                    <div class="user_info">
                        <div class="user_name ellipsis">{{memberInfo.memberName}}</div>
                        <div class="on_offLine">{{onOffLine}}</div>
                    </div>
                </div>
                <!-- 左上角用户信息end -->
                <!-- 顶部店铺头像，名称start -->
                <div class="head_store" @click="storeDetail">
                    <img :src="curStoreInfo.vendorAvatar" alt="">
                    <div class="store_title">{{curStoreInfo.storeName}}</div>
                </div>
                <!-- 顶部店铺头像，名称end -->
            </div>

            <div class="chat_below" :style="'height:'+(clientHeight-80)+'px'">
                <!-- 左边的聊天列表start -->
                <chatStoreList @switchStore="switchStore" ref="left" @getCurStoreInfo="getCurStoreInfo" />
                <!-- 左边的聊天列表end -->

                <!-- 聊天框start -->
                <div class="chat_zone">
                    <div class="chat_window" :style="'height:'+(clientHeight-250)+'px'">
                        <!-- 只要加个发布内容者是商家还是用户的flag即可判别内容样式 -->
                        <el-scrollbar ref="scroll" id="chat">
                            <div v-for="(item, index) in msgList.list" :key="index">


                                <div class="main_goods_item" v-if="item.msgType == 'main_goods'">
                                    <div class="main_goods_con">
                                        <img :src="item.msgContent.goodsImage" alt="">
                                        <div class="text_con">
                                            <p>{{item.msgContent.goodsName}}</p>
                                            <div class="bottom_con">
                                                <p class="price">￥{{item.msgContent.productPrice}}</p>
                                                <a @click="getObj(item.msgContent,'foot')">发送链接 ></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div v-if="index==0||(index>0&&$isShowTime(index>0?msgList.list[index-1].addTime:'',item.addTime))"
                                    class="time_line">
                                    {{$formatChatTime(item.addTime)}}
                                </div>
                                <!-- 商家merchant 头像放置第一个 -->
                                <div :class="{chat_ladder:true,merchant:item.userType==2,user:item.userType==1}">
                                    <img :src="item.vendorAvatar" alt="" class="conten_left" v-if="item.userType==2"
                                        @click="storeDetail" :style="{cursor:item.storeId!=0?'pointer':'default'}">

                                    <!-- 文本类型 -->
                                    <div class="content_right" v-if="item.msgType==1">
                                        <p>{{item.userType==1?item.memberName:item.storeName}}</p>
                                        <div class="content_below" style="display: flex;">
                                            <div class="msgRead" style="align-self: flex-end; margin-right: 10px;"
                                                v-if="item.userType==1">
                                                <span v-show="item.msgState==1" class="msgDone">已读</span>
                                                <span v-show="item.msgState==2" class="msgNot"
                                                    style="color:#FE5234">未读</span>
                                            </div>
                                            <span class="content_text text_type"
                                                v-html="JSON.parse(item.msgContent).content"></span>
                                        </div>
                                    </div>

                                    <!-- 商品类型 -->
                                    <div class="content_right" v-if="item.msgType==3">
                                        <p>{{item.userType==1?item.memberName:item.storeName}}</p>
                                        <div class="content_below" style="display: flex;">
                                            <div class="msgRead" style="align-self: flex-end; margin-right: 10px;"
                                                v-if="item.userType==1">
                                                <span v-show="item.msgState==1" class="msgDone">已读</span>
                                                <span v-show="item.msgState==2" class="msgNot"
                                                    style="color:#FE5234">未读</span>
                                            </div>
                                            <div class="content_text goods_type"
                                                @click="goodsDetail(JSON.parse(item.msgContent).productId)">
                                                <div class="goods_model" :key="index">
                                                    <img :src="JSON.parse(item.msgContent).goodsImage" alt="">
                                                    <div class="goods_info">
                                                        <div class="goods_info_title">
                                                            {{JSON.parse(item.msgContent).goodsName}}
                                                        </div>
                                                        <div class="goods_info_bottom">
                                                            <span>￥{{JSON.parse(item.msgContent).goodsPrice}}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 图片类型 -->
                                    <div class="content_right" v-if="item.msgType==2">
                                        <p>{{item.userType==1?item.memberName:item.storeName}}</p>
                                        <div class="content_below" style="display: flex;">
                                            <div class="msgRead" style="align-self: flex-end; margin-right: 10px;"
                                                v-if="item.userType==1">
                                                <span v-show="item.msgState==1" class="msgDone">已读</span>
                                                <span v-show="item.msgState==2" class="msgNot"
                                                    style="color:#FE5234">未读</span>
                                            </div>
                                            <div class="content_text image_type">
                                                <el-image :src="JSON.parse(item.msgContent).pic"
                                                    :preview-src-list="[JSON.parse(item.msgContent).pic]"
                                                    hide-on-click-modal="true" @error="imageError" id="elImage">
                                                    <template #placeholder>
                                                        <div class="image-slot">
                                                            <i class="el-icon-picture-outline"></i>
                                                        </div>
                                                    </template>
                                                </el-image>
                                            </div>
                                        </div>

                                    </div>

                                    <!-- 订单类型 -->
                                    <div class="content_right" v-if="item.msgType==4">
                                        <p>{{item.userType==1?item.memberName:item.storeName}}</p>
                                        <div class="content_below" style="display: flex;">
                                            <div class="msgRead" style="align-self: flex-end; margin-right: 10px;"
                                                v-if="item.userType==1">
                                                <span v-show="item.msgState==1" class="msgDone">已读</span>
                                                <span v-show="item.msgState==2" class="msgNot"
                                                    style="color:#FE5234">未读</span>
                                            </div>
                                            <div class="content_text order_type"
                                                @click="orderDetail(JSON.parse(item.msgContent).orderSn)">
                                                <div class="order_title">
                                                    <span
                                                        class="order_sn">订单号：<i>{{JSON.parse(item.msgContent).orderSn}}</i></span>
                                                    <span
                                                        class="order_time">{{JSON.parse(item.msgContent).createTime}}</span>
                                                </div>
                                                <div class="goods_model order_type">
                                                    <img :src="JSON.parse(item.msgContent).goodsImage" alt="">
                                                    <div class="goods_info">
                                                        <div class="goods_info_title">
                                                            {{JSON.parse(item.msgContent).goodsName}}
                                                        </div>
                                                        <div class="goods_info_bottom goods_info_bottom_detial">
                                                            <span>￥{{JSON.parse(item.msgContent).goodsPrice}}</span>
                                                            <span
                                                                class="goods_info_bottom_ok">{{JSON.parse(item.msgContent).orderStateValue}}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <img :src="item.memberAvatar" alt="" class="user_avatar" v-if="item.userType==1">
                                </div>

                            </div>
                            <div></div>
                        </el-scrollbar>
                    </div>
                    <!-- 聊天框end -->

                    <!-- 聊天输入框start -->
                    <div class="chat_input">
                        <div class="bar">
                            <!-- 表情start -->
                            <el-popover placement="top-start" :width="300" trigger="click">
                                <template #reference>
                                    <a class="face_ex">
                                        <img src="@/assets/service/face_ex.png" alt="">
                                        <!-- <i class="iconfont icon-biaoqing"></i> -->
                                    </a>
                                </template>
                                <div class="emoji_s">
                                    <div v-for="(e,i) in emojis" :key="i" :title="e.title" class="emoji_item"
                                        @click="transEmoji(e.src)">
                                        <img :src="require('@/assets/emoji/'+(e.src))" alt="">
                                    </div>
                                </div>
                            </el-popover>
                            <!-- 表情end -->

                            <!-- 图片start -->
                            <label for="image">
                                <!-- <i class="iconfont">&#xe738;</i> -->
                                <img src="@/assets/service/pic.png" alt="">
                            </label>
                            <input type="file" id="image" @change="getImage" ref="imageFile" accept="image/*">
                            <!-- 图片end -->

                            <el-popover placement="top-start" :width="470" :visible="popFlag" trigger="click"
                                v-if="comQuest&&comQuest.length>0">
                                <template #reference>
                                    <a class="common_quest">
                                        <img src="@/assets/service/common.png" alt="" @click="popFlag = true">
                                    </a>
                                </template>
                                <div class="pop_header">
                                    <p>常见问题</p>
                                    <p>
                                        <i class="el-icon-close" @click="popFlag=false"></i>
                                    </p>

                                </div>
                                <div class="pop_list" v-if="comQuest&&comQuest.length>0">
                                    <el-scrollbar>
                                        <div class="pop_item" v-for="(item,index) in comQuest" :key="index"
                                            @click="sendQuick(item)">
                                            {{item.msgContent}}
                                        </div>
                                    </el-scrollbar>
                                </div>
                                <div class="empty_quick" v-if="!comQuest.length>0">
                                    <img src="@/assets/goods/empty_data.png" alt="">
                                    <p>暂未有常见问题~</p>
                                </div>
                            </el-popover>
                        </div>
                        <div class="input_area">
                            <!-- <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="textarea" resize="none"
                                @keyup.enter="send">
                            </el-input> -->
                            <pre name="sendBox" contenteditable="true" class="send-textarea" @input="preInput"
                                ref="sendBox" @paste="listenPaste"></pre>
                        </div>
                        <div class="send">
                            <button @click="send">发送</button>
                        </div>
                    </div>
                    <!-- 聊天输入框end -->
                </div>
                <!-- 聊天框end -->

                <!-- 右边的列表start -->
                <chatRightList @getObj="getObj" ref="right" />
                <!-- 右边的列表end -->
            </div>
        </div>

    </div>
</template>

<script>
    import { emoji, emojiPath } from '@/utils/data.js';
    import chatStoreList from './chatStoreList';
    import chatRightList from './chatRightList';
    import { ref, reactive, getCurrentInstance, onMounted, watch } from 'vue';
    import { useStore } from 'vuex'
    import { ElMessage } from 'element-plus'
    import { useRoute, useRouter } from 'vue-router'

    export default {
        components: {
            chatStoreList,
            chatRightList
        },
        beforeCreate() {
            // this.$socket.emit("connect_success", this.connectBaseData);
            // alert(JSON.stringify(this.connectBaseData))
            //监听连接成功事件
            this.sockets.subscribe('get_room_info', (data) => {
                this.socketInfo.data = data;
            });
            this.sockets.subscribe('get_send_msg', (data) => {
                //如果是会员发送过来的话需要播放声音
                if (data.userType == 2 && (localStorage.msgVoiceSetting === true || localStorage.msgVoiceSetting === 'true')) {
                    this.play();
                }
                this.msgList.list.push(data);
            });
            this.sockets.subscribe('get_read_msg', (data) => {
                let allData = data.msgIds.split(',');
                this.msgList.list.map(item => {
                    if (allData.indexOf(item.msgId)) {
                        item.msgState = 1;
                    }
                });
            });
            this.sockets.subscribe('get_member_read_all', () => {
                this.msgList.list.map(item => {
                    item.msgState = 1;
                });
            });

        },
        setup() {
            const route = useRoute()
            const router = useRouter()
            const socketInfo = reactive({ data: {} });//socket连接成功返回的房间信息
            const store = useStore()
            const { proxy } = getCurrentInstance();
            const memberInfo = ref(store.state.memberInfo)
            const chatBaseInfo = ref(store.state.chatBaseInfo)
            const connectBaseData = reactive({ storeId: chatBaseInfo.value.storeId, userId: memberInfo.value.memberId, role: 1, sourceUrl: 'pc:' + chatBaseInfo.value.source });
            const textarea = ref('')
            const msgList = reactive({ list: [] });//聊天列表
            const minMsgId = ref('');//当前消息聊天记录列表里的最小消息id
            const hasMore = ref(false);
            const curStoreId = ref('')
            const curStoreInfo = ref('');
            const comQuest = ref([])
            const popFlag = ref(false)
            const scrollTop = ref(false)
            const flag = ref('')
            const emojis = reactive(emoji)
            const onOffLine = ref('在线')
            //获取聊天记录
            const getChatLog = () => {
                let params = {
                    storeId: curStoreId.value,
                }
                if (minMsgId.value) {
                    params.msgId = minMsgId.value;
                } else {
                    delete params.msgId
                }
                proxy.$post('v3/helpdesk/front/chat/msgLog', params).then(res => {
                    if (res.state == 200) {
                        if (minMsgId.value) {
                            setTimeout(() => {
                                msgList.list = Array.from(res.data).concat(msgList.list);
                            }, 20)
                        } else {
                            msgList.list = res.data
                        }
                        if (!minMsgId.value && chatBaseInfo.value.sourceType == 'goods' && curStoreId.value == route.query.vid) {
                            msgList.list.push({
                                addTime: new Date().getTime(),
                                msgType: 'main_goods',
                                msgContent: chatBaseInfo.value.showData
                            });
                        }

                        if (msgList.list.length > 0) {
                            changeMsgState(msgList.list);
                            minMsgId.value = res.data[0].msgId;
                        }
                        hasMore.value = res.data.length < 10 ? false : true;
                    }
                })
            }

            const transEmoji = (src) => {
                const imgTag = document.createElement("img");
                imgTag.src = (emojiPath) + "" + (src);
                proxy.$refs.sendBox.appendChild(imgTag);
                textarea.value = proxy.$refs.sendBox.innerHTML
            }


            const preInput = (e) => {
                var re = /<[^img][^>]+>/g
                textarea.value = e.target.innerHTML.replace(re, "")
            }

            // 消息提示音
            const play = () => {
                let audioElement = document.createElement('audio');
                audioElement.setAttribute('src', 'https://www.slodon.cn/vendor/views/default/media/msg.mp3');
                audioElement.setAttribute('autoplay', 'autoplay');
            }

            //修改当前消息列表的未读消息为已读
            const changeMsgState = (data) => {
                let tmpMsgIdArray = [];
                data.map(item => {
                    if (item.userType == 2 && item.msgState == 2) {
                        tmpMsgIdArray.push(item.msgId);
                    }
                });
                if (tmpMsgIdArray.length > 0) {
                    proxy.$socket.emit("read_msg", {
                        msgIds: tmpMsgIdArray.join(','),
                        storeId: curStoreId.value,
                        userId: memberInfo.value.memberId,
                        role: 1
                    });
                }
            }
            //发送消息
            const send = () => {
                let content = textarea.value; //没有内容的话直接结束
                if (!content.trim() && !content) {
                    return false;
                }
                let msgData = {};
                msgData.memberId = memberInfo.value.memberId;
                msgData.vendorId = socketInfo.data.vendorId;
                msgData.msgType = '1';
                msgData.msg = {
                    content: content
                };
                proxy.$socket.emit("send_msg", { ...msgData, ...connectBaseData });
                proxy.$refs.sendBox.innerText = ''
                textarea.value = '';//清空输入框的内容
            }

            //获取订单，足迹，推荐商品，并发送
            const getObj = (data, type) => {
                let msgData = {};
                msgData.memberId = memberInfo.value.memberId;
                msgData.vendorId = socketInfo.data.vendorId;
                if (type == 'foot') {
                    msgData.msgType = 3;
                    msgData.msg = {
                        productId: data.productId,
                        goodsImage: data.goodsImage,
                        goodsName: data.goodsName,
                        goodsPrice: data.productPrice,
                        goodsId: data.goodsId
                    };
                } else if (type == 'recom') {
                    msgData.msgType = 3;
                    msgData.msg = {
                        productId: data.defaultProductId,
                        goodsImage: data.goodsImage,
                        goodsName: data.goodsName,
                        goodsPrice: data.goodsPrice,
                        goodsId: data.goodsId
                    };
                } else if (type === 'order') {
                    msgData.msgType = 4;
                    msgData.msg = {
                        orderSn: data.orderSn,
                        createTime: data.createTime,
                        orderStateValue: data.orderStateValue,
                        productId: data.goodsItem.productId,
                        goodsImage: data.goodsItem.productImage,
                        goodsName: data.goodsItem.goodsName,
                        goodsPrice: data.goodsItem.productShowPrice,
                        goodsId: data.goodsItem.goodsId
                    };
                }
                proxy.$socket.emit("send_msg", { ...msgData, ...connectBaseData });
            }

            const getCurStoreInfo = (data) => {
                if (data.storeId != undefined) {
                    curStoreInfo.value = data;
                } else {
                    curStoreInfo.value = '';
                }
            }


            const goodsDetail = (productId) => {
                let newWin = router.resolve({
                    path: '/goods/detail',
                    query: {
                        productId,
                    }
                })

                window.open(newWin.href, '_blank')
            }


            const orderDetail = (orderSn) => {
                let newWin = router.resolve({
                    path: '/member/order/detail',
                    query: {
                        orderSn,
                    }
                })

                window.open(newWin.href, '_blank')
            }

            const switchStore = (data) => {
                let { storeId, storeName, vendorId } = data;
                curStoreId.value = storeId;
                connectBaseData.storeId = storeId
                minMsgId.value = '';
                scrollTop.value = false
                msgList.list = [];
                socketInfo.data.vendorId = vendorId
                setTimeout(() => {
                    proxy.$nextTick(() => {
                        minMsgId.value = '';
                        getChatLog();
                    })
                }, 10)
                flag.value = storeName.toString()
                proxy.$refs.right.getSwitch(storeId)
                getCommonQuest()
            }

            const storeDetail = () => {


                if (!curStoreId.value) {
                    return
                }

                let newWin = router.resolve({
                    path: '/store/index',
                    query: {
                        vid: curStoreId.value
                    }
                })

                window.open(newWin.href, '_blank')
            }

            //切换店铺的滑动操作，而且触顶加载则保持滚动条在触顶时的位置，不大跳
            watch(() => flag.value, (nv, ov) => {
                let el = document.getElementById('chat').childNodes[0]
                // let client = document.getElementById('chat')
                if (nv != ov) {
                    scrollTop.value = false

                    new MutationObserver(() => {
                        if (scrollTop.value) {
                            return
                        }
                        scrollToBottom(el);
                    }).observe(el, { subtree: true, childList: true })

                }
            })

            //滑动至底部方法
            const scrollToBottom = el => {
                el.scrollTop = el.scrollHeight;
                el.scrollTo(0, el.scrollHeight)
            };

            //MutationObserver监听dom变化，当聊天数据最终渲染完成时，将其滑动至底部(优化方法)
            const scroll = () => {
                let timeout = '';
                let el = document.getElementById('chat').childNodes[0]
                let client = document.getElementById('chat')

                el.addEventListener('scroll', () => {
                    if (timeout) window.clearTimeout(timeout);
                    timeout = window.setTimeout(function () {
                        if (el.scrollTop < 10 && scrollTop.value) {
                            getChatLog()
                        } else {
                            scrollTop.value = false
                        }
                    }, 500);
                });

                new MutationObserver(() => {
                    if (scrollTop.value) {
                        proxy.$nextTick(() => {
                            el.scrollTop = client.clientHeight + 300
                        })

                        return
                    }
                    scrollToBottom(el);
                }).observe(el, { childList: true, subtree: true });


            }



            // 发送图片
            const getImage = (e) => {
                if (e.target.files[0]) {


                    let tar_file = e.target.files[0]
                    if (tar_file.type.indexOf('image') < 0) {
                        ElMessage.warning('请选择图片类型文件')
                        return
                    }


                    proxy.$post('v3/oss/common/upload', {
                        source: 'goods',
                        file: e.target.files[0]
                    }, 'form').then(res => {
                        if (res.state == 200) {
                            proxy.$refs.imageFile.value = ""
                            let msgData = {}
                            msgData.memberId = memberInfo.value.memberId;
                            msgData.vendorId = socketInfo.data.vendorId;
                            msgData.msgType = '2';
                            msgData.msg = {
                                pic: res.data.url
                            };
                            proxy.$socket.emit("send_msg", { ...msgData, ...connectBaseData });
                        }

                    })
                }
            }

            const getCommonQuest = () => {

                let params = {
                    storeId: connectBaseData.storeId,
                    current: 1
                }
                proxy.$get('v3/helpdesk/front/chat/problemList', params).then(res => {
                    if (res.state == 200) {
                        comQuest.value = res.data.list.filter(i => i.isShow == 1)
                    }
                })
            }


            const listenScrollPrevent = () => {
                let dom = document.getElementById('chat')
                dom.onwheel = (e) => {
                    scrollTop.value = true
                }
            }

            //发送快捷回复
            const sendQuick = (msg) => {
                let msgData = {};
                msgData.memberId = memberInfo.value.memberId;
                msgData.vendorId = socketInfo.data.vendorId;
                msgData.msgType = '5';
                msgData.msg = {
                    content: msg.msgContent,
                    reply: msg.msgReply
                };

                popFlag.value = false
                proxy.$socket.emit("send_msg", { ...msgData, ...connectBaseData });
            }





            const listenPaste = (e) => {
                if (e.clipboardData && e.clipboardData.items) {
                    let items = e.clipboardData.items || [];
                    let file = null;
                    if (items && items.length) {
                        for (let i = 0; i < items.length; i++) {
                            if (items[i].type.indexOf('image') !== -1) {
                                file = items[i].getAsFile();
                            }
                        }
                    }
                    // 获取文件之后就可以上传服务器或者其他操作啦
                    if (file) {
                        let obj = {
                            target: {
                                files: [file]
                            }
                        }
                        proxy.$confirm('是否要发送剪切板的图片?', '提示', {
                            confirmButtonText: '确认',
                            cancelButtonText: '取消'
                        }).then(() => {
                            getImage(obj)
                        })
                    } else {
                        textFormat(e)
                    }
                }
            }

            //复制其他地方的文本需要这样的特殊处理,不能简单的innerHTML = xxxxx
            const textFormat = (e) => {
                e.preventDefault()
                var text
                var clp = (e.originalEvent || e).clipboardData
                if (clp === undefined || clp === null) {
                    text = window.clipboardData.getData('text') || ''
                    if (text !== '') {
                        if (window.getSelection) {
                            var newNode = document.createElement('span')
                            newNode.innerHTML = text
                            window.getSelection().getRangeAt(0).insertNode(newNode)
                        } else {
                            document.selection.createRange().pasteHTML(text)
                        }
                    }
                } else {
                    text = clp.getData('text/plain') || ''
                    if (text !== '') {
                        document.execCommand('insertText', false, text)
                    }
                }
            }










            const clientHeight = ref(0)
            onMounted(() => {
                window.addEventListener("storage", function (e) {
                    if (e.key == "loginFlag" && e.newValue != "true") {
                        ElMessage.warning({
                            message: '账号已登出',
                            type: 'warning'
                        });
                        proxy.$socket.disconnect()
                        onOffLine.value = '离线'
                    }
                });
                let clientHeight1 = document.body.clientHeight || document.documentElement.clientHeight
                clientHeight.value = clientHeight1 - 100;
                scroll()
                listenScrollPrevent()
            })

            return {
                textarea,
                memberInfo,
                msgList,
                send,
                getObj,
                socketInfo,
                getCurStoreInfo,
                curStoreInfo,
                switchStore,
                connectBaseData,
                getImage,
                getCommonQuest,
                comQuest,
                popFlag,
                sendQuick,
                storeDetail,
                emojis,
                clientHeight,
                preInput,
                transEmoji,
                play,
                emojiPath,
                goodsDetail,
                orderDetail,
                onOffLine,
                listenPaste
            }
        }
    }
</script>

<style lang="scss">
    .empty_quick {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: 40px 0;

        img {
            width: 123px;
            height: 77px;
        }
    }

    .emoji_s {
        height: 200px;
        overflow: auto;
        display: flex;
        flex-wrap: wrap;

        .emoji_item {
            padding: 0 5px;
        }
    }

    .send-textarea {
        box-sizing: border-box;
        width: 100%;
        height: 73px;
        padding: 0px 19px 0px 19px;
        background-color: #fff;
        color: #252525;
        font-size: 13px;
        font-family: inherit;
        word-break: break-all;
        white-space: normal;
        overflow-y: auto;
        outline: none;
    }

    .main_goods_item {
        padding: 15px;
        background: #fff;
        border-radius: 10px;
        border-bottom: 1px solid #f5f5f5;
        box-shadow: 0px 2px 9px 1px rgba(86, 86, 86, 0.07);

        width: 420px;
        margin: 10px auto;

        .main_goods_con {
            .price {
                color: $colorMain;
            }

            display: flex;

            img {
                width: 84px;
                height: 84px;
                border-radius: 6px;
            }

            .text_con {
                margin-left: 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 100%;

                p {
                    font-size: 14px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #333333;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                }

                .bottom_con {
                    display: flex;
                    justify-content: space-between;

                    p {

                        font-size: 16px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: #333333;
                    }

                    a {
                        cursor: pointer;
                        font-size: 12px;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        color: $colorMain;
                    }
                }
            }
        }
    }



    .sld_chat {
        background: #565656;
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        // padding-top: 3%;

        .chat_wrap {
            width: 1210px;
            background: #FFFFFF;
            border-radius: 6px;
            margin: 0 auto;

            .chat_top {
                display: flex;

                .head_user {
                    display: flex;
                    width: 233px;
                    height: 74px;
                    background: linear-gradient(135deg, #FC1C1C 0%, #FF560B 100%);
                    box-shadow: 0px 2px 24px 3px rgba(255, 80, 52, 0.1);
                    border-top-left-radius: 6px;
                    z-index: 0;

                    .user_avatar {
                        display: flex;
                        align-items: center;
                        z-index: 99;
                        margin-left: 10px;
                        margin-right: 11px;

                        .img_bg {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 50px;
                            height: 50px;
                            background: #FFFFFD;
                            border-radius: 50%;
                        }

                        img {
                            width: 42px;
                            height: 42px;
                            background: #FFFFFF;
                            border-radius: 50%;
                        }
                    }

                    .user_info {
                        padding: 10px 0;
                        display: flex;
                        justify-content: center;
                        flex-direction: column;

                        .user_name {
                            width: 150px;
                            font-size: 18px;
                            font-family: Microsoft YaHei;
                            font-weight: bold;
                            color: #FFFFFF;
                        }

                        .on_offLine {
                            font-size: 12px;
                            font-family: Microsoft YaHei;
                            font-weight: 400;
                            color: #FFFFFF;
                            margin-top: 10px;
                        }
                    }
                }

                .head_store {
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #F3F3F3;
                    width: 977px;

                    img {
                        margin-left: 21px;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                    }

                    .store_title {
                        margin-left: 9px;
                        font-size: 16px;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        color: #333333;
                    }

                }
            }

            .chat_below {
                display: flex;

                .chat_zone {
                    width: 640px;
                    height: 100%;

                    .chat_window {
                        height: 530px;
                        background: #F7F7F7;
                        padding-left: 15px;
                        overflow: auto;

                        .time_line {
                            margin: 12px auto;
                            line-height: 22px;
                            text-align: center;
                            font-size: 12px;
                            font-family: Microsoft YaHei;
                            font-weight: 400;
                            color: #999999;
                            width: 149px;
                            height: 22px;
                            background: #EEEEEE;
                            border-radius: 11px;
                        }

                        .chat_ladder {
                            margin-top: 20px;
                            margin-bottom: 15px;
                            display: flex;
                            align-items: flex-start;

                            &>img {
                                width: 38px;
                                height: 38px;
                                border-radius: 50%;

                                &.user_avatar {
                                    margin-left: 10px;
                                }
                            }

                            .content_right {
                                margin-left: 10px;

                                p {

                                    font-size: 12px;
                                    font-family: Microsoft YaHei;
                                    font-weight: 400;
                                    color: #999999;
                                    margin-bottom: 5px;
                                }

                                .content_text {
                                    display: inline-block;
                                    padding: 11px;
                                    box-shadow: 0px 2px 9px 1px rgba(86, 86, 86, 0.07);
                                }

                                .order_type {
                                    max-width: 450px;
                                    background: #fff;

                                    .goods_info {
                                        min-width: 300px;

                                        .goods_info_title {

                                            font-size: 14px;
                                            font-family: Microsoft YaHei;
                                            font-weight: 400;
                                            color: #333333;
                                        }
                                    }

                                    .order_title {
                                        display: flex;
                                        height: 20px;
                                        justify-content: space-between;
                                        align-items: flex-start;
                                        border-bottom: 1px solid #F2F2F2;
                                        margin-bottom: 8px;

                                        .order_sn {
                                            font-size: 12px;
                                            color: #999999;
                                            font-family: Microsoft YaHei;

                                            i {
                                                font-style: normal;
                                                color: #666666;
                                            }
                                        }

                                        .order_time {
                                            color: #999999;
                                        }
                                    }
                                }

                                .goods_type {
                                    min-width: 300px;
                                    background: #fff;
                                }

                                .image_type {
                                    img {
                                        max-width: 200px;
                                    }

                                    min-height:130px;
                                }

                                .text_type {
                                    max-width: 360px;
                                    word-break: break-all;
                                }
                            }



                        }

                        .merchant {
                            justify-content: flex-start;

                            .content_text {
                                background: #FFFFFF;
                                border-bottom-left-radius: 7px;
                                border-top-right-radius: 7px;
                            }
                        }

                        .user {
                            justify-content: flex-end;
                            margin-right: 15px;


                            p {
                                text-align: right;
                            }

                            .text_type {
                                color: #fff;
                                background: linear-gradient(128deg, #FF3D31 0%, #FE5234 100%);
                                border-bottom-right-radius: 7px;
                                border-top-left-radius: 7px;
                            }

                            .content_right {
                                display: flex;
                                flex-direction: column;
                                align-items: flex-end;
                            }


                        }
                    }

                    .chat_input {
                        .bar {
                            padding: 16px;

                            a,
                            label {
                                margin-right: 13px;
                            }

                            #image {
                                display: none;
                            }
                        }

                        .input_area {
                            textarea {
                                max-height: 73px;
                                outline: none;
                                border: none;
                            }
                        }

                        .send {
                            margin-top: 3px;
                            display: flex;
                            justify-content: flex-end;

                            button {
                                margin-right: 21px;
                                width: 80px;
                                height: 30px;
                                border: none;
                                border-radius: 6px;
                                background-color: #fff;
                                transition: .2s all;
                                color: #fff;
                                background: linear-gradient(128deg, #FF3D31 0%, #FE5234 100%);
                            }
                        }
                    }
                }
            }
        }



    }

    .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .goods_model {
        display: flex;

        &>img {
            width: 84px;
            height: 84px;
            background: #707070;
            border-radius: 6px;
        }

        .goods_info {
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            max-width: 300px;

            .goods_info_title {
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #333333;
                line-height: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                padding-right: 10px;
                word-break: break-all;
            }

            .goods_info_bottom {
                display: flex;
                justify-content: space-between;

                span:first-child {
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #e2231a;
                }

                span:nth-child(2) {
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #e2231a;
                }
            }
        }
    }

    .pop_header {
        height: 38px;
        background: #F3F3F4;
        display: flex;
        justify-content: space-between;

        p {
            margin-left: 10px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333333;
            line-height: 38px;
        }

        i {
            font-size: 16px;
            margin-right: 10px;
        }
    }

    .pop_list {
        margin-top: 5px;
        height: 300px;

        .pop_item {
            margin-left: 10px;
            padding: 12px 0px;
            border-bottom: 1px solid #e7e7e7;
            width: 97%;

            &:hover {
                background: #F8F8F8;
            }
        }
    }
</style>