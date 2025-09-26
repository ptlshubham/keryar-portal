import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'home',
        link: '/',
    },
    {
        id: 2,
        label: 'MENUITEMS.ELEMENTS.TEXT',
        icon: 'briefcase',
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.COMPONENTS.LIST.ALERTS',
                link: '/ui/alerts',
                parentId: 2
            },
            {
                id: 4,
                label: 'MENUITEMS.COMPONENTS.LIST.BUTTONS',
                link: '/ui/buttons',
                parentId: 2
            },
            {
                id: 5,
                label: 'MENUITEMS.COMPONENTS.LIST.CARDS',
                link: '/ui/cards',
                parentId: 2
            },
            {
                id: 6,
                label: 'MENUITEMS.COMPONENTS.LIST.CAROUSEL',
                link: '/ui/carousel',
                parentId: 2
            },
            {
                id: 7,
                label: 'MENUITEMS.COMPONENTS.LIST.DROPDOWNS',
                link: '/ui/dropdowns',
                parentId: 2
            },
            {
                id: 8,
                label: 'MENUITEMS.COMPONENTS.LIST.GRID',
                link: '/ui/grid',
                parentId: 2
            },
            {
                id: 9,
                label: 'MENUITEMS.COMPONENTS.LIST.IMAGES',
                link: '/ui/images',
                parentId: 2
            },
            {
                id: 10,
                label: 'MENUITEMS.COMPONENTS.LIST.MODALS',
                link: '/ui/modals',
                parentId: 2
            },
            {
                id: 11,
                label: 'MENUITEMS.COMPONENTS.LIST.PROGRESSBAR',
                link: '/ui/progressbars',
                parentId: 2
            },
            {
                id: 12,
                label: 'MENUITEMS.COMPONENTS.LIST.TABS',
                link: '/ui/tabs-accordions',
                parentId: 2
            },
            {
                id: 13,
                label: 'MENUITEMS.COMPONENTS.LIST.TYPOGRAPHY',
                link: '/ui/typography',
                parentId: 2
            },
            {
                id: 14,
                label: 'MENUITEMS.COMPONENTS.LIST.VIDEO',
                link: '/ui/video',
                parentId: 2
            },
            {
                id: 15,
                label: 'MENUITEMS.COMPONENTS.LIST.GENERAL',
                link: '/ui/general',
                parentId: 2
            },
            {
                id: 15,
                label: 'MENUITEMS.COMPONENTS.LIST.COLORS',
                link: '/ui/colors',
                parentId: 2
            }
        ]
    },
    {
        id: 16,
        label: 'MENUITEMS.APPS.TEXT',
        icon: 'grid',
        subItems: [
            {
                id: 17,
                label: 'MENUITEMS.APPS.LIST.CALENDAR',
                link: '/apps/calender',
                parentId: 16
            },
            {
                id: 18,
                label: 'MENUITEMS.APPS.LIST.CHAT',
                link: '/apps/chat',
                parentId: 16
            },
            {
                id: 19,
                label: 'MENUITEMS.APPS.LIST.EMAIL',
                icon: 'bx-receipt',
                subItems: [
                    {
                        id: 20,
                        label: 'MENUITEMS.APPS.LIST.INBOX',
                        link: '/apps/inbox',
                        parentId: 19
                    },
                    {
                        id: 21,
                        label: 'MENUITEMS.APPS.LIST.READEMAIL',
                        link: '/apps/read/1',
                        parentId: 19
                    },
                ]
            },
            {
                id: 22,
                label: 'MENUITEMS.APPS.LIST.INVOICES',
                icon: 'bx-receipt',
                subItems: [
                    {
                        id: 23,
                        label: 'MENUITEMS.APPS.LIST.INVOICELIST',
                        link: '/apps/invoice-list',
                        parentId: 22
                    },
                    {
                        id: 24,
                        label: 'MENUITEMS.APPS.LIST.INVOICEDETAIL',
                        link: '/apps/invoice-detail',
                        parentId: 22
                    },
                ]
            },
            {
                id: 25,
                label: 'MENUITEMS.APPS.LIST.CONTACTS',
                subItems: [
                    {
                        id: 26,
                        label: 'MENUITEMS.APPS.LIST.USERGRID',
                        link: '/apps/user-grid',
                        parentId: 25
                    },
                    {
                        id: 27,
                        label: 'MENUITEMS.APPS.LIST.USERLIST',
                        link: '/apps/user-list',
                        parentId: 25
                    },
                    {
                        id: 28,
                        label: 'MENUITEMS.APPS.LIST.PROFILE',
                        link: '/apps/profile',
                        parentId: 25
                    }
                ]
            }
        ]
    },
    {
        id: 29,
        label: 'MENUITEMS.COMPONENTS.TEXT',
        icon: 'box',
        subItems: [
            {
                id: 30,
                label: 'MENUITEMS.FORMS.TEXT',
                icon: 'box',
                badge: {
                    variant: 'danger',
                    text: 'MENUITEMS.FORMS.BADGE',
                },
                subItems: [
                    {
                        id: 31,
                        label: 'MENUITEMS.FORMS.LIST.ELEMENTS',
                        link: '/form/elements',
                        parentId: 30
                    },
                    {
                        id: 32,
                        label: 'MENUITEMS.FORMS.LIST.VALIDATION',
                        link: '/form/validation',
                        parentId: 30
                    },
                    {
                        id: 33,
                        label: 'MENUITEMS.FORMS.LIST.ADVANCED',
                        link: '/form/advanced',
                        parentId: 30
                    },
                    {
                        id: 34,
                        label: 'MENUITEMS.FORMS.LIST.EDITOR',
                        link: '/form/editor',
                        parentId: 30
                    },
                    {
                        id: 35,
                        label: 'MENUITEMS.FORMS.LIST.FILEUPLOAD',
                        link: '/form/uploads',
                        parentId: 30
                    },
                    {
                        id: 36,
                        label: 'MENUITEMS.FORMS.LIST.WIZARD',
                        link: '/form/wizard',
                        parentId: 30
                    },
                    {
                        id: 37,
                        label: 'MENUITEMS.FORMS.LIST.MASK',
                        link: '/form/mask',
                        parentId: 30
                    }
                ]
            },
            {
                id: 38,
                icon: 'sliders',
                label: 'MENUITEMS.TABLES.TEXT',
                subItems: [
                    {
                        id: 39,
                        label: 'MENUITEMS.TABLES.LIST.BASIC',
                        link: '/tables/basic',
                        parentId: 38
                    },
                    {
                        id: 40,
                        label: 'MENUITEMS.TABLES.LIST.ADVANCED',
                        link: '/tables/datatable',
                        parentId: 38
                    }
                ]
            },
            {
                id: 41,
                icon: 'pie-chart',
                label: 'MENUITEMS.CHARTS.TEXT',
                subItems: [
                    {
                        id: 42,
                        label: 'MENUITEMS.CHARTS.LIST.APEX',
                        link: '/chart/apex',
                        parentId: 41
                    },
                    {
                        id: 43,
                        label: 'MENUITEMS.CHARTS.LIST.ECHARTS',
                        link: '/chart/echart',
                        parentId: 41
                    },
                    {
                        id: 44,
                        label: 'MENUITEMS.CHARTS.LIST.CHARTJS',
                        link: '/chart/chartjs',
                        parentId: 41
                    }
                ]
            },
            {
                id: 45,
                label: 'MENUITEMS.ICONS.TEXT',
                icon: 'cpu',
                subItems: [
                    {
                        id: 46,
                        label: 'MENUITEMS.ICONS.LIST.BOXICONS',
                        link: '/icons/boxicons',
                        parentId: 45
                    },
                    {
                        id: 47,
                        label: 'MENUITEMS.ICONS.LIST.MATERIALDESIGN',
                        link: '/icons/materialdesign',
                        parentId: 45
                    },
                    {
                        id: 48,
                        label: 'MENUITEMS.ICONS.LIST.DRIPICONS',
                        link: '/icons/dripicons',
                        parentId: 45
                    },
                    {
                        id: 49,
                        label: 'MENUITEMS.ICONS.LIST.FONTAWESOME',
                        link: '/icons/fontawesome',
                        parentId: 45
                    },
                ]
            },
            {
                id: 50,
                label: 'MENUITEMS.MAPS.TEXT',
                icon: 'map',
                subItems: [
                    {
                        id: 51,
                        label: 'MENUITEMS.MAPS.LIST.GOOGLEMAP',
                        link: '/maps/google',
                        parentId: 50
                    },
                    {
                        id: 52,
                        label: 'MENUITEMS.MAPS.LIST.LEAFLET',
                        link: '/maps/leaflet',
                        parentId: 50
                    },
                    {
                        id: 52,
                        label: 'MENUITEMS.MAPS.LIST.AMCHARTS',
                        link: '/maps/amcharts',
                        parentId: 52,
                        badge: {
                            variant: 'danger',
                            text: 'MENUITEMS.APPS.BADGE',
                        },
                    }
                ]
            },
        ]
    },
    {
        id: 52,
        label: 'MENUITEMS.EXTRAPAGES.TEXT',
        icon: 'file-text',
        subItems: [
            {
                id: 53,
                label: 'MENUITEMS.AUTHENTICATION.TEXT',
                icon: 'users',
                subItems: [
                    {
                        id: 54,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN',
                        link: '/account/login',
                        parentId: 53
                    },
                    {
                        id: 55,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER',
                        link: '/account/register',
                        parentId: 53
                    },

                    {
                        id: 56,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD',
                        link: '/account/recoverpw',
                        parentId: 53
                    },
                    {
                        id: 57,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
                        link: '/account/look-screen',
                        parentId: 53
                    },
                    {
                        id: 58,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.LOGOUT',
                        link: '/account/logout',
                        parentId: 53
                    },
                    {
                        id: 59,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.CONFIRMMAIL',
                        link: '/account/confirm-mail',
                        parentId: 53
                    },
                    {
                        id: 60,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.EMAILVERIFICATION',
                        link: '/account/email-verification',
                        parentId: 53
                    },
                    {
                        id: 61,
                        label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION',
                        link: '/account/two-step-verification',
                        parentId: 53
                    }
                ]
            },
            {
                id: 62,
                label: 'MENUITEMS.UTILITY.TEXT',
                icon: 'file-text',
                subItems: [
                    {
                        id: 63,
                        label: 'MENUITEMS.PAGES.LIST.STARTER',
                        link: '/pages/starter',
                        parentId: 62
                    },
                    {
                        id: 64,
                        label: 'MENUITEMS.PAGES.LIST.MAINTENANCE',
                        link: '/pages/maintenance',
                        parentId: 62
                    },
                    {
                        id: 65,
                        label: 'Coming Soon',
                        link: '/pages/coming-soon',
                        parentId: 62
                    },
                    {
                        id: 66,
                        label: 'MENUITEMS.PAGES.LIST.TIMELINE',
                        link: '/pages/timeline',
                        parentId: 62
                    },
                    {
                        id: 67,
                        label: 'MENUITEMS.PAGES.LIST.FAQS',
                        link: '/pages/faqs',
                        parentId: 62
                    },
                    {
                        id: 68,
                        label: 'MENUITEMS.PAGES.LIST.PRICING',
                        link: '/pages/pricing',
                        parentId: 62
                    },
                    {
                        id: 69,
                        label: 'MENUITEMS.PAGES.LIST.ERROR404',
                        link: '/pages/404',
                        parentId: 62
                    },
                    {
                        id: 70,
                        label: 'MENUITEMS.PAGES.LIST.ERROR500',
                        link: '/pages/500',
                        parentId: 62
                    },
                ]
            },
        ]
    }

];

