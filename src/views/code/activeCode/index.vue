<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="站点表id" prop="websiteId">
        <el-input
          v-model="queryParams.websiteId"
          placeholder="请输入站点表id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="激活码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入激活码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="激活时间" prop="activeTime">
        <el-date-picker clearable
          v-model="queryParams.activeTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择激活时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="CirclePlus"
          @click="batchAdd"
          v-hasPermi="['code:activeCode:add']"
        >批量生成</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="Plus"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['code:activeCode:add']"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['code:activeCode:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['code:activeCode:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['code:activeCode:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="activeCodeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="站点表id" align="center" prop="websiteId" />
      <el-table-column label="激活码" align="center" prop="code" />
      <el-table-column label="激活时间" align="center" prop="activeTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.activeTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['code:activeCode:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['code:activeCode:remove']">删除</el-button>
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

<!--    批量新增激活码-->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="activeCodeRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="生成数量" prop="number">
          <el-input v-model="form.number" placeholder="请输入生成数量" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加或修改激活码对话框 -->
<!--    <el-dialog :title="title" v-model="open" width="500px" append-to-body>-->
<!--      <el-form ref="activeCodeRef" :model="form" :rules="rules" label-width="80px">-->
<!--        <el-form-item label="站点表id" prop="websiteId">-->
<!--          <el-input v-model="form.websiteId" placeholder="请输入站点表id" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="激活码" prop="code">-->
<!--          <el-input v-model="form.code" placeholder="请输入激活码" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="激活时间" prop="activeTime">-->
<!--          <el-date-picker clearable-->
<!--            v-model="form.activeTime"-->
<!--            type="date"-->
<!--            value-format="YYYY-MM-DD"-->
<!--            placeholder="请选择激活时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="备注" prop="remark">-->
<!--          <el-input v-model="form.remark" placeholder="请输入备注" />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <template #footer>-->
<!--        <div class="dialog-footer">-->
<!--          <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--          <el-button @click="cancel">取 消</el-button>-->
<!--        </div>-->
<!--      </template>-->
<!--    </el-dialog>-->
  </div>
</template>

<script setup name="ActiveCode">
import { listActiveCode, getActiveCode, delActiveCode, addActiveCode, updateActiveCode } from "@/api/code/activeCode";

const { proxy } = getCurrentInstance();

const activeCodeList = ref([]);
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
    websiteId: null,
    code: null,
    activeTime: null,
    orderByColumn: 'createTime',
    isAsc: 'desc'
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询激活码列表 */
function getList() {
  loading.value = true;
  listActiveCode(queryParams.value).then(response => {
    activeCodeList.value = response.rows;
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
    websiteId: null,
    code: null,
    createTime: null,
    updateTime: null,
    activeTime: null,
    remark: null,
    number: 10
  };
  proxy.resetForm("activeCodeRef");
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

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 批量生成按钮操作 */
function batchAdd() {
  reset();
  open.value = true;
  title.value = "批量生成激活码";
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加激活码";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getActiveCode(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改激活码";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["activeCodeRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateActiveCode(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addActiveCode(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除激活码编号为"' + _ids + '"的数据项？').then(function() {
    return delActiveCode(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('code/activeCode/export', {
    ...queryParams.value
  }, `activeCode_${new Date().getTime()}.xlsx`)
}

getList();
</script>
