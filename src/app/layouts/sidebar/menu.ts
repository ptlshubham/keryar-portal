import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'home',
        link: '/',
    },
    {
        id: 3,
        label: 'MENUITEMS.APPS.TEXT',
        icon: 'grid',
        subItems: [
            {
                id: 4,
                label: 'MENUITEMS.APPS.LIST.CALENDAR',
                link: '/apps/calender',
                parentId: 3
            },
            {
                id: 5,
                label: 'MENUITEMS.APPS.LIST.CHAT',
                link: '/apps/chat',
                parentId: 3
            },
            {
                id: 6,
                label: 'MENUITEMS.APPS.LIST.EMAIL',
                icon: 'bx-receipt',
                subItems: [
                    {
                        id: 7,
                        label: 'MENUITEMS.APPS.LIST.INBOX',
                        link: '/apps/inbox',
                        parentId: 6
                    },
                    {
                        id: 8,
                        label: 'MENUITEMS.APPS.LIST.READEMAIL',
                        link: '/apps/read/1',
                        parentId: 6
                    },
                ]
            },
            {
                id: 9,
                label: 'MENUITEMS.APPS.LIST.INVOICES',
                icon: 'bx-receipt',
                subItems: [
                    {
                        id: 10,
                        label: 'MENUITEMS.APPS.LIST.INVOICELIST',
                        link: '/apps/invoice-list',
                        parentId: 9
                    },
                    {
                        id: 11,
                        label: 'MENUITEMS.APPS.LIST.INVOICEDETAIL',
                        link: '/apps/invoice-detail',
                        parentId: 9
                    },
                ]
            },
            {
                id: 12,
                label: 'MENUITEMS.APPS.LIST.CONTACTS',
                subItems: [
                    {
                        id: 13,
                        label: 'MENUITEMS.APPS.LIST.USERGRID',
                        link: '/apps/user-grid',
                        parentId: 12
                    },
                    {
                        id: 14,
                        label: 'MENUITEMS.APPS.LIST.USERLIST',
                        link: '/apps/user-list',
                        parentId: 12
                    },
                    {
                        id: 15,
                        label: 'MENUITEMS.APPS.LIST.PROFILE',
                        link: '/apps/profile',
                        parentId: 12
                    }
                ]
            },
            {
                id: 12,
                label: 'MENUITEMS.APPS.LIST.BLOG',
                badge: {
                    variant: 'danger',
                    text: 'MENUITEMS.APPS.BADGE',
                },
                subItems: [
                    {
                        id: 13,
                        label: 'MENUITEMS.APPS.LIST.BLOGGRID',
                        link: '/apps/blog-grid',
                        parentId: 12
                    },
                    {
                        id: 14,
                        label: 'MENUITEMS.APPS.LIST.BLOGLIST',
                        link: '/apps/blog-list',
                        parentId: 12
                    },
                    {
                        id: 15,
                        label: 'MENUITEMS.APPS.LIST.BLOGDETAILS',
                        link: '/apps/blog-detail',
                        parentId: 12
                    }
                ]
            }
        ]
    },
];

