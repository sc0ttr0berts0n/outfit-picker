console.clear();
const app = new Vue({
  el: '#app',
  data: {
    selected: {
      torso: 'Give it',
      legs: 'a roll!',
    },
    currentSeason: 'winter',
    seasons: ['spring', 'summer', 'fall', 'winter'],
    clothing: [
      {
        name: 'Maxi Dress',
        region: 'torso',
        category: 'dress',
        seasons: ['spring', 'summer']
      },
      {
        name: 'Dress',
        region: 'torso',
        category: 'dress',
        seasons: ['spring', 'summer', 'fall', 'winter']
      },
      {
        name: 'Maxi Skirt',
        region: 'legs',
        category: 'skirt',
        seasons: ['spring', 'summer']
      },
      {
        name: 'Short Skirt',
        region: 'legs',
        category: 'skirt',
        seasons: ['spring', 'summer', 'fall', 'winter']
      },
      {
        name: 'Dress Pants',
        region: 'legs',
        category: 'pants',
        seasons: ['spring', 'fall', 'winter']
      },
      {
        name: 'Khakis',
        region: 'legs',
        category: 'pants',
        seasons: ['spring', 'fall', 'winter']
      },
      {
        name: 'Leggings',
        region: 'legs',
        category: 'pants',
        seasons: ['spring', 'fall', 'winter']
      },
      {
        name: 'Capris',
        region: 'legs',
        category: 'pants',
        seasons: ['spring', 'summer']
      },
      {
        name: 'Sweater',
        region: 'torso',
        category: 'tops',
        seasons: ['spring', 'fall', 'winter']
      },
      {
        name: 'Long Sleeves',
        region: 'torso',
        category: 'tops',
        seasons: ['spring', 'fall', 'winter']
      },
      {
        name: 'Short Sleeves',
        region: 'torso',
        category: 'tops',
        seasons: ['spring', 'summer', 'fall', 'winter']
      },
      {
        name: 'Tank Top',
        region: 'torso',
        category: 'tops',
        seasons: ['spring', 'summer']
      }
    ]
  },
  computed: {

  },
  methods: {
    clothesBySeason: function(season = this.currentSeason, arr = this.clothing) {
      return arr.filter(article => {
        return article.seasons.includes(this.currentSeason);
      });
    },
    clothesByRegion: function(region, arr = this.clothesBySeason()) {
      return arr.filter(article => {
        return article.region.includes(region);
      });
    },
    randomArray: function(arr) {
      const len = arr.length
      const rand = Math.random();
      const index = Math.floor(rand * len);
      return arr[index];
    },
    getOutfit: function() {
      const torso = this.randomArray(this.clothesByRegion('torso'));
      this.selected.torso = torso.name;
      if (torso.category === 'dress') {
        this.selected.legs = torso.name;
      } else {
        const legs = this.randomArray(this.clothesByRegion('legs'));
        this.selected.legs = legs.name;
      }
      const container = document.querySelector('.container');
      container.classList.remove('anim-wiggle');
      setTimeout(function() {container.classList.add('anim-wiggle');}, 1);
    }
  }
});