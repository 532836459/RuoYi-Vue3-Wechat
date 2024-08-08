<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入文章标题"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="抓取链接" prop="url">
        <el-input
          v-model="queryParams.url"
          placeholder="请输入抓取链接"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate">
        <el-date-picker clearable
          v-model="queryParams.createDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择创建时间">
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
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['article:spiderArticle:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['article:spiderArticle:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['article:spiderArticle:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['article:spiderArticle:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="spiderArticleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="文章标题" align="center" prop="title" />
      <el-table-column label="抓取链接" align="center" prop="url" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['article:spiderArticle:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['article:spiderArticle:remove']">删除</el-button>
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

    <!-- 添加或修改文章抓取记录对话框 -->
    <el-dialog :title="title" v-model="open" width="650px" append-to-body>
      <el-form ref="spiderArticleRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="抓取链接" prop="url">
          <el-input v-model="form.url" placeholder="请输入抓取链接" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createDate">
          <el-date-picker clearable
            v-model="form.createDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择创建时间">
          </el-date-picker>
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

<script setup name="SpiderArticle">
import { listSpiderArticle, getSpiderArticle, delSpiderArticle, addSpiderArticle, updateSpiderArticle } from "@/api/article/spiderArticle";

const { proxy } = getCurrentInstance();

const spiderArticleList = ref([]);
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
    title: null,
    url: null,
    createDate: null,
    orderByColumn: 'create_time',
    isAsc: 'desc'
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询文章抓取记录列表 */
function getList() {
  loading.value = true;
  listSpiderArticle(queryParams.value).then(response => {
    spiderArticleList.value = response.rows;
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
    title: null,
    url: null,
    createDate: null
  };
  proxy.resetForm("spiderArticleRef");
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
  title.value = "添加文章抓取记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getSpiderArticle(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改文章抓取记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["spiderArticleRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateSpiderArticle(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSpiderArticle(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除文章抓取记录编号为"' + _ids + '"的数据项？').then(function() {
    return delSpiderArticle(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('article/spiderArticle/export', {
    ...queryParams.value
  }, `spiderArticle_${new Date().getTime()}.xlsx`)
}

getList();
</script>
