<template>
  <el-form ref="menuDataRef" :rules="rules" :model="menuForm" class="pr-10">
    <!-- 菜单名称 -->
    <el-form-item :label="modular === 'master' ? '主菜单名称' : '子菜单名称'" prop="name">
      <el-input :model-value="menuForm.name" @input="handleInputChange('name', $event)"/>
    </el-form-item>

    <!-- 菜单类型 -->
    <el-form-item label="主菜单类型" prop="menuType" v-if="modular === 'master'">
      <el-radio-group :model-value="menuForm.menuType" @change="handleInputChange('menuType', $event)">
        <el-radio :label="1">不配置子菜单</el-radio>
        <el-radio :label="2">配置子菜单</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="" v-if="menuForm.menuType === 2 && modular === 'master'">
      <slot></slot>
    </el-form-item>

    <template v-if="menuForm.menuType === 1">
      <!-- 跳转链接 -->
      <el-form-item label="跳转链接" prop="visitType">
        <el-radio-group :model-value="menuForm.visitType" @change="handleInputChange('visitType', $event)">
          <el-radio label="view">网页</el-radio>
          <el-radio label="miniprogram">小程序</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 网址 -->
      <el-form-item label="网址" prop="url">
        <el-input :model-value="menuForm.url" @input="handleInputChange('url', $event)"/>
      </el-form-item>

      <template v-if="menuForm.visitType === 'miniprogram'">
        <!-- AppId -->
        <el-form-item label="AppId" prop="appId">
          <el-input :model-value="menuForm.appId" @input="handleInputChange('appId', $event)"/>
        </el-form-item>

        <!-- 路径 -->
        <el-form-item label="路径" prop="pagePath">
          <el-input :model-value="menuForm.pagePath" @input="handleInputChange('pagePath', $event)"/>
        </el-form-item>
      </template>
    </template>
  </el-form>
</template>

<script setup >
const menuForm = defineProps({
  modular: {
    type: String,
    default: 'master'
  },
  name: {
    type: String,
    default: ''
  },
  menuType: {
    type: Number,
    default: 1
  },
  visitType: {
    type: String,
    default: 'view'
  },
  url: {
    type: String,
    default: ''
  },
  appId: {
    type: String,
    default: ''
  },
  pagePath: {
    type: String,
    default: ''
  },
  menuRef: {
    type: Object,
    default: () => {
      return {}
    }
  }
});
const menuDataRef = ref();
// let menuForm = ref({ ...props })

const rules = reactive({
  name: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: ['blur', 'change']
    },
    {
      min: 1,
      max: 12,
      message: '长度限制12个字符',
      trigger: ['blur', 'change']
    }
  ],
  menuType: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: ['blur', 'change']
    }
  ],
  visitType: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: ['blur', 'change']
    }
  ],
  url: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: ['blur', 'change']
    },
    {
      pattern:
          /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
      message: '请输入合法的网址链接',
      trigger: ['blur', 'change']
    }
  ],
  appId: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: ['blur', 'change']
    }
  ],
  pagePath: [
    {
      required: true,
      message: '必填项不能为空',
      trigger: ['blur', 'change']
    }
  ]
})

const emit = defineEmits([
  'update:name',
  'update:menuType',
  'update:visitType',
  'update:url',
  'update:pagePath'
])
// 定义输入事件处理器
function handleInputChange(attrName, value) {
  switch (attrName) {
    case 'name':
      emit('update:name', value);
      break;
    case 'menuType':
      emit('update:menuType', value);
      break;
    case 'visitType':
      emit('update:visitType', value);
      break;
    case 'url':
      emit('update:url', value);
      break;
    case 'appId':
      emit('update:appId', value);
      break;
    case 'pagePath':
      emit('update:pagePath', value);
      break;
  }
}

defineExpose({menuDataRef});
</script>
<style lang="scss" scoped>
.el-form-item--default{
  margin-bottom: 18px;
}
</style>
