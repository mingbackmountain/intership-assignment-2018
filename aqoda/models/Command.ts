class Command {
  name: string;
  params: string[];
  constructor(name: string, params: string[]) {
    this.name = name;
    this.params = params;
  }
}

export { Command };
