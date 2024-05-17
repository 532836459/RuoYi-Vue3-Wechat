import {mpMenuList, mpMenuSave, mpMenuPublish} from "@/api/channel/wxMp";

export const menuRef = shallowRef();
// 菜单数据
const menuList = ref([]);
const menuIndex = ref(0);
// 校验
export const rules = reactive({
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
export const useMenuJs = (ref) => {
    if (ref) menuRef.value = ref
    return {
        menuList,
        menuIndex
    }
}
