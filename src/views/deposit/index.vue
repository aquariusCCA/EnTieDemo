<template>
    <div class="layout" v-loading="bootstrapLoading">
        <div class="operating-space">
            <h2 class="title">存款預估</h2>

            <el-form 
                class="customForm" 
                :model="queryParams" 
                ref="queryRef" 
                label-position="top" 
                :rules="rules"
            >
                <el-form-item label="RM Code" prop="rmEmpNo">
                    <el-input 
                        v-model="queryParams.rmEmpNo" 
                        placeholder="請輸入員編" 
                        clearable 
                    />
                </el-form-item>
            </el-form>

            <div class="button__row">
                <el-row  
                    :gutter="10" 
                    justify="center"
                >
                    <el-col :span="1.5">
                        <el-button 
                            type="primary" 
                            plain 
                            icon="Plus"
                            @click="handleAdd"
                        >
                            新增
                        </el-button>
                    </el-col>

                    <el-col :span="1.5">
                        <el-button 
                            type="primary" 
                            plain icon="Search" 
                            @click="handleQuery"
                        >
                            查詢
                        </el-button>
                    </el-col>

                    <el-col :span="1.5" v-show="areaCd === '983'">
                        <el-button 
                            type="primary" 
                            plain icon="Files" 
                            @click="handleExport"
                        >
                            匯出存款預估報表
                        </el-button>
                    </el-col>                    
                </el-row>
            </div>
        </div>

        <div class="table-container">
            <el-table 
                v-loading="tableLoading" 
                :data="forecastDepositList" 
                :max-height="300"
            >
                <el-table-column 
                    fixed 
                    label="操作"
                    width="127" 
                    class-name="small-padding fixed-width"
                >
                    <template #default="scope">
                        <el-button link type="primary" @click="handleUpdate(scope.row)">修改</el-button>
                        <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="預估類型" width="127" prop="demandType" />
                <el-table-column label="區域中心" width="127" prop="areaName" />
                <el-table-column label="RM姓名" width="127" prop="rmEmpNameC" />
                <el-table-column label="客戶名稱" width="300" prop="clientNameC" />
                <el-table-column label="幣別" width="127" prop="currencyType" />
                <el-table-column label="預估發生日期" width="127" prop="demandDate" />
                <el-table-column label="預估金額(原幣)" align="right" width="127" prop="demandAmt" :formatter="fmtDemandAmt"/>
                <el-table-column label="折合台幣" align="right" width="127" prop="demandAmtTwd" :formatter="fmtDemandAmtTwd"/>
                <el-table-column label="匯率" align="right" width="127" prop="exchangeRate" />
                <el-table-column label="存款天期" width="300" prop="depositDescription" />
                <el-table-column label="最後更新" width="200" prop="lastUpdateDatetime"/>
                <el-table-column label="資料建立" width="200" prop="createDatetime"/>
            </el-table>

            <div class="paginator-container">
                <pagination 
                    :total="total" 
                    v-model:page="queryParams.pageNum" 
                    v-model:limit="queryParams.pageSize"
                    @pagination="onPaginate" 
                />
            </div>
        </div>

        <el-dialog 
            :title="title"
            v-model="open" 
            width="500px" 
            append-to-body 
            align-center 
            @close="cancel"
        >
            <el-form 
                v-loading="bootstrapLoading" 
                ref="dialogFormRef" 
                :model="form" 
                :rules="dialogRules"
                label-position="top"
            >
                <el-form-item label="RM Code" prop="rmEmpNo">
                    <el-input v-model="form.rmEmpNo" placeholder="請輸入員編" clearable />
                </el-form-item>
                <el-form-item label="預估類型" prop="demandType">
                    <el-radio-group v-model="form.demandType">
                        <el-radio 
                            v-for="(label, value) in pageBooststrap.demandTypeMap" 
                            :key="value" 
                            :value="value"
                        >
                            {{ label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="客戶名稱" prop="clientNameC">
                    <el-input v-model="form.clientNameC" placeholder="請輸入客戶名稱"
                        clearable />
                </el-form-item>
                <el-form-item label="幣別" prop="currencyType">
                    <el-select 
                        v-model="form.currencyType" 
                        placeholder="請選擇幣別" 
                        clearable 
                        @change="getExchangeRate"
                    >
                        <el-option
                            v-for="item in pageBooststrap.currencySelectOptions" 
                            :key="item.crncyCode"
                            :label="item.crncyCode" 
                            :value="item.crncyCode"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="預估發生日期" prop="demandDate">
                    <el-date-picker 
                        v-model="form.demandDate" 
                        type="date" 
                        placeholder="請輸入預估發生日期" 
                        clearable
                        format="YYYY-MM-DD" 
                        value-format="YYYY-MM-DD" 
                    />
                </el-form-item>
                <el-form-item label="匯率" prop="exchangeRate">
                    <el-input disabled v-model="form.exchangeRate" />
                </el-form-item>
                <el-form-item label="預估金額(原幣)" prop="demandAmt">
                    <el-input v-model.number="form.demandAmt" type="number" />
                </el-form-item>
                <el-form-item label="折合台幣" prop="demandAmtTwd">
                    <el-input disabled v-model.number="demandAmtTwd" type="number" />
                </el-form-item>
                <el-form-item label="存款天期" prop="depositDescription">
                    <el-select
                        v-model="form.depositDescription"
                        placeholder="請選擇"
                        clearable
                        filterable
                    >
                        <el-option
                            v-for="item in pageBooststrap.depositTypeSelectOptions"
                            :key="item"
                            :label="item"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">確 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { 
    reactive, 
    toRefs, 
    onMounted, 
    ref,
    computed
} from 'vue';
import {
    getForecastDepositBootstrap,
    fetchExchangeRate,
    addForecastDeposit,
    getForecastDepositList,
    selectOneForecastDeposit,
    updateForecastDeposit,
    deleteForecastDeposit,
    exportForecastDeposit
} from "@/api/forecastDeposit";
import { 
    ElNotification, 
    ElMessage,
    ElMessageBox,
    ElLoading
} from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useUserStore } from '@/stores/modules/user';
import pagination from '@/components/Pagination/index.vue';
import { formatThousands } from '@/utils/number';
import { downloadBlob } from '@/utils/download'

