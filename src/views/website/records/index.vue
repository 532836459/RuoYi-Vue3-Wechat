<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属站点" prop="websiteId">
        <el-input
          v-model="queryParams.websiteId"
          placeholder="请选择"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="同步状态" prop="syncStatus">
        <el-select v-model="queryParams.syncStatus" placeholder="请选择" clearable>
          <el-option
            v-for="dict in sync_status"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Refresh"
            :disabled="multiple"
            @click="handleSync"
        >同步</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['website:records:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['website:records:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" width="55"/>
      <el-table-column label="所属站点" align="center" prop="websiteTitle" width="150"/>
      <el-table-column label="标题" align="center" prop="title"/>
      <el-table-column label="内容" align="center" prop="content" show-overflow-tooltip/>
      <el-table-column label="网盘链接" align="center" prop="downUrl"/>
      <el-table-column label="同步状态" align="center" prop="syncStatus" width="100">
        <template #default="scope">
          <dict-tag :options="sync_status" :value="scope.row.syncStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="95" prop="createTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
        <el-table-column label="更新时间" align="center" width="95" prop="updateTime">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="getSpiderDetail(scope.row)">查看</el-button>
          <el-button link type="primary" icon="Refresh" @click="handleSync(scope.row)">同步</el-button>
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

<!--    &lt;!&ndash; 添加或修改同步管理对话框 &ndash;&gt;-->
<!--    <el-dialog :title="title" v-model="open" width="500px" append-to-body>-->
<!--      <el-form ref="recordsRef" :model="form" :rules="rules" label-width="80px">-->
<!--        <el-form-item label="站点表id" prop="websiteId">-->
<!--          <el-input v-model="form.websiteId" placeholder="请输入站点表id" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="爬虫表id" prop="spiderId">-->
<!--          <el-input v-model="form.spiderId" placeholder="请输入爬虫表id" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="同步状态【0：未同步  1：同步成功 2：同步失败】" prop="syncStatus">-->
<!--          <el-radio-group v-model="form.syncStatus">-->
<!--            <el-radio-->
<!--              v-for="dict in sync_status"-->
<!--              :key="dict.value"-->
<!--              :label="parseInt(dict.value)"-->
<!--            >{{dict.label}}</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="用户表id" prop="userId">-->
<!--          <el-input v-model="form.userId" placeholder="请输入用户表id" />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <template #footer>-->
<!--        <div class="dialog-footer">-->
<!--          <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--          <el-button @click="cancel">取 消</el-button>-->
<!--        </div>-->
<!--      </template>-->
<!--    </el-dialog>-->

    <!-- 查看详情对话框 -->
    <el-dialog :title="title" v-model="showDetail" width="850px" append-to-body>
      <el-form :model="form" label-width="90px">
        <el-form-item label="标题：">{{ form.title }}</el-form-item>
        <el-row>
          <el-col :span="16">
            <el-form-item label="网盘链接：">
              {{form.downUrl}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="同步状态：">
              <div v-if="form.syncStatus == 0"><el-tag type="info">未同步</el-tag></div>
              <div v-else-if="form.syncStatus == 1"><el-tag type="success">同步成功</el-tag></div>
              <div v-else-if="form.syncStatus == 2"><el-tag type="danger">同步失败</el-tag></div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="内容：">
          <editor v-model="form.content"></editor>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDetail">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Records">
import {listRecords, getRecords, delRecords, addRecords, updateRecords, sync} from "@/api/website/records";

const { proxy } = getCurrentInstance();
const { sync_status } = proxy.useDict('sync_status');

const recordsList = ref([]);
const open = ref(false);
const showDetail = ref(false);
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
    spiderId: null,
    syncStatus: null,
    userId: null,
    orderByColumn: 'createTime',
    isAsc: 'desc'
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询同步管理列表 */
function getList() {
  loading.value = true;
  listRecords(queryParams.value).then(response => {
    recordsList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 关闭按钮
function closeDetail() {
  showDetail.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    websiteId: null,
    spiderId: null,
    syncStatus: null,
    createTime: null,
    updateTime: null,
    userId: null
  };
  proxy.resetForm("recordsRef");
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

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加同步管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getRecords(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改同步管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["recordsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateRecords(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRecords(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除同步管理编号为"' + _ids + '"的数据项？').then(function() {
    return delRecords(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('website/records/export', {
    ...queryParams.value
  }, `records_${new Date().getTime()}.xlsx`)
}

/** 查看采集数据详情 */
function getSpiderDetail(row) {
  reset();
  const _id = row.id || ids.value
  getRecords(_id).then(response => {
    form.value = response.data;
    console.log(form.value);
    showDetail.value = true;
    title.value = "查看采集数据详情";
  });
}

function handleSync(row){
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认同步管理编号为"' + _ids + '"的数据项？').then(function() {
    return sync(_ids);
  }).then(response => {
    console.log(response);
    getList();
    proxy.$modal.msgSuccess("同步成功");
  }).catch(() => {});
}

getList();
</script>
