<template>
    <div class="sld_myPoint_wrapper">
        <MemberTitle memberTitle="积分" style="padding-left:20px"></MemberTitle>
        <div class="pointCon">
            <div class="jifen_top">
                <div class="itg">
                    <span>{{L['可用积分']}}：</span>
                    <span class="colr">{{pointAva}}</span>
                </div>
            </div>
            <div class="content_tit">
                <ul class="tabsTitle">
                    <li :class="{current:indexNum==0}" id="all" @click="handleSwitch(0)">{{L['全部']}}</li>
                    <li :class="{current:indexNum==1}" id="income" @click="handleSwitch(1)">{{L['收入']}}</li>
                    <li :class="{current:indexNum==2}" id="expend" @click="handleSwitch(2)">{{L['支出']}}</li>
                </ul>
            </div>
            <div class="point_list">
                <table class="point_table">
                    <tbody>
                        <tr class="voucher_tabeltitle">
                            <th style="width:30%">{{L['日期']}}</th>
                            <th style="width:30%">{{L['收入/支出']}}</th>
                            <th style="width:40%">{{L['详细说明']}}</th>
                        </tr>
                        <tr v-for="(item,index) in pointList.list" :key="index">
                            <td>{{item.createTime}}</td>
                            <td><span class="colr"
                                    v-if="item.type==6||item.type==7||item.type==9||item.type==12||item.type==13||item.type==14">-{{item.value}}</span>
                                <span class="colr1" v-else>+{{item.value}}</span>
                            </td>
                            <td>{{item.description}}</td>
                        </tr>
                    </tbody>
                </table>
                <SldCommonEmpty v-if="!pointList.list.length" totalHeight="587" totalWidth="1003" tip="暂无积分记录~" />

            </div>
            <div class="flex_row_end_center sld_pagination">
                <el-pagination @current-change="handleCurrentChange" v-model:currentPage="pageData.page.current"
                    :page-size="pageData.page.pageSize" layout="prev, pager, next, jumper" :total="pageData.page.total"
                    :hide-on-single-page="true">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import MemberTitle from '../../components/MemberTitle';
    import SldCommonEmpty from '../../components/SldCommonEmpty';
    import { reactive, onMounted, getCurrentInstance, ref } from 'vue'
    export default {
        name: 'myPoint',
        components: {
            MemberTitle,
            SldCommonEmpty
        },
        setup() {
            const { proxy } = getCurrentInstance()
            const L = proxy.$getCurLanguage()
            const pointAva = ref(0)
            const pointList = reactive({ list: [] })
            const pageData = reactive({ page: {} })
            const indexNum = ref(0)
            const params = reactive({
                current: 1,
                pageSize: 20,
                type: ''
            })
            const getInitPoint = () => {
                proxy.$get('v3/member/front/integralLog/getMemberIntegral').then(res => {
                    if (res.state == 200) {
                        pointAva.value = res.data.memberIntegral
                    }
                })
            }
            const getPointList = () => {
                proxy.$post('v3/member/front/integralLog/list', params).then(res => {
                    if (res.state == 200) {
                        pointList.list = res.data.list
                        pageData.page = res.data.pagination
                    }
                })
            }

            const handleSwitch = (index) => {
                indexNum.value = index
                params.type = index
                params.current = 1
                getPointList()
            }
            const handlePrevCilickChange = (e) => {
                params.current = e
                getPointList()
            }

            const handleNextCilickChange = (e) => {
                params.current = e
                getPointList()
            }

            const handleCurrentChange = (e) => {
                params.current = e
                getPointList()
            }

            onMounted(() => {
                getInitPoint()
                getPointList()
            })

            return {
                L,
                pointAva,
                pointList,
                pageData,
                handlePrevCilickChange,
                handleNextCilickChange,
                handleCurrentChange,
                handleSwitch,
                indexNum
            }
        }
    }
</script>
<style lang="scss">
    @import '@/style/member/myPoint.scss';
    @import '@/style/base.scss';

    .sld_pagination {
        margin-right: 40px;
        margin-bottom: 20px;
    }
</style>