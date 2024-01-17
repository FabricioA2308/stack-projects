export default interface Todo {
  id: string;
  text: string;
}

export function getRandomNumber(): string {
  return Math.floor(Math.random() * (100 - 20 + 3) + 15).toString();
}
