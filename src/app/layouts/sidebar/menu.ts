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
                label: 'Case Studies',
                link: '/workfolio/casestudy',
                parentId: 3
            },
        ]
    },
    // {
    //     id: 4,
    //     label: 'Quetions Set',
    //     icon: 'mdi mdi-briefcase-outline',
    //     subItems: [
    //         {
    //             id: 9,
    //             label: 'Category',
    //             link: '/placement/category',
    //             parentId: 8
    //         },
    //         {
    //             id: 9,
    //             label: 'Quetions',
    //             link: '/placement/quetions',
    //             parentId: 8
    //         },
    //     ]
    // },

    {
        id: 4,
        label: 'Blog',
        icon: 'mdi mdi-post-outline', // 📰 Blog section icon
        subItems: [
            {
                id: 4,
                label: 'Add blog',
                link: '/blog/add-blog',
                parentId: 3
            },
        ]
    },
    // {
    //     id: 6,
    //     label: 'career',
    //     icon: 'mdi mdi-briefcase-outline',
    //     subItems: [
    //         {
    //             id: 10,
    //             label: 'Job Opening',
    //             link: '/career/job-opening',
    //             parentId: 10
    //         },
    //     ]
    // },

    {
        id: 5,
        label: 'Connect',
        icon: 'mdi mdi-account-multiple-outline', // 🤝 Networking / Contact section
        subItems: [
            {
                id: 11,
                label: 'Internship Form List',
                link: '/connect/internship',
                parentId: 11
            },
            {
                id: 12,
                label: 'Contact us',
                link: '/connect/contact-us',
                parentId: 12
            },
            {
                id: 12,
                label: 'Inquiry Form List',
                link: '/call-to-action',
                parentId: 12
            },
        ]
    },
    {
        id: 6,
        label: 'Questions Set',
        icon: 'mdi mdi-help-circle-outline', // ❓Questions category
        subItems: [
            {
                id: 9,
                label: 'Category',
                link: '/placement/category',
                parentId: 8
            },
            {
                id: 9,
                label: 'Questions',
                link: '/placement/questions',
                parentId: 8
            },
            {
                id: 11,
                label: 'College List',
                link: '/placement/college',
                parentId: 11
            },
            {
                id: 10,
                label: 'Campus Job Opening',
                link: '/career/job-opening',
                parentId: 10
            },
            {
                id: 12,
                label: 'Generate Test Link',
                link: '/placement/college-mapping',
                parentId: 12
            },
        ]
    },
    {
        id: 7,
        label: 'Campus Hiring',
        icon: 'mdi mdi-domain', // 🏫 Campus/company related
        subItems: [
            // {
            //     id: 10,
            //     label: 'student-list',
            //     link: '/placement/student-list',
            //     parentId: 10
            // },

            {
                id: 11,
                label: 'Assessment review',
                link: '/placement/assessment-review',
                parentId: 11
            },
            {
                id: 12,
                label: 'Interview Round',
                link: '/placement/interview-round',
                parentId: 12
            },
            {
                id: 12,
                label: 'Hired',
                link: '/placement/hired-students',
                parentId: 12
            },



        ]
    },
    {
        id: 8,
        label: 'Internship',
        icon: 'mdi mdi-briefcase-account-outline', // 🎓 Internship / Work experience
        subItems: [
            {
                id: 12,
                label: 'Internship Result',
                link: '/internship/internship-result',
                parentId: 12
            },
            {
                id: 12,
                label: 'Interview Round',
                link: '/internship/interview-round',
                parentId: 12
            },
            {
                id: 12,
                label: 'Approved Students',
                link: '/internship/approved-students',
                parentId: 12
            },
            {
                id: 12,
                label: 'Hold Students',
                link: '/internship/hold-students',
                parentId: 12
            },


        ]
    },
    {
        id: 8,
        label: 'Career',
        icon: 'mdi mdi-rocket-launch-outline', // 🚀 Career growth / Job opportunities
        subItems: [
            {
                id: 12,
                label: 'Job Application List',
                link: '/career/job-application-list',
                parentId: 12
            },
            {
                id: 12,
                label: 'Career Result',
                link: '/career/career-result',
                parentId: 12
            },
            {
                id: 12,
                label: 'Interview Round',
                link: '/career/interview-round',
                parentId: 12
            },
            {
                id: 12,
                label: 'Hired Candidates',
                link: '/career/hired-candidates',
                parentId: 12
            },



        ]
    },
    {
        id: 8,
        label: 'Student Form',
        icon: 'mdi mdi-school-outline', // 🎒 Student / Education related
        subItems: [
            {
                id: 12,
                label: ' Student Form List',
                link: '/student-form-list',
                parentId: 12
            },
        ]
    },
];

