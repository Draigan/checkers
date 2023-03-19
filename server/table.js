class Table {
  constructor(_name, _id) {
    this.name = _name;
    this.id = _id
    this.table = null,
      this.players = [];
    this.fen = null;
    this.turnColor = "white";
  }
}
module.exports = Table;
