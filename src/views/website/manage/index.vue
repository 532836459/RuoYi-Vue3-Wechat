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
      <el-table-column label="默认分类" align="center" prop="categoryName" />
      <el-table-column label="项目单价" align="center" prop="price" width="100" />
      <el-table-column label="VIP折扣" align="center" prop="vipPrice" width="100" />
      <el-table-column label="状态" align="center" prop="commonStatus" width="100">
        <template #default="scope">
          <dict-tag :options="nana_common_status" :value="scope.row.commonStatus"/>
        </template>
      </el-table-column>
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
            <el-form-item label="默认分类" prop="categoryId">
              <el-select placeholder="请选择默认分类" v-model="form.categoryId"
                         @change="changeWordpressCategory">
                <el-option
                    v-for="item in wordpressCategory"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="1">
            <el-tooltip content="需要填写完域名才能获取成功" placement="top" >
              <el-button round type="primary" @click="getCategory">点击获取分类</el-button>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="自动项目" prop="autoProjectId">
              <el-select v-model="form.autoProjectId"
                         @change="changeAutoCategory" clearable @clear="clearAutoProject">
                <el-option
                    v-for="item in wordpressCategory"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="网站源码" prop="websiteSourceId">
              <el-select v-model="form.websiteSourceId"
                         @change="changeWebsiteCategory" clearable @clear="clearWebsiteSource">
                <el-option
                    v-for="item in wordpressCategory"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="TIKTOK" prop="tiktokId">
              <el-select v-model="form.tiktokId"
                         @change="changeTiktokCategory" clearable @clear="clearTiktok">
                <el-option
                    v-for="item in wordpressCategory"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="margin: 10px auto">
            <el-tooltip content="配置后会自动同步-自动项目，tiktok课程，网站源码等分类" effect="dark" placement="top">
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-form-item label="文章内容末尾拼接">
          <el-input v-model="form.appendContent" type="textarea" :rows="5" />
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
import {listManage, getManage, delManage, addManage, updateManage, getWordpressCategory} from "@/api/website/manage";
import {InfoFilled} from "@element-plus/icons-vue";

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
const wordpressCategory = ref([]);
const defaultAppend = "<p style=\"text-align: center;\"><span style=\"color: #ff0000;\"><strong>详细教程和视频内容请看下方隐藏内容</strong></span></p>\n" +
    "<p style=\"text-align: center;\"><strong>会员全站资源免费获取，<span style=\"text-decoration: underline; color: #0000ff;\"><a style=\"color: #0000ff; text-decoration: underline;\" href=\"/598.html\">点击查看会员权益</a></span></strong></p>\n" +
    "<p style=\"text-align: center;\"><strong>普通用户可在下方单独购买课程！</strong></p>";

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: null,
    commonStatus: null,
    userId: null,
    expireTime: null,
    autoSync: null,
    orderByColumn: 'createTime',
    isAsc: 'desc'
  },
  rules: {
    url: [{ required: true, message: "域名不能为空", trigger: "blur" }],
    title: [{ required: true, message: "网站名称不能为空", trigger: "blur" }],
    password: [{ required: true, message: "同步密码不能为空", trigger: "blur" }],
    categoryId: [{ required: true, message: "所属分类不能为空", trigger: "blur" }],
    price: [{ required: true, message: "项目单价不能为空", trigger: "blur" }],
    vipPrice: [{ required: true, message: "VIP折扣不能为空", trigger: "blur" }],
  }
});

const { queryParams, form, rules } = toRefs(data);

/**
 * 获取wordpress分类
 */
function getCategory() {
  if (form.value.url == null || form.value.url.trim() === '') {
    proxy.$modal.msgWarning("请先输入域名");
    return;
  }
  getWordpressCategory(form.value).then(response =>{
    proxy.$modal.msgSuccess("获取分类成功");
    wordpressCategory.value = response.data;
  });
}

function changeWordpressCategory(event) {
  for (let i in wordpressCategory.value) {
    if (wordpressCategory.value[i].id === event) {
      form.value.categoryName = wordpressCategory.value[i].name;
      break;
    }
  }
}

function changeAutoCategory(event) {
  for (let i in wordpressCategory.value) {
    if (wordpressCategory.value[i].id === event) {
      form.value.autoProjectName = wordpressCategory.value[i].name;
      break;
    }
  }
}

function changeWebsiteCategory(event) {
  for (let i in wordpressCategory.value) {
    if (wordpressCategory.value[i].id === event) {
      form.value.websiteSourceName = wordpressCategory.value[i].name;
      break;
    }
  }
}

function changeTiktokCategory(event) {
  for (let i in wordpressCategory.value) {
    if (wordpressCategory.value[i].id === event) {
      form.value.tiktokName = wordpressCategory.value[i].name;
      break;
    }
  }
}

function clearAutoProject() {
  form.value.autoProjectId = '';
  form.value.autoProjectName = '';
}

function clearWebsiteSource() {
  form.value.websiteSourceId = '';
  form.value.websiteSourceName = '';
}
function clearTiktok() {
  form.value.tiktokId = "";
  form.value.tiktokName = "";
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
    autoSync: null,
    autoProjectId: null,
    autoProjectName: null,
    websiteSourceId: null,
    websiteSourceName: null,
    tiktokId: null,
    tiktokName: null
  };
  wordpressCategory.value = null;
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
  form.value.appendContent = defaultAppend;
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
    wordpressCategory.value = [{
      'id': form.value.categoryId,
      'name': form.value.categoryName
    },{
      'id': form.value.autoProjectId,
      'name': form.value.autoProjectName
    },{
      'id': form.value.websiteSourceId,
      'name': form.value.websiteSourceName
    },{
      'id': form.value.tiktokId,
      'name': form.value.tiktokName
    }];
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
