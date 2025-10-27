<template>
    <div class="layout">
        <div class="operating-space">
            <h2 class="title">放款預估</h2>

            <el-form class="customForm" :model="queryParams" ref="queryRef" label-position="top" :rules="rules">
                <el-form-item label="RM Code" prop="rmempnr">
                    <el-input v-model="queryParams.rmempnr" placeholder="請輸入員編" clearable />
                </el-form-item>
            </el-form>

            <div class="button__row">
                <el-row :gutter="10" justify="center">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="Search" @click="handleQuery">查詢</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>

        <div class="table-container">
            <el-table v-loading="tableLoading" :data="forecastLoanList" :max-height="595">
                <el-table-column label="操作" width="127" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-button link type="primary" @click="handleUpdate(scope.row)">修改</el-button>
                        <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="預估類型" width="127" prop="demandtype" />
                <el-table-column label="客戶ID" width="127" prop="clientcd" />
                <el-table-column label="客戶名稱" width="250" prop="clientnamec" />
                <el-table-column label="幣別" width="127" prop="currencytype" />
                <el-table-column label="性質別" width="120" prop="proptype" />
                <el-table-column label="放款類別" width="150" prop="loantype" />
                <el-table-column label="預估發生日期" width="127" prop="demanddate" />
                <el-table-column label="預估金額" width="127" prop="demandamt" :formatter="fmtDemandAmt" />
                <el-table-column label="原因說明" width="127" prop="loandescription" />
                <el-table-column label="最後更新" width="200" prop="lastupdatedatetime" :formatter="fmtDateUpdated" />
                <el-table-column label="資料建立" width="200" prop="createdatetime" :formatter="fmtDateCreated" />
            </el-table>

            <div class="paginator-container">
                <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
                    @pagination="onPaginate" />
            </div>
        </div>

        <el-dialog :title="title" v-model="open" width="500px" append-to-body align-center @close="cancel">
            <el-form v-loading="bootstrapLoading" ref="dialogFormRef" :model="form" :rules="dialogRules"
                label-position="top">
                <el-form-item label="RM Code" prop="rmempnr">
                    <el-input v-model="form.rmempnr" placeholder="請輸入員編" clearable />
                </el-form-item>
                <el-form-item label="預估類型" prop="demandtype">
                    <el-radio-group v-model="form.demandtype">
                        <el-radio v-for="(label, value) in pageBooststrap.demandtypeMap" :key="value" :value="value">
                            {{ label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="性質別" prop="proptype">
                    <el-select v-model="form.proptype" placeholder="請選擇性質別">
                        <el-option v-for="item in pageBooststrap.propTypeList" :key="item.datavalue1"
                            :label="item.showtext" :value="item.datavalue1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客戶ID" prop="clientcd">
                    <el-input v-model="form.clientcd" placeholder="請輸入客戶ID" clearable @blur="handleClientcdBlur" />
                </el-form-item>
                <el-form-item label="放款類別" prop="loantype">
                    <el-select v-model="form.loantype" placeholder="請選擇放款類別">
                        <el-option v-for="item in pageBooststrap.loanTypeList" :key="item.datavalue1"
                            :label="item.showtext" :value="item.datavalue1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客戶名稱" prop="clientnamec">
                    <el-input :disabled="isDisableClientNameC" v-model="form.clientnamec" placeholder="請輸入客戶名稱"
                        clearable />
                </el-form-item>
                <el-form-item label="預估發生日期" prop="demanddate">
                    <el-date-picker v-model="form.demanddate" type="date" placeholder="請輸入預估發生日期" clearable
                        format="YYYY-MM-DD" value-format="YYYY/MM/DD" />
                </el-form-item>
                <el-form-item label="幣別" prop="currencytype">
                    <el-select v-model="form.currencytype" placeholder="請選擇幣別" clearable @change="getExchangeRate">
                        <el-option v-for="item in pageBooststrap.currencyTypeList" :key="item.crncyCode"
                            :label="item.crncyCode" :value="item.crncyCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="匯率" prop="exchangeRate">
                    <el-input disabled v-model="form.exchangeRate" />
                </el-form-item>
                <el-form-item label="預估金額" prop="demandamt">
                    <el-input v-model.number="form.demandamt" type="number" />
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
import { reactive, toRefs, ref, onMounted, nextTick } from 'vue';
import pagination from '@/components/Pagination/index.vue';
import { useUserStore } from '@/stores/modules/user';
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { storeToRefs } from "pinia";
import type { FormInstance, TableColumnCtx } from 'element-plus'
import {
    getForecastLoanBootstrap,
    getForecastLoanList,
    fetchExchangeRate,
    addForecastLoan,
    deleteForecastLoan,
    selectOneForecastLoan,
    getClientdataByClientcd,
    updateForecastLoan
} from "@/api/forecastLoan";
import { formatToYmdHms } from '@/utils/date';
import { formatThousands } from '@/utils/number';

/** ===== Stores ===== */
const userStore = useUserStore();
const { areaCd, userInfo } = storeToRefs(userStore);

/** ===== Types ===== */
interface ForecastLoan {
    sid: number;
    demandtype: string;
    clientcd: string;
    clientnamec: string;
    currencytype: string;
    exchangeRate: number;
    loantype: string;
    demanddate: string;
    demandamt: number;
    operationIntRate: number | null;
    proptype: string;
    rmempnr: string;
    loandescription: string;
    acctNbr: string | null;
    deletedtag: string | null;
    createdatetime: string;
    lastupdatedatetime: string;
}

interface PageBootstrap {
    propTypeList: Array<any>
    loanTypeList: Array<any>
    currencyTypeList: Array<any>
    demandtypeMap: Record<string, string>
    twdExchangeRate: number
}

const initFormField = {
    sid: null as number | null,
    rmempnr: userInfo.value.loginUser.account,
    demandtype: '+',
    proptype: '111',
    clientcd: '',
    loantype: '1',
    clientnamec: '',
    demanddate: '',
    currencytype: 'TWD',
    exchangeRate: null as number | null,
    demandamt: null as number | null,
    loandescription: ''
}

/** ===== Refs / State ===== */
const queryRef = ref<FormInstance>()
const dialogFormRef = ref<FormInstance>()

const bootstrapLoading = ref(false);
const tableLoading = ref(false);
const forecastLoanList = ref<ForecastLoan[]>([]);
const total = ref(0);
const open = ref(false);
const title = ref("");
const isDisableClientNameC = ref(false);
const pageBooststrap = ref<PageBootstrap>({
    propTypeList: [],
    loanTypeList: [],
    currencyTypeList: [],
    demandtypeMap: {},
    twdExchangeRate: 1.0
});

/** 使用 reactive + toRefs，確保 v-model 是同一引用 */
const data = reactive({
    form: {
        ...initFormField
    },
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        rmempnr: ''
    },
    rules: {
        rmempnr: [
            { required: true, message: "RM Code 不能為空", trigger: "blur" },
            { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }
        ]
    }
});
const { queryParams, form, rules } = toRefs(data);

/** 對話框表單的更嚴謹驗證（避免提交垃圾資料） */
const dialogRules = {
    rmempnr: [{ required: true, message: '請輸入RM Code', trigger: 'blur' }],
    clientcd: [{ required: true, message: '請輸入客戶ID', trigger: 'blur' }],
    clientnamec: [
        {
            validator: (_rule: any, value: string, cb: any) => {
                // 若欄位被鎖定（disabled=true），不檢查此規則
                if (isDisableClientNameC.value) return cb()

                // 欄位可編輯時才驗必填
                if (!value || !String(value).trim()) {
                    return cb(new Error('客戶名稱為必填'))
                }
                cb()
            },
            trigger: ['blur', 'change']
        }
    ],
    demanddate: [{ required: true, message: '請選擇日期', trigger: 'change' }],
    currencytype: [{ required: true, message: '請選擇幣別', trigger: 'change' }],
    demandamt: [
        { required: true, message: '請輸入金額', trigger: 'blur' },
    ],
    loandescription: [{ required: true, message: '請輸入原因說明', trigger: 'blur' }]
}

/** ===== Lifecycle ===== */
onMounted(async () => {
    bootstrapLoading.value = true
    try {
        const resp = await getForecastLoanBootstrap()
        const { propTypeList, loanTypeList, currencyTypeList, demandtypeMap, twdExchangeRate } = resp?.data || {}
        pageBooststrap.value = { propTypeList, loanTypeList, currencyTypeList, demandtypeMap, twdExchangeRate }
    } catch (err) {
        ElNotification.error({ title: '錯誤', message: String(err) })
    } finally {
        bootstrapLoading.value = false
    }
})

/** ===== Actions ===== */
async function handleClientcdBlur() {
  try {
    // 開放客戶名稱輸入（先假設要讓使用者手動填）
    isDisableClientNameC.value = false
    form.value.clientnamec = ''
    // 清除「客戶名稱」舊的錯誤狀態（若有）
    queryRef.value?.clearValidate('clientnamec')

    const { clientcd } = form.value
    if (!clientcd || !clientcd.trim()) {
      // 客戶ID為空不查詢
      return
    }

    const resp = await getClientdataByClientcd({ clientcd })
    if (!resp.data || !resp.data.clientNameC) {
      ElMessage.warning('查無此客戶名稱，請手動輸入')
      // 開放輸入 → 交由條件式規則在 blur/change/提交時驗證
      return
    }

    // 查到資料 → 設值並「鎖定欄位」
    form.value.clientnamec = resp.data.clientNameC
    isDisableClientNameC.value = true

    // 若你希望此時就讓表單整體為「乾淨狀態」，可選擇清除錯誤
    queryRef.value?.clearValidate('clientnamec')
    // 注意：條件式規則在 disabled 狀態會自動放行，不再出紅字
  } catch (err) {
    ElNotification.error({ title: '錯誤', message: String(err) })
  }
}

async function getExchangeRate() {
    try {
        bootstrapLoading.value = true;
        const { currencytype } = form.value
        const resp = await fetchExchangeRate(currencytype)
        console.log('resp', resp)
        form.value.exchangeRate = Number(resp.data.exchangeRate);
        bootstrapLoading.value = false;
    } catch (err) {
        bootstrapLoading.value = false;
        ElNotification.error({ title: '錯誤', message: String(err) })
    }
}
/** 新增按钮操作 */
async function handleAdd() {
    try {
        resetForm();
        open.value = true;
        title.value = "添加放款預估";
        isDisableClientNameC.value = false;
        form.value.exchangeRate = pageBooststrap.value.twdExchangeRate;
    } catch (err) {
        ElNotification.error({ title: '錯誤', message: String(err) })
    }
}

// 表单重置
function resetForm() {
    form.value = {
        ...initFormField
    };
    console.log('resetForm form', dialogFormRef.value);
    dialogFormRef.value?.resetFields();
}

// 取消按钮
function cancel() {
    open.value = false;
    resetForm();
}

/** 修改操作 */
async function handleUpdate(row: ForecastLoan) {
    open.value = true
    title.value = '修改放款預估'
    console.log('row', row)
    const { sid } = row
    const resp = await selectOneForecastLoan({ sid })
    const data = resp?.data
    console.log('data', data)
    form.value = {
        sid: data.sid,
        rmempnr: data.rmempnr ?? '',
        demandtype: data.demandtype ?? '',
        proptype: data.proptype ?? '',
        clientcd: data.clientcd ?? '',
        loantype: data.loantype ?? '',
        clientnamec: data.clientnamec ?? '',
        demanddate: data.demanddate ?? '',
        currencytype: data.currencytype ?? '',
        exchangeRate: data.exchangeRate ?? null,
        demandamt: data.demandamt ?? null,
        loandescription: data.loandescription ?? ''
    }
    open.value = true
    title.value = '修改放款預估'
    isDisableClientNameC.value = true;
}

/** 删除操作 */
async function handleDelete(row: ForecastLoan) {
    try {
        await ElMessageBox.confirm(`是否確認刪除 SID 編號為「${row.sid}」的資料？`, '提示', {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        console.log('刪除資料', row)
        await deleteForecastLoan({ sid: row.sid! })
        await getList()
        ElMessage.success('刪除成功')
    } catch (error) {
        console.log('取消刪除或發生錯誤', error)
        if (error === 'cancel') return; // 使用者取消刪除不顯示錯誤通知
        ElNotification.error({ title: '刪除失敗', message: String(error) })
    }
}

/** 搜索按钮操作 */
async function handleQuery() {
    const formEl = queryRef.value
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            try {
                queryParams.value.pageNum = 1;
                await getList();
            } catch (error) {
                ElNotification.error({
                    title: '錯誤',
                    message: String(error)
                });
            }
        }
    })
};