/** ===== Stores ===== */
const userStore = useUserStore();
const { areaCd, userInfo } = storeToRefs(userStore);

/** ===== Types ===== */
interface ForecastDeposit {
    id: number
    areaCd: string
    areaName: string
    rmEmpNo: string
    rmEmpNameC: string
    demandType: string
    clientNameC: string
    currencyType: string
    demandDate: string
    exchangeRate: number
    demandAmt: number
    demandAmtTwd: number
    depositDescription: string
    createdatetime: string
    lastupdatedatetime: string
}

interface PageBootstrap {
    areaNameSelectOptions: Array<any>
    currencySelectOptions: Array<any>
    demandTypeMap: Record<string, string>
    depositTypeSelectOptions: Array<string>
}

const initFormField = {
    id: null as number | null,
    areaCd: '',
    areaName: '',
    rmEmpNo: '',
    rmEmpNameC: '',
    demandType: '+',
    clientNameC: '',
    currencyType: 'TWD',
    demandDate: '',
    exchangeRate: 1,
    demandAmt: null as number | null,
    demandAmtTwd: null as number | null,
    depositDescription: '',
}

/** ===== Refs / State ===== */
const queryRef = ref<FormInstance>()
const dialogFormRef = ref<FormInstance>()

const bootstrapLoading = ref(false);
const tableLoading = ref(false);
const forecastDepositList = ref<ForecastDeposit[]>([]);
const pageBooststrap = ref<PageBootstrap>({
    areaNameSelectOptions: [],
    currencySelectOptions: [],
    demandTypeMap: {},
    depositTypeSelectOptions: []
});
const open = ref(false);
const title = ref("");
const total = ref(0);


/** 使用 reactive + toRefs，確保 v-model 是同一引用 */
const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        rmEmpNo: ''
    },
    rules: {
        rmEmpNo: [
            { required: true, message: "RM Code 不能為空", trigger: "blur" }
        ]
    },
    form: {
        ...initFormField
    },
});
const { queryParams, rules, form } = toRefs(data);

