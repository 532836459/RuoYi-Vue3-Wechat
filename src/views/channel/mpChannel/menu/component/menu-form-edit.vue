<template>
  <popup
      ref="menuFromPopupRef"
      async
      :clickModalClose="false"
      :title="`${modular === 'add' ? '新增' : '编辑'}子菜单`"
      @confirm="handleRules"
  >
    <MenuForm
        ref="menuFormEditRef"
        modular="secondary"
        v-model:name="form.name"
        v-model:visitType="form.visitType"
        v-model:url="form.url"
        v-model:appId="form.appId"
        v-model:pagePath="form.pagePath"
    ></MenuForm>
    <template #trigger>
      <slot></slot>
    </template>
  </popup>
</template>

<script setup>
import MenuForm from "./menu-form.vue";
import popup from "@/components/Popup/index.vue";

const emit = defineEmits(['add','edit'])

const props = defineProps({
  modular: {
    type: String,
    default: 'edit'
  },
  subItem: {
    type: Object,
    default: {}
  },
});
const menuFormEditRef = shallowRef()
const menuFromPopupRef = shallowRef()
const form = {
  name: '',
  visitType: 'view',
  url: '',
  appId: '',
  pagePath: ''
}
watchEffect(() => {
  if (Object.keys(props.subItem).length != 0) {
    for (const key in form) {
      //@ts-ignore
      form[key] = props.subItem[key]
    }
  }
})

// const handleRules = async () => {
//   await menuFormEditRef.value.menuFormRef.validate()
//   if (props.modular === 'edit') {
//     emit('edit', { ...form })
//   } else {
//     emit('add', { ...form })
//   }
//   menuFromPopupRef.value.close()
//   menuFormEditRef.value.menuFormRef.resetFields()
// }
const handleRules = () => {
  if (props.modular === 'edit') {
    emit('edit', { ...form })
  } else {
    emit('add', { ...form })
  }
  // menuFromPopupRef.value.close()
  // menuFormEditRef.value.menuFormRef.resetFields()
}
</script>