async function onPaginate() {
    await getList()
}

/** 查询放款預估列表 */
async function getList() {
    tableLoading.value = true
    try {
        const resp = await getForecastLoanList({
            rmEmpNr: userInfo.value?.loginUser?.account || '',
            areaCd: areaCd.value || '',
            inputRmEmpNr: queryParams.value.rmempnr || '',
            pageNum: queryParams.value.pageNum,
            pageSize: queryParams.value.pageSize
        })
        const rows: ForecastLoan[] = resp?.data?.rows ?? []
        forecastLoanList.value = rows
        total.value = resp?.data?.total ?? 0
    } catch (err) {
        ElNotification.error({ title: '錯誤', message: String(err) })
    } finally {
        tableLoading.value = false
    }
}

/** 提交按钮 */
async function submitForm() {
    const formEl = dialogFormRef.value
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        console.log('fields', fields)
        if (valid) {
            try {

                if (form.value.sid != null) {
                    // 修改
                    console.log('修改：', form.value)
                    await updateForecastLoan({
                        areaCd: areaCd.value || '',
                        sid: form.value.sid!,
                        rmempnr: form.value.rmempnr,
                        demandtype: form.value.demandtype,
                        proptype: form.value.proptype,
                        clientcd: form.value.clientcd,
                        loantype: form.value.loantype,
                        clientnamec: form.value.clientnamec,
                        demanddate: form.value.demanddate,
                        currencytype: form.value.currencytype,
                        exchangeRate: Number(form.value.exchangeRate),
                        demandamt: Number(form.value.demandamt),
                        loandescription: form.value.loandescription
                    })
                    ElMessage.success('修改成功')
                    queryParams.value.rmempnr = form.value.rmempnr
                    open.value = false
                    await getList()
                } else {
                    // 新增
                    console.log('新增：', form.value)
                    await addForecastLoan({
                        areaCd: areaCd.value || '',
                        rmempnr: form.value.rmempnr,
                        demandtype: form.value.demandtype,
                        proptype: form.value.proptype,
                        clientcd: form.value.clientcd,
                        loantype: form.value.loantype,
                        clientnamec: form.value.clientnamec,
                        demanddate: form.value.demanddate,
                        currencytype: form.value.currencytype,
                        exchangeRate: Number(form.value.exchangeRate),
                        demandamt: Number(form.value.demandamt),
                        loandescription: form.value.loandescription
                    })
                    ElMessage.success('新增成功')
                    open.value = false
                    queryParams.value.rmempnr = form.value.rmempnr
                    await getList()
                }
            } catch (error) {
                const title = form.value.sid != null ? '修改失敗' : '新增失敗'
                ElNotification.error({ title, message: String(error) })
            }
        }
    })
}

/** ===== Formatters ===== */
function fmtDateUpdated(row: ForecastLoan, _col: TableColumnCtx<ForecastLoan>) {
    return row?.lastupdatedatetime ? formatToYmdHms(row.lastupdatedatetime) : ''
}
function fmtDateCreated(row: ForecastLoan, _col: TableColumnCtx<ForecastLoan>) {
    return row?.createdatetime ? formatToYmdHms(row.createdatetime) : ''
}
function fmtDemandAmt(row: ForecastLoan) {
    return typeof row?.demandamt === 'number' ? formatThousands(row.demandamt) : ''
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