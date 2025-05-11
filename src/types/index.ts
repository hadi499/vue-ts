interface User {
  id: string
  username: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  user?: User
}