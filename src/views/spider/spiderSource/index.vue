<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="同步状态" prop="syncStatus">
        <el-select v-model="queryParams.syncStatus" clearable>
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
          @click="batchSync"
          v-hasPermi="['spider:spiderSource:add']"
        >一键同步</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['spider:spiderSource:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['spider:spiderSource:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['spider:spiderSource:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['spider:spiderSource:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="spiderSourceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" width="55"/>
      <el-table-column label="抓取url" align="center" prop="url" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="内容" align="center" prop="content" show-overflow-tooltip />
      <el-table-column label="所属分类" align="center" prop="category">
        <template #default="scope">
          <dict-tag :options="nana_category" :value="scope.row.category ? scope.row.category.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="百度网盘链接" align="center" prop="downUrl" show-overflow-tooltip />
      <el-table-column label="同步状态" align="center" prop="syncStatus">
        <template #default="scope">
          <dict-tag :options="sync_status" :value="scope.row.syncStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['spider:spiderSource:edit']">修改</el-button>
          <el-button link type="primary" icon="Refresh" @click="handleSync(scope.row)" v-hasPermi="['spider:spiderSource:edit']">同步</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['spider:spiderSource:remove']">删除</el-button>
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

    <!-- 添加或修改中创采集对话框 -->
    <el-dialog :title="title" v-model="open" width="610px" append-to-body>
      <el-form ref="spiderSourceRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="网盘链接" prop="downUrl">
          <el-input v-model="form.downUrl" placeholder="请输入百度网盘链接" type="textarea" :rows="3" />
        </el-form-item>
        <el-row>
          <el-col :span="16">
            <el-form-item label="所属分类" prop="category">
              <el-checkbox-group v-model="form.category" size="small">
                <el-checkbox-button
                    v-for="dict in nana_category"
                    :key="dict.value"
                    :label="dict.value">
                  {{dict.label}}
                </el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="syncStatus">
              <el-select v-model="form.syncStatus" size="small">
                <el-option
                    v-for="dict in sync_status"
                    :key="dict.value"
                    :label="dict.label"
                    :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192" :height="250"/>
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

<script setup name="SpiderSource">
import { listSpiderSource, getSpiderSource, delSpiderSource, addSpiderSource, updateSpiderSource,syncSpiderSource,batchSyncSource } from "@/api/spider/spiderSource";

const { proxy } = getCurrentInstance();
const { sync_status, nana_category } = proxy.useDict('sync_status', 'nana_category');

const spiderSourceList = ref([]);
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
    url: null,
    title: null,
    category: null,
    content: null,
    downUrl: null,
    syncStatus: null,
    orderByColumn: 'createTime',
    isAsc: 'desc'
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询中创采集列表 */
function getList() {
  loading.value = true;
  listSpiderSource(queryParams.value).then(response => {
    spiderSourceList.value = response.rows;
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
    url: null,
    title: null,
    content: null,
    category: [],
    downUrl: null,
    imageAddr: null,
    syncStatus: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("spiderSourceRef");
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
  title.value = "添加中创采集";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getSpiderSource(_id).then(response => {
    form.value = response.data;
    form.value.category = form.value.category.split(",");
    open.value = true;
    title.value = "修改中创采集";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["spiderSourceRef"].validate(valid => {
    if (valid) {
      console.log(form.value.category);
      form.value.category = form.value.category.join(",");
      if (form.value.id != null) {
        updateSpiderSource(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSpiderSource(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除中创采集编号为"' + _ids + '"的数据项？').then(function() {
    return delSpiderSource(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 同步按钮操作 */
function handleSync(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认同步中创采集编号为"' + _ids + '"的数据项？').then(function() {
    return syncSpiderSource(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("同步成功");
  }).catch(() => {});
}
/** 一键同步操作 */
function batchSync() {
  proxy.$modal.confirm('是否确认一键同步？').then(function() {
    return batchSyncSource();
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("同步成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('spider/spiderSource/export', {
    ...queryParams.value
  }, `spiderSource_${new Date().getTime()}.xlsx`)
}

getList();
</script>
