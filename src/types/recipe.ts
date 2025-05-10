export interface Ingredient {
    Name: string
    Count: number
    Type: string
  }
  
  export interface Recipe {
    Id: number
    Name: string
    Description: string
    Instructions: string[]
    Difficulty: number
    Duration: number
    CategoryId: number // Client-side field
    Categoryid?: number // Server-side field
    UserId: number
    UserName?: string // Added for displaying creator name
    Img: string
    Ingrident: Ingredient[] // Client-side field
    Ingridents?: Ingredient[] // Server-side field
  }
  
  export interface RecipeFilters {
    search: string
    categoryId: string
    difficulty: string
    duration: number[]
    userId: string
  }
  