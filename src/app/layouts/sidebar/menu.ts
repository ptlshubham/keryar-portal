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
        icon: 'mdi mdi-desktop-mac-dashboard',
        link: '/',
    },
    {
        id: 3,
        label: 'Workfolio',
        icon: 'mdi mdi-briefcase-outline',
        subItems: [
            {
                id: 4,
                label: 'Clients',
                link: '/workfolio/clients',
                parentId: 3
            },
            {
                id: 5,
                label: 'Testimonials',
                link: '/workfolio/testimonials',
                parentId: 3
            },
            {
                id: 6,
                label: 'Portfolio',
                link: '/workfolio/portfolio',
                parentId: 3
            },
            {
                id: 7,
                label: 'Case-Studies',
                link: '/workfolio/casestudy',
                parentId: 3
            },
        ]
    },
    {
        id: 3,
        label: 'placement',
        icon: 'mdi mdi-briefcase-outline',
        subItems: [
            {
                id: 4,
                label: 'category',
                link: '/placement/category',
                parentId: 3
            },

        ]
    },
];