/** 對話框表單的更嚴謹驗證（避免提交垃圾資料） */
const dialogRules = {
    rmEmpNo: [{ required: true, message: '請輸入RM 員編', trigger: 'blur' }],
    rmEmpNameC: [{ required: true, message: '請輸入 RM 姓名', trigger: 'blur' }],
    clientNameC: [{ required: true, message: '請輸入客戶名稱', trigger: 'blur' }],
    demandDate: [
        { required: true, message: '請選擇日期', trigger: 'change' },
        {
            validator: (_rule: any, value: string, cb: (err?: Error) => void) => {
                // 空值交給 required 規則處理，這裡不再報錯
                if (!value) {
                    cb()
                    return
                }

                // Element Plus 現在 value-format 是 "YYYY/MM/DD"
                // 為避免瀏覽器各自實作 new Date() 解析字串，先統一轉成 "YYYY-MM-DD"
                const normalized = value.replace(/\//g, '-')
                const selectedDate = new Date(normalized)
                if (Number.isNaN(selectedDate.getTime())) {
                    cb(new Error('日期格式錯誤'))
                    return
                }

                // 只比對到「日」，把時間歸零
                selectedDate.setHours(0, 0, 0, 0)
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                if (selectedDate < today) {
                    cb(new Error('預估發生日期不可早於今天'))
                } else {
                    cb()
                }
            },
            trigger: ['blur', 'change']
        }
    ],
    demandAmt: [{ required: true, message: '請輸入預估金額', trigger: 'blur' }],
    depositDescription: [{ required: true, message: '請輸入存款天期(活期請註明)', trigger: 'blur' }],
}

/** ===== Computed ===== */
// 衍生欄位，用 computed 算，不放進 form
const demandAmtTwd = computed(() => {
  const amt = form.value.demandAmt
  const rate = Number(form.value.exchangeRate)

  // 欄位沒填或轉不成數字就回傳 null/空字串
  if (amt == null || !rate) return null

  // 這邊看規則要不要四捨五入到小數幾位
  return Number((amt * rate).toFixed(0)) // 或 toFixed(2)
})


/** ===== Lifecycle ===== */
onMounted(async () => {
    bootstrapLoading.value = true
    try {
        const resp = await getForecastDepositBootstrap()
        const { 
            areaNameSelectOptions, 
            currencySelectOptions, 
            demandTypeMap,
            depositTypeSelectOptions
        } = resp.data
        pageBooststrap.value = {
            areaNameSelectOptions,
            currencySelectOptions,
            demandTypeMap,
            depositTypeSelectOptions
        }
        console.log('pageBooststrap', pageBooststrap.value)
    } catch (err) {
        ElNotification.error({ title: '錯誤', message: String(err) })
    } finally {
        bootstrapLoading.value = false
    }
})

/** ===== Actions ===== */
// 表单重置
function resetForm() {
    form.value = {
        ...initFormField
    };
    dialogFormRef.value?.resetFields();
}

// 取消按钮
function cancel() {
    open.value = false;
    resetForm();
}

/** 新增按钮操作 */
async function handleAdd() {
    try {
        resetForm();
        open.value = true;
        title.value = "添加存款預估";
    } catch (err) {
        ElNotification.error({ title: '錯誤', message: String(err) })
    }
}

async function getExchangeRate() {
    try {
        bootstrapLoading.value = true;
        const { currencyType } = form.value
        const resp = await fetchExchangeRate(currencyType)
        console.log('resp', resp)
        form.value.exchangeRate = Number(resp.data.exchangeRate);
        bootstrapLoading.value = false;
    } catch (err) {
        bootstrapLoading.value = false;
        ElNotification.error({ title: '錯誤', message: String(err) })
    }
}

/** 查询放款預估列表 */
async function getList() {
    tableLoading.value = true
    try {
        const resp = await getForecastDepositList({
            loggedInAreaCd: areaCd.value || '',
            inputRmEmpNo: queryParams.value.rmEmpNo || '',
            pageNum: queryParams.value.pageNum,
            pageSize: queryParams.value.pageSize
        })
        const rows: ForecastDeposit[] = resp?.data?.rows ?? []
        forecastDepositList.value = rows
        total.value = resp?.data?.total ?? 0
    } catch (err) {
        ElNotification.error({ title: '錯誤', message: String(err) })
    } finally {
        tableLoading.value = false
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
}

/** 提交按钮 */
async function submitForm() {
    const formEl = dialogFormRef.value
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        console.log('fields', fields)
        if (valid) {
            try {
                if (form.value.id != null) {
                    // 修改
                    console.log('修改：', form.value)
                    await updateForecastDeposit({
                        loggedInAreaCd: areaCd.value || '',
                        id: form.value.id,
                        rmEmpNo: form.value.rmEmpNo,
                        demandType: form.value.demandType,
                        clientNameC: form.value.clientNameC,
                        currencyType: form.value.currencyType,
                        demandDate: form.value.demandDate,
                        exchangeRate: Number(form.value.exchangeRate),
                        demandAmt: Number(form.value.demandAmt),
                        demandAmtTwd: Number(demandAmtTwd.value || 0),
                        depositDescription: form.value.depositDescription,
                    })
                    ElMessage.success('修改成功')
                    open.value = false
                    // 查詢更新列表
                    queryParams.value.rmEmpNo = form.value.rmEmpNo
                    await getList()
                } else {
                    // 新增
                    console.log('新增：', form.value)
                    await addForecastDeposit({
                        loggedInAreaCd: areaCd.value || '',
                        rmEmpNo: form.value.rmEmpNo,
                        demandType: form.value.demandType,
                        clientNameC: form.value.clientNameC,
                        currencyType: form.value.currencyType,
                        demandDate: form.value.demandDate,
                        exchangeRate: Number(form.value.exchangeRate),
                        demandAmt: Number(form.value.demandAmt),
                        demandAmtTwd: Number(demandAmtTwd.value || 0),
                        depositDescription: form.value.depositDescription,
                    })
                    ElMessage.success('新增成功')
                    open.value = false
                    // 查詢更新列表
                    queryParams.value.rmEmpNo = form.value.rmEmpNo
                    await getList()
                }
            } catch (error) {
                const title = form.value.id != null ? '修改失敗' : '新增失敗'
                ElNotification.error({ title, message: String(error) })
            }
        }
    })
}

