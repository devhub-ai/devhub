export interface User {
  username: string;
  email: string;
}

export const groupUsersByFirstLetter = (users: User[]): Record<string, User[]> => {
  return users.reduce((acc, user) => {
    const firstLetter = user.username[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(user);
    return acc;
  }, {} as Record<string, User[]>);
};