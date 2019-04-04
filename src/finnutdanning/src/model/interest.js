//Modell for struktur av interesse-objekt i databasen.

module.export = class Interest {

  name;

  studies;

  hits = 0;

  constructor(name, studies, hits) {
      this.name = name;
      this.studies = studies;
      this.hits = hits;
  }

};
