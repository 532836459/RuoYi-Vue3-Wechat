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
      <el-form-item label="网站状态" prop="commonStatus">
        <el-select v-model="queryParams.commonStatus" placeholder="请选择网站状态" clearable>
          <el-option
            v-for="dict in na_common_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="首页显示" prop="indexShow">
        <el-select v-model="queryParams.indexShow" clearable>
          <el-option
              v-for="dict in na_index_show"
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
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['website:tools:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['website:tools:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['website:tools:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="toolsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="描述" align="center" prop="desc" show-overflow-tooltip/>
      <el-table-column label="链接" align="center" prop="url" show-overflow-tooltip/>
      <el-table-column label="logo图" align="center" prop="logo" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.logo" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="网站状态" align="center" prop="commonStatus">
        <template #default="scope">
          <dict-tag :options="na_common_status" :value="scope.row.commonStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="首页显示" align="center" prop="indexShow">
        <template #default="scope">
          <dict-tag :options="na_index_show" :value="scope.row.indexShow"/>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['website:tools:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['website:tools:remove']">删除</el-button>
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

    <!-- 添加或修改免费工具对话框 -->
    <el-dialog :title="title" v-model="open" width="650px" append-to-body>
      <el-form ref="toolsRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述" prop="desc">
              <el-input v-model="form.desc" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="链接地址" prop="url">
              <el-input v-model="form.url" placeholder="请输入链接地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="网站排序" prop="sort">
              <el-input-number v-model="form.sort" :min="1"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="logo图" prop="logo">
          <image-upload v-model="form.logo" :limit="1" :isShowTip="false"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="网站状态" prop="commonStatus">
              <el-radio-group v-model="form.commonStatus">
                <el-radio
                    v-for="dict in na_common_status"
                    :key="dict.value"
                    :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首页显示" prop="indexShow">
              <el-radio-group v-model="form.indexShow">
                <el-radio
                    v-for="dict in na_index_show"
                    :key="dict.value"
                    :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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

<script setup name="Tools">
import { listTools, getTools, delTools, addTools, updateTools } from "@/api/website/tools";

const { proxy } = getCurrentInstance();
const { na_common_status,na_index_show } = proxy.useDict('na_common_status','na_index_show');

const toolsList = ref([]);
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
    commonStatus: null,
    indexShow: null,
    orderByColumn: 'create_time',
    isAsc: 'desc'
  },
  rules: {
    title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
    url: [{ required: true, message: "链接地址不能为空", trigger: "blur" }],
    logo: [{ required: true, message: "Logo不能为空", trigger: "blur" }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询免费工具列表 */
function getList() {
  loading.value = true;
  listTools(queryParams.value).then(response => {
    toolsList.value = response.rows;
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
    desc: null,
    logo: null,
    url: null,
    sort: 1,
    commonStatus: "1",
    indexShow: "1",
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("toolsRef");
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
  title.value = "添加免费工具";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getTools(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改免费工具";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["toolsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateTools(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTools(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除免费工具编号为"' + _ids + '"的数据项？').then(function() {
    return delTools(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('website/tools/export', {
    ...queryParams.value
  }, `tools_${new Date().getTime()}.xlsx`)
}

getList();
</script>
