<template>
    <div class="sld_diy">
        <div v-for="(item,index) in decorateData.data" v-bind:key="index">
            <el-carousel v-if="item.json_data&&item.json_data.type =='main_banner'" height="457px" arrow="never">
                <el-carousel-item v-for="(item_banner,index_banner) in item.json_data.data" :key="index_banner">
                    <a href="javascript:void(0)" @click="diyNavTo(item_banner)">
                        <!-- <img v-bind:src="item_banner.imgUrl" /> -->
                        <div :style="`background-image:url(${item_banner.imgUrl})`"></div>
                    </a>
                </el-carousel-item>
            </el-carousel>

            <!-- adv_01 start-->
            <div class="adv_01_wrap" v-if="item.json_data&&item.json_data.type =='adv_01'"
                :class="{adv_01_wrap_full:item.json_data.full_screen&&item.json_data.full_screen==1}" :style="{height:item.json_data.data.height+'px',paddingTop:item.json_data.padding_top+'px',
                         paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <a href="javascript:void(0)" @click="diyNavTo(item.json_data.data)">
                    <img class="adv_01_img" v-bind:src="item.json_data.data.imgUrl" />
                </a>
            </div>
            <!-- adv_01 end-->

            <!-- adv_02 start-->
            <div class="adv_02_part" v-if="item.json_data&&item.json_data.type =='adv_02'"
                :style="{height:((item.json_data.padding_top?item.json_data.padding_top:0)+(item.json_data.padding_bottom?item.json_data.padding_bottom:0)+344)+'px',
                    paddingTop:item.json_data.padding_top+'px',paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <div class="adv_02_left" @click="diyNavTo(item.json_data.left.data)">
                    <a href="javascript:void(0)" v-if="item.json_data.left.data.imgUrl!=undefined">
                        <img v-bind:src="item.json_data.left.data.imgUrl" />
                    </a>
                </div>
                <div class="adv_02_center">
                    <span class="split_h"></span>
                    <div class="goods_item clearfix"
                        v-for="(item_center,index_center) in item.json_data.center.data.goods_data"
                        v-bind:key="index_center" @click="goGoodsDetail(item_center)">
                        <a target="_blank" href="javascript:void(0)">
                            <div class="left">
                                <img v-bind:src="item_center.mainImage" />
                            </div>
                            <div class="right">
                                <p class="goods_name">{{item_center.goodsName}}</p>
                                <p class="buy_num">{{item_center.actualSales*1+item_center.virtualSales*1}}{{L['人购买']}}
                                </p>
                                <div class="price">
                                    <span class="unit">&yen;</span>
                                    <span class="integer">{{item_center.goodsPrice}}</span>
                                </div>
                                <a class="buy" href="javascript:void(0)">{{L['立即抢购']}}</a>
                            </div>
                        </a>
                    </div>
                    <span class="split_v"></span>
                </div>
                <div class="adv_02_right">
                    <span class="right_img_item" v-for="(item_right,index_right) in item.json_data.right.data"
                        v-bind:key="index_right" @click="diyNavTo(item_right)">
                        <a href="javascript:void(0)">
                            <img v-bind:src="item_right.imgUrl" />
                        </a>
                    </span>
                </div>
            </div>
            <!-- adv_02 end-->

            <!-- adv_04 start-->
            <div class="w_sld_react_1210 adv_04_wrap" v-if="item.json_data&&item.json_data.type =='adv_04'"
                :style="{paddingTop:item.json_data.padding_top+'px',paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <div class="floor_title">
                    <h2>
                        <font v-bind:style="{backgroundColor:item.json_data.title_info.title_color}">&nbsp;</font>
                        <span
                            v-bind:style="{color:item.json_data.title_info.title_color}">{{item.json_data.title_info.title_name}}</span>
                        <font v-bind:style="{backgroundColor:item.json_data.title_info.title_color}">&nbsp;</font>
                    </h2>
                </div>
                <div class="floor_goods">
                    <div class="item" v-for="(item_main,index_main) in item.json_data.data.goods_data"
                        v-bind:key="index_main">
                        <div class="wrap" @click="goGoodsDetail(item_main)">
                            <a href="javascript:void(0)" class="example_text">
                                <img v-bind:src="item_main.mainImage" />
                            </a>
                            <p class="title">
                                <a href="javascript:void(0)" title>{{item_main.goodsName}}</a>
                            </p>
                            <p class="price">
                                <span>
                                    ¥
                                    <span class="money_number">{{item_main.goodsPrice||0.00}}</span>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- adv_04 end-->

            <!-- adv_05 start-->
            <div class="w_sld_react_1210 adv_05_wrap" v-if="item.json_data&&item.json_data.type =='adv_05'"
                :style="{paddingTop:item.json_data.padding_top+'px',paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <div class="floor">
                    <div class="floor_layout">
                        <div>
                            <div class="floor_title">
                                <h2>
                                    <span class="main_title">{{item.json_data.title_info.title.initialValue}}</span>
                                    <span
                                        class="sub_title">{{item.json_data.title_info&&item.json_data.title_info.sub_title.initialValue}}</span>
                                </h2>
                                <div class="right_action" v-if="item.json_data.title_info.link_type">
                                    <a @click="diyNavTo(item.json_data.title_info)">
                                        {{L['查看更多']}}
                                        <i>&gt;&gt;</i>
                                    </a>
                                </div>
                            </div>

                            <div class="floor_content">
                                <div class="floor_left">
                                    <div class="floor_bg_img">
                                        <a class="ad_img example_text" href="javascript:void(0)"
                                            @click="diyNavTo(item.json_data.left.data)">
                                            <img v-bind:src="item.json_data.left.data.imgUrl" />
                                        </a>
                                    </div>
                                    <div class="floor_words">
                                        <div class="floor_words_top_title">
                                            <font></font>
                                            <span>{{item.json_data.left.cat_data.title_info.title_name}}</span>
                                            <font></font>
                                        </div>
                                        <ul>
                                            <li v-for="(item_left_cat,index_left_cat) in item.json_data.left.cat_data.cat_datas"
                                                v-bind:key="index_left_cat">
                                                <a href="javascript:void(0)" :title="item_left_cat.categoryName"
                                                    @click="goGoodsListByCatId(item_left_cat.categoryId)">{{item_left_cat.categoryName}}</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="floor_right" style="border-color: rgb(252, 88, 99);">
                                    <div class="floor_right_main">
                                        <div class="floor_content">
                                            <div class="big_item item"
                                                v-if="item.json_data.center.data.goods_data.length">
                                                <div class="wrap"
                                                    @click="goGoodsDetail(item.json_data.center.data.goods_data[0])">
                                                    <div class="left_pic">
                                                        <a href="javascript:void(0)" class="ad_img example_text">
                                                            <img v-bind:src="item.json_data.center.data.goods_data[0].mainImage"
                                                                alt="item.json_data.center.data.goods_data[0].goodsName" />
                                                        </a>
                                                    </div>
                                                    <div class="right_info">
                                                        <p class="title">
                                                            <a href="javascript:void(0)"
                                                                :title="item.json_data.center.data.goods_data[0].goodsName">{{item.json_data.center.data.goods_data[0].goodsName}}</a>
                                                        </p>
                                                        <p class="price">
                                                            ¥
                                                            <span
                                                                class="money_number">{{item.json_data.center.data.goods_data[0].goodsPrice}}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="item" v-if="item.json_data.center.data.goods_data.length>1">
                                                <div class="wrap"
                                                    @click="goGoodsDetail(item.json_data.center.data.goods_data[1])">
                                                    <a class="ad_img" href="javascript:void(0)">
                                                        <img v-bind:src="item.json_data.center.data.goods_data[1].mainImage"
                                                            alt="item.json_data.center.data.goods_data[1].goodsName" />
                                                    </a>
                                                    <p class="title">
                                                        <a href="javascript:void(0)"
                                                            :title="item.json_data.center.data.goods_data[1].goodsName">{{item.json_data.center.data.goods_data[1].goodsName}}</a>
                                                    </p>
                                                    <p class="price">
                                                        ¥
                                                        <span
                                                            class="money_number">{{item.json_data.center.data.goods_data[1].goodsPrice}}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <template
                                                v-for="(item_center_bottom,index_center_bottom) in item.json_data.center.data.goods_data">
                                                <div class="item bottom_item" :key="index_center_bottom"
                                                    v-if="index_center_bottom > 1"
                                                    @click="goGoodsDetail(item_center_bottom)">
                                                    <div class="wrap">
                                                        <a href="javascript:void(0)" class="ad_img example_text">
                                                            <img v-bind:src="item_center_bottom.mainImage"
                                                                alt="item_center_bottom.goodsName" />
                                                        </a>
                                                        <p class="title">
                                                            <a href="javascript:void(0)"
                                                                :title="item_center_bottom.goodsName">{{item_center_bottom.goodsName}}</a>
                                                        </p>
                                                        <p class="price">
                                                            ¥
                                                            <span
                                                                class="money_number">{{item_center_bottom.goodsPrice}}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                    <div class="floor_right_new">
                                        <div class="floor_right_new_top_title">
                                            <font style="background: #fc585a"></font>
                                            <span
                                                style="color: #fc585a">{{item.json_data.right.title_info.title_name}}</span>
                                            <font style="background: #fc585a"></font>
                                        </div>
                                        <div class="floor_content">
                                            <div class="item"
                                                v-for="(item_right_goods,index_right_goods) in item.json_data.right.data.goods_data"
                                                v-bind:key="index_right_goods">
                                                <div class="wrap" @click="goGoodsDetail(item_right_goods)">
                                                    <div class="left_pic">
                                                        <a href="javascript:void(0)" class="ad_img example_text">
                                                            <img v-bind:src="item_right_goods.mainImage"
                                                                alt="item_right_goods.goodsName" />
                                                        </a>
                                                    </div>
                                                    <div class="right_info">
                                                        <p class="title">
                                                            <a href="javascript:void(0)"
                                                                :title="item_right_goods.goodsName">{{item_right_goods.goodsName}}</a>
                                                        </p>
                                                        <p class="price">
                                                            ¥
                                                            <span
                                                                class="money_number">{{item_right_goods.goodsPrice}}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- adv_05 end-->

            <!-- adv_06 start-->
            <div v-if="item.json_data&&item.json_data.type =='adv_06'" class="adv_06 com_1210_center"
                :style="{paddingTop:item.json_data.padding_top+'px',paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <div class="adv_06_wrap">
                    <div class="item" v-for="(item_child,index_child) in item.json_data.data" v-bind:key="index_child">
                        <a href="javascript:void(0)" @click="diyNavTo(item_child)">
                            <img v-bind:src="item_child.imgUrl" />
                        </a>
                    </div>
                </div>
            </div>
            <!-- adv_06 end-->

            <!-- adv_07 start-->
            <div class="w_sld_react_1210 adv_07" v-if="item.json_data&&item.json_data.type =='adv_07'"
                :style="{paddingTop:item.json_data.padding_top+'px',paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <div class=" adv_07_wrap">
                    <div class="item" v-for="(item_child,index_child) in item.json_data.data" :key="index_child">
                        <a href="javascript:void(0);" @click="diyNavTo(item_child)" v-if="item_child.imgUrl">
                            <img :src="item_child.imgUrl">
                        </a>
                        <a class="show_tip" href="javascript:void(0);" v-else>
                            <span>此处添加【403*高度不限】图片</span>
                        </a>
                    </div>
                </div>
            </div>
            <!-- adv_07 end-->

            <!-- adv_08 start-->
            <div class="w_sld_react_1210 adv_08 com_1210_center" v-if="item.json_data&&item.json_data.type =='adv_08'"
                :style="{paddingTop:item.json_data.padding_top+'px',paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <div class="adv_08_wrap">
                    <div class="item" v-for="(item_main,index_main) in item.json_data.data" v-bind:key="index_main"
                        @click="diyNavTo(item_main)">
                        <a href="javascript:void(0)">
                            <img v-bind:src="item_main.imgUrl" />
                        </a>
                    </div>
                </div>
            </div>
            <!-- adv_08 end-->

            <!-- adv_09 start-->
            <div class="adv_09 com_1210_center" v-if="item.json_data&&item.json_data.type =='adv_09'"
                :style="{paddingTop:item.json_data.padding_top+'px',paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <div class="adv_09_wrap">
                    <div class="item left">
                        <div class="top_title"
                            v-bind:style="{backgroundColor:item.json_data.left.title_info.title_bg_color,color:item.json_data.left.title_info.title_color}">
                            {{item.json_data.left.title_info.title_name}}
                        </div>

                        <div class="main_con">
                            <a class="first show_tip" href v-for="(item_left,index_left) in item.json_data.left.data"
                                v-bind:key="index_left" @click="diyNavTo(item_left)">
                                <img v-bind:src="item_left.imgUrl" />
                            </a>
                        </div>
                    </div>
                    <div class="item center">
                        <div class="top_title"
                            v-bind:style="{backgroundColor:item.json_data.center.title_info.title_bg_color,color:item.json_data.center.title_info.title_color}">
                            {{item.json_data.center.title_info.title_name}}
                        </div>
                        <div class="main_con">
                            <a class="show_tip" href v-for="(item_center,index_center) in item.json_data.center.data"
                                v-bind:key="index_center" @click="diyNavTo(item_center)">
                                <img v-bind:src="item_center.imgUrl" />
                            </a>
                        </div>
                    </div>
                    <div class="item right">
                        <div class="top_title"
                            v-bind:style="{backgroundColor:item.json_data.right.title_info.title_bg_color,color:item.json_data.right.title_info.title_color}">
                            {{item.json_data.right.title_info.title_name}}
                        </div>
                        <div class="main_con">
                            <a class="show_tip" href v-for="(item_right,index_right) in item.json_data.right.data"
                                v-bind:key="index_right" @click="diyNavTo(item_right)">
                                <img v-bind:src="item_right.imgUrl" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- adv_09 end-->

            <!-- adv_10 start-->
            <div class="adv_10 com_1210_center" v-if="item.json_data&&item.json_data.type =='adv_10'"
                :style="{paddingTop:item.json_data.padding_top+'px',paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <div class="adv_10_wrap">
                    <div class="row_one" v-for="(item_one,index_one) in item.json_data.row_one.data"
                        v-bind:key="index_one">
                        <a href="javascript:void(0)" @click="diyNavTo(item_one)">
                            <img v-bind:src="item_one.imgUrl" />
                        </a>
                    </div>
                    <div class="row_four">
                        <a href="javascript:void(0)" v-for="(item_four,index_four) in item.json_data.row_four.data"
                            v-bind:key="index_four" @click="diyNavTo(item_four)">
                            <img v-bind:src="item_four.imgUrl" />
                        </a>
                    </div>
                    <div class="row_five">
                        <a href="javascript:void(0)" v-for="(item_five,index_five) in item.json_data.row_five.data"
                            v-bind:key="index_five" @click="diyNavTo(item_five)">
                            <img v-bind:src="item_five.imgUrl" />
                        </a>
                    </div>
                </div>
            </div>
            <!-- adv_10 end-->

            <!-- adv_11 start-->
            <div class="adv_11 com_1210_center" v-if="item.json_data&&item.json_data.type =='adv_11'"
                :style="{paddingTop:item.json_data.padding_top+'px',paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <div class="adv_11_wrap">
                    <div class="item row_left">
                        <a href="javascript:void(0)" v-for="(item_left,index_left) in item.json_data.row_left.data"
                            v-bind:key="index_left" v-bind:class="{ lb_margin:  index_left%2==1}"
                            @click="diyNavTo(item_left)">
                            <img v-bind:src="item_left.imgUrl" />
                        </a>
                    </div>
                    <div class="item row_right">
                        <div class="top">
                            <a href="javascript:void(0)" v-if="item.json_data.row_right.top.data[0] !=undefined"
                                @click="diyNavTo(item.json_data.row_right.top.data[0])">
                                <img v-bind:src="item.json_data.row_right.top.data[0].imgUrl" />
                            </a>
                        </div>
                        <div class="bottom">
                            <a href="javascript:void(0)" v-if="item.json_data.row_right.bottom.data[0] !=undefined"
                                @click="diyNavTo(item.json_data.row_right.bottom.data[0])">
                                <img v-bind:src="item.json_data.row_right.bottom.data[0].imgUrl" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- adv_11 end-->

            <!-- adv_12 start-->
            <div class="adv_12 com_1210_center" v-if="item.json_data&&item.json_data.type =='adv_12'"
                :style="{paddingTop:item.json_data.padding_top+'px',paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <div class="adv_12_wrap">
                    <div class="item left clear_padding">
                        <a class="l_img" href="javascript:void(0)" @click="diyNavTo(item.json_data.left.data[0])">
                            <img v-bind:src="item.json_data.left.data[0].imgUrl" />
                        </a>
                    </div>
                    <div class="item center">
                        <a v-for="(item_center,index_center) in item.json_data.center.data" v-bind:key="index_center"
                            v-bind:class="{ l_b_margin:  index_center%2==1}" @click="diyNavTo(item_center)">
                            <img v-bind:src="item_center.imgUrl" />
                        </a>
                    </div>
                    <div class="item right">
                        <div class="title_wrap" @click="diyNavTo(item.json_data.right.title_info)">
                            <a class="title"
                                href="javascript:void(0)">{{item.json_data.right.title_info.title.initialValue}}</a>
                            <span> 》</span>
                            <a href="javascript:void(0)"
                                class="subtitle">{{item.json_data.right.title_info.sub_title.initialValue}}</a>
                        </div>
                        <div class="img_top">
                            <a href="javascript:void(0)" @click="diyNavTo(item.json_data.right.top.data[0])">
                                <img v-bind:src="item.json_data.right.top.data[0].imgUrl" />
                            </a>
                        </div>
                        <div class="img_bottom">
                            <a class="l_img" href="javascript:void(0)"
                                v-for="(item_right_bottom,index_right_bottom) in item.json_data.right.bottom.data"
                                v-bind:key="index_right_bottom" @click="diyNavTo(item_right_bottom)">
                                <img v-bind:src="item_right_bottom.imgUrl" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- adv_12 end-->

            <!-- adv_13 start-->
            <div class="w_sld_react_1210 adv_13 com_1210_center" v-if="item.json_data&&item.json_data.type =='adv_13'"
                :style="{paddingTop:item.json_data.padding_top+'px',paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <div class="adv_13_wrap">
                    <div class="item right" @click="diyNavTo(item.json_data.left.title_info)">
                        <div class="title_wrap">
                            <a class="title"
                                href="javascript:void(0)">{{item.json_data.left.title_info.title.initialValue}}</a>
                            <span> 》</span>
                            <a class="subtitle"
                                href="javascript:void(0)">{{item.json_data.left.title_info.sub_title.initialValue}}</a>
                        </div>
                        <div class="img_top">
                            <a class href="javascript:void(0)" @click="diyNavTo(item.json_data.left.top.data[0])">
                                <img v-bind:src="item.json_data.left.top.data[0].imgUrl" />
                            </a>
                        </div>
                        <div class="img_bottom">
                            <a class href="javascript:void(0)"
                                v-for="(item_left_bottom,index_left_bottom) in item.json_data.left.bottom.data"
                                v-bind:key="index_left_bottom" v-bind:class="{ l_b_margin:  index_left_bottom%2==0}"
                                @click="diyNavTo(item_left_bottom)">
                                <img v-bind:src="item_left_bottom.imgUrl" />
                            </a>
                        </div>
                    </div>
                    <div class="item right">
                        <div class="title_wrap" @click="diyNavTo(item.json_data.center.title_info)">
                            <a class="title"
                                href="javascript:void(0)">{{item.json_data.center.title_info.title.initialValue}}</a>
                            <span> 》</span>
                            <a class="subtitle"
                                href="javascript:void(0)">{{item.json_data.center.title_info.sub_title.initialValue}}</a>
                        </div>
                        <div class="img_top">
                            <a href="javascript:void(0)" @click="diyNavTo(item.json_data.center.top.data[0])">
                                <img v-bind:src="item.json_data.center.top.data[0].imgUrl" />
                            </a>
                        </div>
                        <div class="img_bottom">
                            <a class="l_img" href="javascript:void(0)"
                                v-for="(item_center_bottom,index_center_bottom) in item.json_data.center.bottom.data"
                                v-bind:key="index_center_bottom" @click="diyNavTo(item_center_bottom)">
                                <img v-bind:src="item_center_bottom.imgUrl" />
                            </a>
                        </div>
                    </div>
                    <div class="item left clear_padding">
                        <a class="l_img" href="javascript:void(0)" @click="diyNavTo(item.json_data.right.data[0])">
                            <img :src="item.json_data.right.data[0].imgUrl" />
                        </a>
                    </div>
                </div>
            </div>
            <!-- adv_13 end-->

            <!-- adv_19 start-->
            <div class="w_sld_react_1210 adv_19" v-if="item.json_data&&item.json_data.type =='adv_19'"
                :style="{paddingTop:item.json_data.padding_top+'px',paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <div class="adv_19_wrap">
                    <div v-for="(items,index) in item.json_data.data" :key="index" class="item left">
                        <div class="top_title" :style="{backgroundColor: items.top.title_info.title_bg_color}">
                            <div class="l_title" :style="{color: items.top.title_info.title_color}">
                                {{items.top.title_info.title_name ? items.top.title_info.title_name: '添加标题'}}
                            </div>
                            <div class="r_title">
                                <ul>
                                    <li v-for="(val,key) in items.center.right" :key="key"
                                        :class="{sel_tab:key==items.cur_tab}"
                                        @mouseover="adv19Tab(item.dataId,index,key,items)">
                                        <span class="con">
                                            {{val.title_info.title_name? val.title_info.title_name: '添加内容'}}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="center">
                            <div class="l_center">
                                <a href="javascript:;" @click="diyNavTo(items.center.left.data[0])">
                                    <img v-if="items.center.left.data[0].imgUrl"
                                        :src="items.center.left.data[0].imgUrl" />
                                    <span v-else>此处添加【186*340】图片</span>
                                </a>
                            </div>
                            <div class="r_center">
                                <div class="tabs_panel">
                                    <div v-for="(val,key) in items.center.right[items.cur_tab].data" :key="key"
                                        class="item">
                                        <div class="title_wrap">
                                            <a class="main_title" href="javascript:;" @click="diyNavTo(val)">
                                                {{val.main_title ? val.main_title : '图片标题'}}
                                            </a>
                                            <a class="sub_title" href="javascript:;" @click="diyNavTo(val)">
                                                {{val.sub_title ? val.sub_title : '图片子标题'}}
                                            </a>
                                        </div>

                                        <div class="bottom_img">
                                            <a class="sld_com_no_img" href="javascript:;" @click="diyNavTo(val)">
                                                <img v-if="val.imgUrl" :src="val.imgUrl" />
                                                <span v-else>此处添加【172*106】图片</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bottom">
                            <a v-for="(val,key) in items.bottom.data" :key="key" class="sld_com_no_img"
                                href="javascript:;" @click="diyNavTo(val)">
                                <img v-if="val.imgUrl" :src="val.imgUrl" />
                                <span v-else>此处添加【187*120】图片</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- adv_19 end-->

            <!-- adv_20 start-->
            <div class="w_sld_react_1210 adv_20" v-if="item.json_data&&item.json_data.type =='adv_20'"
                :style="{paddingTop:item.json_data.padding_top+'px',paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <div class="adv_20_wrap flex_column_start_center">
                    <div class="flex_row_around_center adv_20_wrap_row" v-for="(val,key) in item.json_data.data"
                        :key="key">
                        <div v-for="(child,child_key) in val" :key="child_key"
                            class="flex_column_center_center adv_20_wrap_item">
                            <div class="flex_row_center_center  adv_20_wrap_item_img" style="border-radius: 0px;"
                                @click="diyNavTo(child)">
                                <img :src="child.imgUrl" />
                            </div>
                            <span class="main_title" @click="diyNavTo(child)">{{child.main_title}}</span>
                            <span class="sub_title" @click="diyNavTo(child)">{{child.sub_title}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- adv_20 end-->

            <!-- adv_21 start-->
            <div class="w_sld_react_1210 adv_21" v-if="item.json_data&&item.json_data.type =='adv_21'"
                :style="{paddingTop:item.json_data.padding_top+'px',paddingBottom:item.json_data.padding_bottom+'px',backgroundColor:item.json_data.bg_color}">
                <div class="adv_21_wrap flex_row_start_start">
                    <div class="flex_column_start_start adv_21_wrap_item" v-for="(val1,key1) in item.json_data.data"
                        :key="key1">
                        <div class="flex_row_between_center title_part" @click="diyNavTo(val1.top_title)">
                            <span class="title">{{val1.top_title.title.initialValue}}</span>
                            <a class="view_more">{{val1.top_title.sub_title.initialValue}}&gt;</a>
                        </div>
                        <div class="flex_column_start_start detail">

                            <div class="flex_row_start_start item" v-for="(val2,key2) in val1.detail" :key="key2">
                                <div class="item_left" @click="diyNavTo(val2.left)">
                                    {{val2.left.title.initialValue}}
                                </div>
                                <div class="flex_row_start_center item_right">
                                    <span class="item_right_con" v-for="(val3,key3) in val2.right" :key="key3"
                                        @click="diyNavTo(val3)">
                                        {{val3.title.initialValue}}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- adv_21 end-->
        </div>
    </div>
</template>
<script>
    import { getCurrentInstance } from 'vue'
    import { useRoute } from 'vue-router'
    export default {
        name: "SldDiy",
        props: {
            decorateData: Object,//装修的数据
            source: String,//来源，home:平台首页  store:店铺装修
        },
        setup(props, { emit }) {
            const route = useRoute()
            const { proxy } = getCurrentInstance();
            const L = proxy.$getCurLanguage();
            const diyNavTo = (val) => {
                if (route.query.vid) {
                    val.storeId = route.query.vid
                }
                proxy.$diyNavTo(val)
            }
            const goGoodsDetail = (val) => {
                proxy.$goGoodsDetail(val.productId)
            }
            const goGoodsListByCatId = (val) => {
                proxy.$goGoodsListByCatId(val)
            }
            //adv_19楼层tab切换事件
            const adv19Tab = (dataId, index, key, items) => {
                items.cur_tab = key

                // emit("adv19", { dataId: dataId, left_or_right_index: index, tab_index: key });
            }
            return { L, goGoodsDetail, diyNavTo, adv19Tab, goGoodsListByCatId };
        },
    };
</script>
<style lang="scss" scoped>
    @import "../style/mixins.scss";
    @import "../style/decorate.scss";

    .sld_diy {
        .el-carousel {
            width: 100%;
            margin: 0 auto;
        }

        background: #f8f8f8;

        .el-carousel__item {
            /* width: 1920px;
            /*图片宽度*/
            /* position: absolute;
            left: 50%;
            margin-left: -960px; */
            /* 图片宽度的一半 */
            display: flex;
            justify-content: center;
            align-items: center;

            div {
                background-position: center center;
                width: 1920px;
                height: 457px;
                position: absolute;
                left: 50%;
                top: 0;
                margin-left: -960px;
                background-repeat: no-repeat;
                background-size: contain;
            }
        }

        .main_banner {
            width: 100%;
            height: 457px;
            position: relative;
            overflow: hidden;
            margin: 0 auto;

            .nav-menu {
                position: absolute;
                left: 50%;
                margin-left: -600px;
                top: -3px;
                width: 187px;
                height: 457px;
                z-index: 9;
                background-color: rgba(0, 0, 0, 0.6);
                -webkit-box-sizing: border-box;
                box-sizing: border-box;

                .menu-wrap {
                    .menu-item {
                        height: 39px;
                        line-height: 39px;
                        margin: 5px 0;
                        position: relative;

                        .first_cat {
                            width: 125px;
                            display: block;
                            font-size: 16px;
                            color: #ffffff;
                            padding-left: 30px;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            position: relative;

                            .nav-menu {
                                position: absolute;
                                left: 50%;
                                margin-left: -600px;
                                top: -3px;
                                width: 187px;
                                height: 457px;
                                z-index: 9;
                                background-color: rgba(0, 0, 0, 0.6);
                                -webkit-box-sizing: border-box;
                                box-sizing: border-box;

                                .menu-wrap {
                                    .menu-item {
                                        height: 39px;
                                        line-height: 39px;
                                        margin: 5px 0;

                                        .first_cat {
                                            width: 125px;
                                            display: block;
                                            font-size: 16px;
                                            color: #ffffff;
                                            padding-left: 30px;
                                            text-overflow: ellipsis;
                                            overflow: hidden;
                                            white-space: nowrap;
                                            position: relative;

                                            &:after {
                                                position: absolute;
                                                right: 0px;
                                                top: 12.5px;
                                                content: " ";
                                                width: 7px !important;
                                                height: 14px !important;
                                                @include bgImg(7px, 14px, "/imgs/arrow_right.png");
                                            }
                                        }

                                        &:hover {
                                            background-color: $colorMain;

                                            .children {
                                                display: inline-block;
                                            }
                                        }

                                        .children {
                                            display: none;
                                            width: 1013px;
                                            height: 417px;
                                            background-color: #fff;
                                            position: absolute;
                                            top: 0;
                                            left: 187px;
                                            padding: 20px 0;

                                            .fore-dl {
                                                width: 100%;
                                                clear: both;
                                                overflow: hidden;
                                            }

                                            dt {
                                                position: relative;
                                                float: left;
                                                width: 152px;
                                                padding: 8px 30px 0 0;
                                                text-align: right;
                                                font-weight: 700;
                                                line-height: 2em;
                                                overflow: hidden;
                                                white-space: nowrap;

                                                i {
                                                    position: absolute;
                                                    top: 11px;
                                                    right: 18px;
                                                    width: 4px;
                                                    height: 14px;
                                                    font: 400 9px/14px consolas;
                                                }

                                                .second {
                                                    color: #333;
                                                    font-size: 14px;
                                                    width: 140px;
                                                    overflow: hidden;
                                                    display: inline-block;
                                                    line-height: 18px;
                                                    text-overflow: ellipsis;
                                                }
                                            }

                                            dd {
                                                border-top: none;
                                                border-bottom: 1px dashed #dddddd;
                                                width: 790px;
                                                padding: 6px 0;
                                                float: left;
                                                line-height: 16px;
                                                margin-left: 15px;
                                            }

                                            .third {
                                                float: left;
                                                padding: 0 8px;
                                                margin: 4px 0;
                                                line-height: 16px;
                                                height: 16px;
                                                border-right: 1px solid #e0e0e0;
                                                white-space: nowrap;
                                                color: #999;
                                                font-size: 13px;
                                            }

                                            .children_item {
                                                display: flex;
                                                flex-direction: row;
                                                justify-content: flex-start;
                                                align-items: flex-start;
                                                flex-wrap: wrap;
                                                height: 30px;

                                                .li_wrap {
                                                    height: 30px;
                                                    line-height: 30px;
                                                    flex: 1;
                                                    padding-left: 23px;

                                                    a {
                                                        line-height: 30px;
                                                        height: 30px;
                                                        color: #999999;
                                                    }
                                                }

                                                a {
                                                    color: $colorMain;
                                                    font-size: 14px;
                                                }

                                                img {
                                                    width: 42px;
                                                    height: 35px;
                                                    vertical-align: middle;
                                                    margin-right: 15px;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        &:hover {
                            background-color: $colorMain;

                            .children {
                                display: inline-block;
                            }
                        }

                        .children {
                            display: none;
                            width: 1013px;
                            height: 417px;
                            background-color: #fff;
                            position: absolute;
                            top: 0;
                            left: 187px;
                            padding: 20px 0;

                            .fore-dl {
                                width: 100%;
                                clear: both;
                                overflow: hidden;
                            }

                            dt {
                                position: relative;
                                float: left;
                                width: 152px;
                                padding: 8px 30px 0 0;
                                text-align: right;
                                font-weight: 700;
                                line-height: 2em;
                                overflow: hidden;
                                white-space: nowrap;

                                i {
                                    position: absolute;
                                    top: 11px;
                                    right: 18px;
                                    width: 4px;
                                    height: 14px;
                                    font: 400 9px/14px consolas;
                                }

                                .second {
                                    color: #333;
                                    font-size: 14px;
                                    width: 140px;
                                    overflow: hidden;
                                    display: inline-block;
                                    line-height: 18px;
                                    text-overflow: ellipsis;
                                }
                            }

                            dd {
                                border-top: none;
                                border-bottom: 1px dashed #dddddd;
                                width: 790px;
                                padding: 6px 0;
                                float: left;
                                line-height: 16px;
                                margin-left: 15px;
                            }

                            .third {
                                float: left;
                                padding: 0 8px;
                                margin: 4px 0;
                                line-height: 16px;
                                height: 16px;
                                border-right: 1px solid #e0e0e0;
                                white-space: nowrap;
                                color: #999;
                                font-size: 13px;
                            }

                            .children_item {
                                display: flex;
                                flex-direction: row;
                                justify-content: flex-start;
                                align-items: flex-start;
                                flex-wrap: wrap;
                                height: 30px;

                                .li_wrap {
                                    height: 30px;
                                    line-height: 30px;
                                    flex: 1;
                                    padding-left: 23px;

                                    a {
                                        line-height: 30px;
                                        height: 30px;
                                        color: #999999;
                                    }
                                }

                                a {
                                    color: $colorMain;
                                    font-size: 14px;
                                }

                                img {
                                    width: 42px;
                                    height: 35px;
                                    vertical-align: middle;
                                    margin-right: 15px;
                                }
                            }
                        }
                    }
                }
            }

            .swiper-container {
                width: 100%;
                height: 100%;
                position: absolute;

                .swiper-slide {
                    a {
                        display: inline-block;
                        width: 100%;
                        height: 100%;

                        img {
                            width: 1920px;
                            height: 100%;
                            margin-left: -960px;
                            left: 50%;
                            position: relative;
                            overflow: hidden;
                        }
                    }
                }
            }
        }

        .main_diy {
            margin-top: 10px;
        }

        .product-box {
            background-color: $colorJ;
            padding: 30px 0 50px;

            h2 {
                font-size: $fontF;
                height: 21px;
                line-height: 21px;
                color: $colorMain;
                margin-bottom: 20px;
            }

            .wrapper {
                display: flex;

                .banner-left {
                    margin-right: 16px;

                    img {
                        width: 224px;
                        height: 619px;
                    }
                }

                .list-box {
                    .list {
                        @include flex();
                        width: 986px;
                        margin-bottom: 14px;

                        &:last-child {
                            margin-bottom: 0;
                        }

                        .item {
                            width: 236px;
                            height: 302px;
                            background-color: $colorG;
                            text-align: center;

                            span {
                                display: inline-block;
                                width: 67px;
                                height: 24px;
                                font-size: 14px;
                                line-height: 24px;
                                color: $colorG;

                                &.new-pro {
                                    background-color: #7ecf68;
                                }

                                &.kill-pro {
                                    background-color: #e82626;
                                }
                            }

                            .item-img {
                                img {
                                    width: 100%;
                                    height: 195px;
                                }
                            }

                            .item-info {
                                h3 {
                                    font-size: 14px;
                                    color: $colorMain;
                                    line-height: 14px;
                                    font-weight: bold;
                                }

                                p {
                                    color: $colorD;
                                    line-height: 13px;
                                    margin: 6px auto 13px;
                                }

                                .price {
                                    color: #f20a0a;
                                    font-size: 14px;
                                    font-weight: bold;
                                    cursor: pointer;

                                    &:after {
                                        @include bgImg(22px, 22px, "/imgs/icon-cart-hover.png");
                                        content: " ";
                                        margin-left: 5px;
                                        vertical-align: middle;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>