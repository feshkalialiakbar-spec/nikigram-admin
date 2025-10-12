import {
  Activity,
  AddCircle,
  Additem,
  Book,
  Building4,
  Category,
  Chart,
  Clock,
  CloseCircle,
  Courthouse,
  DocumentText,
  HeartSlash,
  Icon,
  Message,
  MessageQuestion,
  NoteAdd,
  People,
  Profile2User,
  ProfileRemove,
  SecurityUser,
  Task,
  TaskSquare,
  TickCircle,
  Wallet2,
} from 'iconsax-react'
export interface TaskMenuItem {
  label: string
  href: string
  icon: Icon
  children?: TaskMenuItem[]
}

export const quickActions: TaskMenuItem[] = [
  {
    icon: TaskSquare,
    label: 'میز کار من',
    href: '/dashboard',
    children: [
      {
        label: 'کارهای من',
        href: '/dashboard/my-tasks',
        icon: Clock,
      },
      {
        label: 'در انتظار انجام من',
        href: '/dashboard/tasks-waiting-for-me',
        icon: Activity,
      },
      {
        label: 'در حال انجام  ',
        href: '/dashboard/tasks-in-progress',
        icon: TickCircle,
      },
      {
        label: 'انجام شده',
        href: '/dashboard/tasks-completed',
        icon: CloseCircle,
      },
      {
        label: 'متوقف شده',
        href: '/dashboard/tasks-stopped',
        icon: Profile2User,
      }, {
        label: 'در انتظار انجام مشترک',
        href: '/dashboard/to-do-list',
        icon: Profile2User,
      },
      {
        label: 'اختصاص نیافته',
        href: '/dashboard/tasks-unassigned',
        icon: ProfileRemove,
      },
    ],
  },
  {
    icon: Chart,
    label: 'مدیریت تسک ها',
    href: '/task-management',
    children: [
      {
        label: 'کاربران سیستم',
        href: '/task-management/system-users',
        icon: Clock,
      },
      {
        label: 'پرسنل سیستم',
        href: '/task-management/system-personnel',
        icon: Activity,
      },
    ],
  },
  {
    icon: People,
    label: 'مدیریت کاربران',
    href: '/user-management',
  },
  { icon: Building4, label: 'پروژه ها', href: '/projects' },
  { icon: Courthouse, label: 'مناقصه ها', href: '/tenders' },
  { icon: HeartSlash, label: 'خیریه ها', href: '/charities' },
  { icon: DocumentText, label: 'اخبار', href: '/news' },
  { icon: Message, label: 'نظرات', href: '/comments' },
  {
    icon: NoteAdd,
    label: 'تعاریف',
    href: '/definitions',
    children: [
      {
        label: 'صندوق',
        href: '/definitions/funds',
        icon: Task,
      },
      {
        label: 'پارامترهای سیستم',
        href: '/definitions/system-parameters',
        icon: Additem,
      },

      {
        label: 'دسته‌بندی پروژه‌ها',
        href: '/definitions/project-categories',
        icon: Task,
      },
      {
        label: 'سطوح باشگاه',
        href: '/definitions/club-levels',
        icon: Task,
      },
      {
        label: 'دسته‌بندی خدمات',
        href: '/definitions/service-categories',
        icon: Additem,
      },
      {
        label: 'دسته‌بندی محصولات',
        href: '/definitions/product-categories',
        icon: Task,
      },
      {
        label: 'دسته‌بندی اخبار',
        href: '/definitions/news-categories',
        icon: Additem,
      },
    ],
  },
  {
    icon: Book,
    label: 'تمپلیت پروژه',
    href: '/project-templates',
  },
  { icon: MessageQuestion, label: 'سوالات متداول', href: '/faq' },
  {
    icon: Wallet2,
    label: 'پشتیبانی و تیکت',
    href: '/support-tickets',
  },
  {
    icon: SecurityUser,
    label: 'مالی و صندوق ها',
    href: '/financial-management',
    children: [
      {
        label: 'موجودی صندوق‌ها',
        href: '/financial-management/fund-balances',
        icon: Task,
      },
      {
        label: 'تراکنش‌های صندوق‌',
        href: '/financial-management/fund-transactions',
        icon: Additem,
      },
      {
        label: 'کیف‌پول‌های کاربران',
        href: '/financial-management/user-wallets',
        icon: AddCircle,
      },
      {
        label: 'تراکنش‌های کاربران ',
        href: '/financial-management/user-transactions',
        icon: Task,
      },
      {
        label: 'پرداختی‌ها',
        href: '/financial-management/payments',
        icon: Additem,
      },
      {
        label: 'درآمد',
        href: '/financial-management/income',
        icon: AddCircle,
      },
      {
        label: 'هزینه',
        href: '/financial-management/expenses',
        icon: AddCircle,
      },
    ],
  },
  {
    icon: Category,
    label: 'سطح دسترسی',
    href: '/access-levels',
    children: [
      {
        label: 'تعریف وظایف',
        href: '/access-levels/define-tasks',
        icon: Task,
      },
      {
        label: 'تعریف گروه',
        href: '/access-levels/define-groups',
        icon: Additem,
      },
      {
        label: 'تعریف ادمین',
        href: '/access-levels/define-admins',
        icon: AddCircle,
      },
    ],
  },
]
