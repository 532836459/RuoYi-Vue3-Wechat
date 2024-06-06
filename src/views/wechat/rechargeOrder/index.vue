<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户id" prop="naUserId">
        <el-input
          v-model="queryParams.naUserId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="充值单号" prop="orderSn">
        <el-input
          v-model="queryParams.orderSn"
          placeholder="请输入充值单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付方式" prop="payWay">
        <el-select
            v-model="queryParams.payWay"
            placeholder="请选择支付方式"
            clearable
            style="width: 150px"
        >
          <el-option
              v-for="dict in na_pay_way"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付状态" prop="payStatus">
        <el-select
            v-model="queryParams.payStatus"
            placeholder="请选择支付状态"
            clearable
            style="width: 150px"
        >
          <el-option
              v-for="dict in na_pay_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="rechargeOrderList">
      <el-table-column label="充值单号" align="center" prop="orderSn" />
      <el-table-column label="用户id" align="center" prop="naUserId" />
<!--      <el-table-column label="id" align="center" prop="id" />-->
      <el-table-column label="支付编号" align="center" prop="paySn" />
      <el-table-column label="支付方式" align="center" prop="payWay">
        <template #default="scope">
          <dict-tag :options="na_pay_way" :value="scope.row.payWay"/>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" align="center" prop="payStatus">
        <template #default="scope">
          <dict-tag :options="na_pay_status" :value="scope.row.payStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" align="center" prop="orderAmount" />
      <el-table-column label="提交时间" align="center" prop="createTime" width="160" />
      <el-table-column label="支付时间" align="center" prop="payTime" width="160" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['wechat:rechargeOrder:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['wechat:rechargeOrder:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script setup name="RechargeOrder">
import { listRechargeOrder,  delRechargeOrder} from "@/api/wechat/rechargeOrder";
const { proxy } = getCurrentInstance();

const { na_pay_way,na_pay_status } = proxy.useDict('na_pay_way','na_pay_status');

const rechargeOrderList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
        naUserId: null,
        orderSn: null,
        paySn: null,
        payWay: null,
        payStatus: null,
        payTime: null,
        orderAmount: null,
        transactionId: null,
        refundStatus: null,
        tenantId: null,
    orderByColumn: 'create_time',
    isAsc: 'desc'
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询充值订单列表 */
function getList() {
  loading.value = true;
  listRechargeOrder(queryParams.value).then(response => {
    rechargeOrderList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    naUserId: null,
    orderSn: null,
    paySn: null,
    payWay: null,
    payStatus: null,
    payTime: null,
    orderAmount: null,
    transactionId: null,
    refundStatus: null,
    tenantId: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("rechargeOrderRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除充值订单编号为"' + _ids + '"的数据项？').then(function() {
    return delRechargeOrder(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();
</script>
