<template>
    <div class="layout">

        <div class="operating-space">
            <h2 class="title">放款預估</h2>

            <el-form class="customForm" :model="queryParams" ref="queryRef" label-position="top">
                <el-form-item label="RM Code" prop="rmempnr">
                    <el-input v-model="queryParams.rmempnr" placeholder="請輸入員編" clearable />
                </el-form-item>
                <el-form-item label="預估類型" prop="demandtype">
                    <el-radio-group v-model="queryParams.demandtype">
                        <el-radio v-for="opt in demandtypeOptions" :key="opt.value" :label="opt.value">
                            {{ opt.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="性質別" prop="proptype">
                    <el-select v-model="queryParams.proptype" placeholder="請選擇性質別" clearable>
                        <el-option v-for="item in proptypeOptions" :key="item.datavalue1" :label="item.showtext"
                            :value="item.datavalue1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客戶ID" prop="clientcd">
                    <el-input v-model="queryParams.clientcd" placeholder="請輸入客戶ID" clearable />
                </el-form-item>
                <el-form-item label="放款類別" prop="loantype">
                    <el-select v-model="queryParams.loantype" placeholder="請選擇放款類別" clearable>
                        <el-option v-for="item in loantypeOptions" :key="item.datavalue1" :label="item.showtext"
                            :value="item.datavalue1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客戶名稱" prop="clientnamec">
                    <el-input v-model="queryParams.clientnamec" placeholder="請輸入客戶名稱" clearable />
                </el-form-item>
                <el-form-item label="預估發生日期" prop="demanddate">
                    <el-date-picker v-model="queryParams.demanddate" type="dates" placeholder="請輸入預估發生日期" clearable />
                </el-form-item>
                <el-form-item label="幣別" prop="currencytype">
                    <el-select v-model="queryParams.currencytype" placeholder="請選擇幣別" clearable>
                        <el-option v-for="item in currencytypeOptions" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="匯率" prop="exchangeRate">
                    <el-input disabled v-model="queryParams.exchangeRate" />
                </el-form-item>
                <el-form-item label="預估金額" prop="demandamt">
                    <el-input v-model="queryParams.demandamt" />
                </el-form-item>
                <el-form-item label="原因說明" prop="loandescription">
                    <el-input v-model="queryParams.loandescription" />
                </el-form-item>
            </el-form>

            <div class="button__row">
                <el-row :gutter="10" justify="center">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="Search">查詢</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>

        <div class="table-container">
            <el-table v-loading="loading" :data="nodeList" :max-height="595">
                <el-table-column label="預估類型" width="127" type="index" prop="demandtype" />
                <el-table-column label="客戶ID" width="127" prop="clientcd" />
                <el-table-column label="客戶名稱" width="127" prop="clientnamec" />
                <el-table-column label="幣別" width="127" prop="currencytype" />
                <el-table-column label="性質別" width="127" prop="proptype" />
                <el-table-column label="放款類別" width="127" prop="loantype" />
                <el-table-column label="預估發生日期" width="127" prop="demanddate" />
                <el-table-column label="預估金額" width="127" prop="demandamt" />
                <el-table-column label="原因說明" width="127" prop="loandescription" />
                <el-table-column label="最後更新" width="127" prop="lastupdatedatetime" />
                <el-table-column label="資料建立" width="127" prop="createdatetime" />
                <el-table-column label="操作" width="127" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-button link type="primary" @click="handleUpdate(scope.row)">修改</el-button>
                        <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="paginator-container">
                <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
                    @pagination="getList" />
            </div>
        </div>

        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="nodeRef" :model="form" label-position="top">
                <el-form-item label="RM Code" prop="rmempnr">
                    <el-input v-model="form.rmempnr" placeholder="請輸入員編" clearable />
                </el-form-item>
                <el-form-item label="預估類型" prop="demandtype">
                    <el-radio-group v-model="form.demandtype">
                        <el-radio v-for="opt in demandtypeOptions" :key="opt.value" :label="opt.value">
                            {{ opt.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="性質別" prop="proptype">
                    <el-select v-model="form.proptype" placeholder="請選擇性質別" clearable>
                        <el-option v-for="item in proptypeOptions" :key="item.datavalue1" :label="item.showtext"
                            :value="item.datavalue1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客戶ID" prop="clientcd">
                    <el-input v-model="form.clientcd" placeholder="請輸入客戶ID" clearable />
                </el-form-item>
                <el-form-item label="放款類別" prop="loantype">
                    <el-select v-model="form.loantype" placeholder="請選擇放款類別" clearable>
                        <el-option v-for="item in loantypeOptions" :key="item.datavalue1" :label="item.showtext"
                            :value="item.datavalue1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.id!=null" label="客戶名稱" prop="clientnamec">
                    <el-input v-model="form.clientnamec" placeholder="請輸入客戶名稱" clearable />
                </el-form-item>
                <el-form-item label="預估發生日期" prop="demanddate">
                    <el-date-picker v-model="form.demanddate" type="dates" placeholder="請輸入預估發生日期" clearable />
                </el-form-item>
                <el-form-item label="幣別" prop="currencytype">
                    <el-select v-model="form.currencytype" placeholder="請選擇幣別" clearable>
                        <el-option v-for="item in currencytypeOptions" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="匯率" prop="exchangeRate">
                    <el-input disabled v-model="form.exchangeRate" />
                </el-form-item>
                <el-form-item label="預估金額" prop="demandamt">
                    <el-input v-model="form.demandamt" />
                </el-form-item>
                <el-form-item label="原因說明" prop="loandescription">
                    <el-input v-model="form.loandescription" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { demandtypeOptions, proptypeOptions, loantypeOptions, currencytypeOptions } from '@/dictionaries/loan.json';
import { reactive, toRefs, ref } from 'vue';
import pagination from '@/components/Pagination/index.vue';

const loading = ref(false);
const nodeList = ref([]);
const total = ref(0);
const open = ref(false);
const title = ref("");
const data = reactive({
    form: {
        id: null,
        rmempnr: null,
        demandtype: null,
        proptype: null,
        clientcd: null,
        loantype: null,
        clientnamec: null,
        demanddate: null,
        currencytype: null,
        exchangeRate: null,
        demandamt: null,
        loandescription: null
    },
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        rmempnr: null,
        demandtype: null,
        proptype: null,
        clientcd: null,
        loantype: null,
        clientnamec: null,
        demanddate: null,
        currencytype: null,
        exchangeRate: null,
        demandamt: null,
        loandescription: null
    }
});

const { queryParams, form } = toRefs(data);

/** 修改操作 */
function handleUpdate(row) {
    console.log('修改', row);
    reset();
}

/** 删除操作 */
function handleDelete(row) {
    console.log('删除', row);
}


function getList() {
}

/** 新增按钮操作 */
function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加放款預估";
}

// 表单重置
function reset() {
    form.value = {
        id: null,
        rmempnr: null,
        demandtype: null,
        proptype: null,
        clientcd: null,
        loantype: null,
        clientnamec: null,
        demanddate: null,
        currencytype: null,
        exchangeRate: null,
        demandamt: null,
        loandescription: null
    };
}

/** 提交按钮 */
function submitForm() {
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}
</script>

<style scoped lang="scss">
.layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
}

.operating-space,
.table-container {
    width: 100%;
    padding: 2rem;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
    font-family: "Helvetica Neue", "Segoe UI", sans-serif;
    color: #333;
}

.title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #222;
}

.customForm {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 24px;
    row-gap: 16px;
    background-color: #fff;
    
    @media screen and (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
}

.paginator-container {
    overflow: auto;

    // 當屏幕大於 768px 時，將分頁元件置中
    @media screen and (min-width: 768px) {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>