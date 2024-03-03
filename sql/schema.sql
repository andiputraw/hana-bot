CREATE TABLE heroes (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  img TEXT NOT NULL
);

CREATE UNIQUE INDEX heros_idx ON heroes (name);

CREATE TABLE hero_datas (
  id INTEGER PRIMARY KEY,
  hero_id INTEGER NOT NULL,
  type INTEGER NOT NULL,
  value TEXT NOT NULL,
  FOREIGN KEY(hero_id) REFERENCES heroes(id)
);