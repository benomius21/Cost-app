export interface Base {
  name: string;
  cost: number;
}

export interface Plan {
  _id: string;
  title: string;
  salary: number;
  expenses: Base[];
}