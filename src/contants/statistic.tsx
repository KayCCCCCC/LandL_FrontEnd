import { FolderKanban, GlobeLock, Users } from 'lucide-react'

export const STATISTICS = [
  // {
  //   id: 1,
  //   data: 2024,
  //   content: 'year of establishment',
  //   icon: <CalendarClock size={28} />,
  //   isMore: false
  // },
  {
    id: 2,
    data: 6,
    content: 'team members',
    icon: <Users size={28} />,
    isMore: true
  },
  {
    id: 3,
    data: 2,
    content: 'successfully project',
    icon: <FolderKanban size={28} />,
    isMore: true
  },
  {
    id: 4,
    data: 1,
    content: 'Global partners',
    icon: <GlobeLock size={28} />,
    isMore: true
  }
]
