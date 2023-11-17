<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="网站名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入网站名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="自动采集" prop="commonStatus">
        <el-select v-model="queryParams.commonStatus" clearable>
          <el-option
            v-for="dict in nana_common_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="自动同步" prop="autoSync">
        <el-select v-model="queryParams.autoSync" clearable>
          <el-option
              v-for="dict in nana_auto_sync"
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
          v-hasPermi="['website:manage:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['website:manage:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['website:manage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['website:manage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="manageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" width="55" />
      <el-table-column label="域名" align="center" prop="url" width="200" />
      <el-table-column label="网站名称" align="center" prop="title" />
      <el-table-column label="分类名称" align="center" prop="categoryName" />
      <el-table-column label="项目单价" align="center" prop="price" width="100" />
      <el-table-column label="VIP折扣" align="center" prop="vipPrice" width="100" />
      <el-table-column label="状态" align="center" prop="commonStatus" width="100">
        <template #default="scope">
          <dict-tag :options="nana_common_status" :value="scope.row.commonStatus"/>
        </template>
      </el-table-column>
<!--      <el-table-column label="过期时间" align="center" prop="expireTime" width="180">-->
<!--        <template #default="scope">-->
<!--          <span>{{ parseTime(scope.row.expireTime, '{y}-{m}-{d}') }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="自动同步" align="center" prop="autoSync" width="100">
        <template #default="scope">
          <dict-tag :options="nana_auto_sync" :value="scope.row.autoSync"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['website:manage:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['website:manage:remove']">删除</el-button>
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

    <!-- 添加或修改站点管理对话框 -->
    <el-dialog :title="title" v-model="open" width="650px" append-to-body>
      <el-form ref="manageRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="域名" prop="url">
              <el-input v-model="form.url" placeholder="例子：https://www.nanaxm.cn" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="网站名称" prop="title">
              <el-input v-model="form.title" placeholder="请输入网站名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="同步密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入同步密码" />
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="9">
            <el-form-item label="分类名称" prop="categoryName">
              <el-select placeholder="请选择分类名称" />
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="1">
            <el-tooltip content="需要填写完域名和正确的同步密码才能获取成功" placement="top" >
              <el-button round type="primary" @click="getCategory">点击获取分类</el-button>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-form-item label="文章内容末尾拼接">
          <editor v-model="form.appendContent" :min-height="192"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目单价" prop="price">
              <el-input v-model="form.price" placeholder="请输入项目单价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="VIP折扣" prop="vipPrice">
              <el-input v-model="form.vipPrice" placeholder="请输入VIP折扣，默认0元" />
            </el-form-item>
          </el-col>
        </el-row>
       <el-row>
         <el-col :span="12">
           <el-form-item label="状态" prop="commonStatus">
             <el-radio-group v-model="form.commonStatus">
               <el-radio
                   v-for="dict in nana_common_status"
                   :key="dict.value"
                   :label="dict.value"
               >{{dict.label}}</el-radio>
             </el-radio-group>
           </el-form-item>
         </el-col>
         <el-col :span="12">
           <el-form-item label="自动同步" prop="autoSync">
             <el-radio-group v-model="form.autoSync">
               <el-radio
                   v-for="dict in nana_auto_sync"
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

<script setup name="Manage">
import { listManage, getManage, delManage, addManage, updateManage } from "@/api/website/manage";

const { proxy } = getCurrentInstance();
const {nana_common_status, nana_auto_sync} = proxy.useDict('nana_common_status', 'nana_auto_sync');

const manageList = ref([]);
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
    userId: null,
    expireTime: null,
    autoSync: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/**
 * 获取wordpress分类
 */
function getCategory() {
  console.log(form.value.url);
}

/** 查询站点管理列表 */
function getList() {
  loading.value = true;
  listManage(queryParams.value).then(response => {
    manageList.value = response.rows;
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
    password: null,
    categoryId: null,
    categoryName: null,
    appendContent: null,
    price: null,
    vipPrice: null,
    commonStatus: null,
    userId: null,
    createTime: null,
    updateTime: null,
    expireTime: null,
    autoSync: null
  };
  proxy.resetForm("manageRef");
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
  title.value = "添加站点管理";
  form.value.commonStatus = "1";
  form.value.autoSync = "1";
  form.value.price = "9.8";
  form.value.vipPrice = "0";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getManage(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改站点管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["manageRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateManage(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addManage(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除站点管理编号为"' + _ids + '"的数据项？').then(function() {
    return delManage(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('website/manage/export', {
    ...queryParams.value
  }, `manage_${new Date().getTime()}.xlsx`)
}

getList();
</script>
