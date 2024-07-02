<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="菜单名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入菜单名称"
          clearable
          @keyup.enter="handleQuery"
        />
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
          v-hasPermi="['menu:menuConfig:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['menu:menuConfig:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['menu:menuConfig:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['menu:menuConfig:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="menuConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="菜单名称" align="center" prop="name" />
      <el-table-column label="菜单图标" align="center" prop="icon" />
      <el-table-column label="别名(路径)" align="center" prop="alias" />
      <el-table-column label="SEO关键字" align="center" prop="keywords" />
      <el-table-column label="SEO描述" align="center" prop="description" />
      <el-table-column label="菜单排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['menu:menuConfig:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['menu:menuConfig:remove']">删除</el-button>
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

    <!-- 添加或修改菜单配置对话框 -->
    <el-dialog :title="title" v-model="open" width="650px" append-to-body>
      <el-form ref="menuConfigRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="别名" prop="alias">
              <el-input v-model="form.alias" placeholder="请输入菜单路径别名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="链接配置" prop="menuConfig">
          <el-radio-group v-model="form.menuConfigSelect">
            <el-radio label="0" size="large" border>内部链接</el-radio>
            <el-radio label="1" size="large" border>自定义链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.menuConfigSelect === '0'">
          <el-form-item>
            <el-card shadow="hover" style="width: 100%;padding: 10px;min-height: 95px;">
              <el-alert title="注意：只能选择一个分类下的链接" type="info" show-icon :closable="false" style="margin-bottom: 10px;"/>
              <el-cascader style="width: 250px" collapse-tags :props="props" v-model="selectData" :options="categoryOptions" placeholder="请选择内部链接" />
            </el-card>
          </el-form-item>
        </template>
        <template v-if="form.menuConfigSelect === '1'">
          <el-form-item>
            <el-card shadow="hover" style="width: 100%;padding: 10px;min-height: 95px;">
              <div style="display: flex">
              <el-input v-model="customData" placeholder="请输入域名" clearable/></div>
            </el-card>
          </el-form-item>
        </template>
        <el-form-item label="菜单图标" prop="icon">
          <image-upload v-model="form.icon" :limit="1" :isShowTip="false"/>
        </el-form-item>
        <el-form-item label="SEO关键字" prop="keywords">
          <el-input v-model="form.keywords" placeholder="请输入SEO关键字" />
        </el-form-item>
        <el-form-item label="SEO描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入SEO描述" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort">
          <el-input-number v-model="form.sort" :min="1"/>
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

<script setup name="MenuConfig">
import { listMenuConfig, getMenuConfig, delMenuConfig, addMenuConfig, updateMenuConfig,selectAllCategory } from "@/api/menu/menuConfig";

const { proxy } = getCurrentInstance();

const menuConfigList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const categoryOptions = ref([])
const selectData = ref();
const customData = ref();
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    icon: null,
    keywords: null,
    description: null,
    sort: null,
    orderByColumn: 'sort',
    isAsc: 'desc'
  },
  rules: {
    name: [
      { required: true, message: "菜单名称不能为空", trigger: "blur" }
    ],
    alias: [
      { required: true, message: "别名(uri路径)不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const props = { multiple: true }

/** 查询菜单配置列表 */
function getList() {
  loading.value = true;
  listMenuConfig(queryParams.value).then(response => {
    menuConfigList.value = response.rows;
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
    name: null,
    icon: null,
    alias: null,
    menuConfig: null,
    keywords: null,
    description: null,
    sort: null,
    createTime: null,
    updateTime: null
  };
  selectData.value = null;
  customData.value = null;
  proxy.resetForm("menuConfigRef");
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
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  form.value.menuConfigSelect = '0';
  open.value = true;
  title.value = "添加菜单配置";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getMenuConfig(_id).then(response => {
    form.value = response.data;
    const configJson = JSON.parse(form.value.menuConfig)
    form.value.menuConfigSelect = configJson.menuConfigSelect;
    if (form.value.menuConfigSelect === '0') {
      selectData.value = configJson.data;
    }else {
      customData.value = configJson.data;
    }
    open.value = true;
    title.value = "修改菜单配置";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["menuConfigRef"].validate(valid => {
    if (valid) {
      const menuConfig = {};
      if (form.value.menuConfigSelect === '0') {
        let categoryList = selectData.value.map(item => {
          return item[0];
        });
        categoryList = Array.from(new Set(categoryList));
        menuConfig.data = selectData.value;
        menuConfig.categoryList = categoryList;
      } else if (form.value.menuConfigSelect === '1') {
        menuConfig.data = customData.value;
      }
      menuConfig.menuConfigSelect = form.value.menuConfigSelect;
      form.value.menuConfig = JSON.stringify(menuConfig);

      if (form.value.id != null) {
        updateMenuConfig(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addMenuConfig(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 查询所有分类页列表 */
function getAllCategoryList() {
  selectAllCategory().then(response =>{
    categoryOptions.value = response.data;
  })
}


/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除菜单配置编号为"' + _ids + '"的数据项？').then(function() {
    return delMenuConfig(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('menu/menuConfig/export', {
    ...queryParams.value
  }, `menuConfig_${new Date().getTime()}.xlsx`)
}

getList();
getAllCategoryList();
</script>
