<template>
    <div class="layout" v-loading="pageLoading">
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
                <el-table-column label="預估類型" width="127" prop="demandtype" />
                <el-table-column label="客戶ID" width="127" prop="clientcd" />
                <el-table-column label="客戶名稱" width="250" prop="clientnamec" />
                <el-table-column label="幣別" width="127" prop="currencytype" />
                <el-table-column label="性質別" width="200" prop="proptype" />
                <el-table-column label="放款類別" width="127" prop="loantype" />
                <el-table-column label="預估發生日期" width="127" prop="demanddate" />
                <el-table-column label="預估金額" width="127" prop="demandamt" :formatter="fmtDemandAmt"/>
                <el-table-column label="原因說明" width="127" prop="loandescription" />
                <el-table-column label="最後更新" width="200" prop="lastupdatedatetime" :formatter="fmtDateUpdated" />
                <el-table-column label="資料建立" width="200" prop="createdatetime" :formatter="fmtDateCreated" />
                <el-table-column label="操作" width="127" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-button link type="primary" @click="handleUpdate(scope.row)">修改</el-button>
                        <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="paginator-container">
                <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
                    @pagination="onPaginate" />
            </div>
        </div>

        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="dialogFormRef" :model="form" :rules="dialogRules" label-position="top">
                <el-form-item label="RM Code" prop="rmempnr">
                    <el-input v-model="form.rmempnr" placeholder="請輸入員編" clearable />
                </el-form-item>
                <el-form-item label="預估類型" prop="demandtype">
                    <el-radio-group v-model="form.demandtype">
                        <el-radio v-for="opt in demandtypeOptions" :key="opt.value" :value="opt.value">
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
                <el-form-item v-if="form.id != null" label="客戶名稱" prop="clientnamec">
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
import { reactive, toRefs, ref, onMounted } from 'vue';
import pagination from '@/components/Pagination/index.vue';
import { useUserStore } from '@/stores/modules/user';
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { storeToRefs } from "pinia";
import type { FormInstance, TableColumnCtx } from 'element-plus'
import {
    getForecastLoanBootstrap,
    getForecastLoanList,
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
}

/** ===== Refs / State ===== */
const queryRef = ref<FormInstance>()
const dialogFormRef = ref<FormInstance>()

const pageLoading = ref(false);
const tableLoading = ref(false);
const forecastLoanList = ref<ForecastLoan[]>([]);
const total = ref(0);
const open = ref(false);
const title = ref("");
const pageBooststrap = ref<PageBootstrap>({
    propTypeList: [],
    loanTypeList: [],
    currencyTypeList: [],
});

/** 使用 reactive + toRefs，確保 v-model 是同一引用 */
const data = reactive({
    form: {
        id: null as number | null,
        rmempnr: '' as string | null,
        demandtype: '' as string | null,
        proptype: '' as string | null,
        clientcd: '' as string | null,
        loantype: '' as string | null,
        clientnamec: '' as string | null,
        demanddate: '' as string | null,
        currencytype: '' as string | null,
        exchangeRate: null as number | null,
        demandamt: null as number | null,
        loandescription: '' as string | null
    },
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        rmempnr: null
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
  rmempnr: [{ required: true, message: '請輸入 RM Code', trigger: 'blur' }],
  demandtype: [{ required: true, message: '請選擇預估類型', trigger: 'change' }],
  proptype: [{ required: true, message: '請選擇性質別', trigger: 'change' }],
  clientcd: [{ required: true, message: '請輸入客戶ID', trigger: 'blur' }],
  loantype: [{ required: true, message: '請選擇放款類別', trigger: 'change' }],
  demanddate: [{ required: true, message: '請選擇日期', trigger: 'change' }],
  currencytype: [{ required: true, message: '請選擇幣別', trigger: 'change' }],
  exchangeRate: [{ required: true, message: '請輸入匯率', trigger: 'blur' }],
  demandamt: [
    { required: true, message: '請輸入金額', trigger: 'blur' },
    { type: 'number', min: 0, message: '金額必須為非負數', trigger: 'blur' }
  ]
}

/** ===== Lifecycle ===== */
onMounted(async () => {
  pageLoading.value = true
  try {
    const resp = await getForecastLoanBootstrap()
    const { propTypeList, loanTypeList, currencyTypeList } = resp?.data || {}
    pageBooststrap.value = { propTypeList, loanTypeList, currencyTypeList }
  } catch (err) {
    ElNotification.error({ title: '錯誤', message: String(err) })
  } finally {
    pageLoading.value = false
  }
})

/** ===== Actions ===== */
/** 新增按钮操作 */
function handleAdd() {
    resetForm();
    open.value = true;
    title.value = "添加放款預估";
}

// 表单重置
function resetForm() {
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

// 取消按钮
function cancel() {
    open.value = false;
    resetForm();
}

/** 修改操作 */
function handleUpdate(row: ForecastLoan) {
  open.value = true
  title.value = '修改放款預估'
  form.value = {
    id: row.sid,
    rmempnr: row.rmempnr ?? '',
    demandtype: row.demandtype ?? '',
    proptype: row.proptype ?? '',
    clientcd: row.clientcd ?? '',
    loantype: row.loantype ?? '',
    clientnamec: row.clientnamec ?? '',
    demanddate: row.demanddate ?? '',
    currencytype: row.currencytype ?? '',
    exchangeRate: row.exchangeRate ?? null,
    demandamt: row.demandamt ?? null,
    loandescription: row.loandescription ?? ''
  }
}

/** 删除操作 */
async function handleDelete(row: ForecastLoan) {
  try {
    await ElMessageBox.confirm(`是否確認刪除 SID 編號為「${row.sid}」的資料？`, '提示', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // 這裡呼叫實際後端刪除 API（TODO）
    await getList()
    ElMessage.success('刪除成功')
  } catch {
    /* 使用者取消或失敗 */
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
        if (valid) {
            try {
                // TODO: 呼叫新增/修改 API；依 form.id 判斷
                // await saveForecastLoan(form.value)
                open.value = false
                await getList()
                ElMessage.success('已提交')
            } catch (error) {
                ElNotification.error({ title: '提交失敗', message: String(error) })
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