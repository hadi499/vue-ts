interface User {
  id: number
  username: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  user?: User
}