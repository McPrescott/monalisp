// -----------------------------------------------------------------------------
// -- ID TABLE
//------------------------------------------------------------------------------


export class IDTable {
  private table: Map<string, any> = new Map();

  static create() {
    return new IDTable();
  }

  isRegistered(id: Identifier): boolean {
    return this.table.has(id.name);
  }

  resolve(id: Identifier): any {
    return this.table.get(id.name);
  }

  register(id: Identifier, value: any): any {
    this.table.set(id.name, value);
    return value;
  }
}
