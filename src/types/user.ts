export interface User {
    Id: number
    Username?: string // Client-side field
    UserName?: string // Server-side field
    Password: string
    Name: string
    Email: string
    Phone: string
    Tz: string
  }
  