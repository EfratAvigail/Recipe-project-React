export const getDifficultyLabel = (difficulty: number): string => {
    switch (difficulty) {
      case 1:
        return "קל"
      case 2:
        return "בינוני"
      case 3:
        return "מאתגר"
      case 4:
        return "קשה"
      default:
        return "לא ידוע"
    }
  }
