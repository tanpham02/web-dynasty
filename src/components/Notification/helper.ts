export interface NotificationProps {
  isEmpty?: boolean
}

export interface NotificationItemProps {
  image: string
  name: string
  description: string
  orderTime: string
  orderDate: string
  isRead: boolean
  isLastItem: boolean
}

export const notificationMockData = [
  {
    image:
      'http://thepizzacompany.vn/images/thumbs/000/0002624_seafood-pesto_300.png',
    name: 'Pizza Hải Sản Pesto Xanh',
    description:
      'Tôm, thanh cua, mực và bông cải xanh tươi ngon trên nền sốt Pesto Xanh',
    orderTime: 'Friday 2:30 PM',
    orderDate: 'Sep 10, 2024',
    isRead: false,
  },
  {
    image:
      'http://thepizzacompany.vn/images/thumbs/000/0002216_shrimp-ctl-test_300.png',
    name: 'Pizza Tôm Cocktail',
    description: 'Tôm với nấm, dứa, cà chua và sốt Thousand Island.',
    orderTime: 'Friday 2:30 PM',
    orderDate: 'Sep 10, 2024',
    isRead: true,
  },
]
