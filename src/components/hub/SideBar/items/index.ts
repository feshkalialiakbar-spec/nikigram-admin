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
    href: '/lists',
    children: [
      {
        label: 'کارهای من',
        href: '/tasks/pending',
        icon: Clock,
      },
      {
        label: 'در انتظار انجام من',
        href: '/tasks/in-progress',
        icon: Activity,
      },
      {
        label: 'در حال انجام  ',
        href: '/tasks/done',
        icon: TickCircle,
      },
      {
        label: 'انجام شده',
        href: '/tasks/stopped',
        icon: CloseCircle,
      },
      {
        label: 'متوقف شده',
        href: '/tasks/shared-pending',
        icon: Profile2User,
      },
      {
        label: 'اختصاص نیافته',
        href: '/tasks/unassigned',
        icon: ProfileRemove,
      },
    ],
  },
  {
    icon: Chart,
    label: 'مدیریت تسک ها',
    href: '/team',
    children: [
      {
        label: 'کاربران سیستم',
        href: '/tasks/pending',
        icon: Clock,
      },
      {
        label: 'پرسنل سیستم',
        href: '/tasks/in-progress',
        icon: Activity,
      },
    ],
  },
  {
    icon: People,
    label: 'مدیریت کاربران',
    href: '/organization',
  },
  { icon: Building4, label: 'پروژه ها', href: '/favorites' },
  { icon: Courthouse, label: 'مناقصه ها', href: '/messages' },
  { icon: HeartSlash, label: 'خیریه ها', href: '/calendar' },
  { icon: DocumentText, label: 'اخبار', href: '/filters' },
  { icon: Message, label: 'نظرات', href: '/help' },
  {
    icon: NoteAdd,
    label: 'تعاریف',
    href: '/tasks',
    children: [
      {
        label: 'صندوق',
        href: '/tasks/pending',
        icon: Task,
      },
      {
        label: 'پارامترهای سیستم',
        href: '/tasks/in-progress',
        icon: Additem,
      },

      {
        label: 'دسته‌بندی پروژه‌ها',
        href: '/tasks/pending',
        icon: Task,
      },
      {
        label: 'سطوح باشگاه',
        href: '/tasks/pending',
        icon: Task,
      },
      {
        label: 'دسته‌بندی خدمات',
        href: '/tasks/in-progress',
        icon: Additem,
      },
      {
        label: 'دسته‌بندی محصولات',
        href: '/tasks/pending',
        icon: Task,
      },
      {
        label: 'دسته‌بندی اخبار',
        href: '/tasks/in-progress',
        icon: Additem,
      },
    ],
  },
  {
    icon: Book,
    label: 'تمپلیت پروژه',
    href: '/reduce',
  },
  { icon: MessageQuestion, label: 'سوالات متداول', href: '/users' },
  {
    icon: Wallet2,
    label: 'پشتیبانی و تیکت',
    href: '/filters',
  },
  {
    icon: SecurityUser,
    label: 'مالی و صندوق ها',
    href: '/help',
    children: [
      {
        label: 'موجودی صندوق‌ها',
        href: '/tasks/pending',
        icon: Task,
      },
      {
        label: 'تراکنش‌های صندوق‌',
        href: '/tasks/in-progress',
        icon: Additem,
      },
      {
        label: 'کیف‌پول‌های کاربران',
        href: '/tasks/done',
        icon: AddCircle,
      },
      {
        label: 'تراکنش‌های کاربران ',
        href: '/tasks/pending',
        icon: Task,
      },
      {
        label: 'پرداختی‌ها',
        href: '/tasks/in-progress',
        icon: Additem,
      },
      {
        label: 'درآمد',
        href: '/tasks/done',
        icon: AddCircle,
      },
      {
        label: 'هزینه',
        href: '/tasks/done',
        icon: AddCircle,
      },
    ],
  },
  {
    icon: Category,
    label: 'سطح دسترسی',
    href: '/tasks',
    children: [
      {
        label: 'تعریف وظایف',
        href: '/tasks/pending',
        icon: Task,
      },
      {
        label: 'تعریف گروه',
        href: '/tasks/in-progress',
        icon: Additem,
      },
      {
        label: 'تعریف ادمین',
        href: '/tasks/done',
        icon: AddCircle,
      },
    ],
  },
]
