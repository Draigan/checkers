class Table {
  constructor(_name, _id) {
    this.name = _name;
    this.id = _id
    this.table = null,
      this.players = [];
    // this.startPosition = "0101010110101010010101010000000000000000303030300303030330303030";
    this.fen = "";
  }
}
module.exports = Table;
