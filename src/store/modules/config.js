import { websiteDetail } from "@/api/system/domainConfig";

const useConfigStore = defineStore(
    'config',
    {
        state: () => ({
            name: '',
            logo: '',
            favicon: '',
            loginImg: '',
            copyright: ''
        }),
        actions: {
            getConfig(){
                return new Promise((resolve, reject) => {
                    websiteDetail().then(res => {
                        this.name = res.data.name;
                        this.logo = res.data.logo;
                        if (this.logo !== undefined && this.logo.indexOf('http') === -1) {
                            this.logo = import.meta.env.VITE_APP_BASE_API + this.logo;
                        }
                        this.favicon = res.data.favicon;
                        if (this.favicon !== undefined && this.favicon.indexOf('http') === -1) {
                            this.favicon = import.meta.env.VITE_APP_BASE_API + this.favicon;
                        }
                        this.loginImg = res.data.loginImg;
                        if (this.loginImg !== undefined && this.loginImg.indexOf('http') === -1) {
                            this.loginImg = import.meta.env.VITE_APP_BASE_API + this.loginImg;
                        }
                        this.copyright = res.data.copyright;
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
        }
    })

export default useConfigStore