async function onPaginate() {
    await getList()
}

/** 修改操作 */
async function handleUpdate(row: ForecastDeposit) {
    console.log('row', row)
    const { id } = row
    const resp = await selectOneForecastDeposit({ id })
    const data = resp?.data
    console.log('data', data)
    form.value = {
        id: data.id,
        areaCd: data.areaCd,
        areaName: data.areaName,
        rmEmpNo: data.rmEmpNo,
        rmEmpNameC: data.rmEmpNameC,
        demandType: data.demandType,
        clientNameC: data.clientNameC,
        currencyType: data.currencyType,
        demandDate: data.demandDate,
        exchangeRate: data.exchangeRate,
        demandAmt: data.demandAmt,
        demandAmtTwd: data.demandAmtTwd,
        depositDescription: data.depositDescription,    
    }
    open.value = true
    title.value = '修改存款預估'
}

/** 删除操作 */
async function handleDelete(row: ForecastDeposit) {
    try {
        await ElMessageBox.confirm(`是否確認刪除 ID 編號為「${row.id}」的資料？`, '提示', {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        console.log('刪除資料', row)
        await deleteForecastDeposit({ id: row.id, loggedInAreaCd: areaCd.value || '' })
        await getList()
        ElMessage.success('刪除成功')
    } catch (error) {
        console.log('取消刪除或發生錯誤', error)
        if (error === 'cancel') return; // 使用者取消刪除不顯示錯誤通知
        ElNotification.error({ title: '刪除失敗', message: String(error) })
    }
}

async function handleExport(){
    const loading = ElLoading.service({
        lock: true,
        text: '報表生成中，請稍候 …',
        background: 'rgba(0,0,0,0.3)'
    })

    try {
        const response = await exportForecastDeposit()
        const blob = response.data
        const fileName = '存款預估報表.xlsx'
        downloadBlob(blob, fileName)
        ElNotification.success('報表下載已完成')
    } catch (err) {
        console.error('報表生成失敗:', err)
        ElNotification.error({
            title: '報表生成失敗',
            message: String(err)
        })
    } finally {
        loading.close()
    }
}

/** ===== Formatters ===== */
function fmtDemandAmt(row: ForecastDeposit) {
    return typeof row?.demandAmt === 'number' ? formatThousands(row.demandAmt) : ''
}

function fmtDemandAmtTwd(row: ForecastDeposit) {
    return typeof row?.demandAmtTwd === 'number' ? formatThousands(row.demandAmtTwd) : ''
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
    padding: 1rem;
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