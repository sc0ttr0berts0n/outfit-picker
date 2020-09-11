const app = new Vue({
    el: '#app',
    data: {
        selected: {
            torso: { text: 'Give it', icon: 'logo' },
            legs: { text: 'a roll!', icon: 'logo' },
        },
        rollWasPressed: true,
        currentSeason: 'winter',
        seasons: ['spring', 'summer', 'fall', 'winter'],
        clothing: [
            {
                name: 'Maxi Dress',
                region: 'torso',
                category: 'dress',
                seasons: ['spring', 'summer'],
                icon: ['dress'],
            },
            {
                name: 'Dress',
                region: 'torso',
                category: 'dress',
                seasons: ['spring', 'summer', 'fall', 'winter'],
                icon: ['dress'],
            },
            {
                name: 'Maxi Skirt',
                region: 'legs',
                category: 'skirt',
                seasons: ['spring', 'summer'],
                icon: ['skirt'],
            },
            {
                name: 'Short Skirt',
                region: 'legs',
                category: 'skirt',
                seasons: ['spring', 'summer', 'fall', 'winter'],
                icon: ['skirt'],
            },
            {
                name: 'Dress Pants',
                region: 'legs',
                category: 'pants',
                seasons: ['spring', 'fall', 'winter'],
                icon: ['trousers'],
            },
            {
                name: 'Khakis',
                region: 'legs',
                category: 'pants',
                seasons: ['spring', 'fall', 'winter'],
                icon: ['trousers'],
            },
            {
                name: 'Leggings',
                region: 'legs',
                category: 'pants',
                seasons: ['spring', 'fall', 'winter'],
                icon: ['trousers'],
            },
            {
                name: 'Capris',
                region: 'legs',
                category: 'pants',
                seasons: ['spring', 'summer'],
                icon: ['trousers'],
            },
            {
                name: 'Sweater',
                region: 'torso',
                category: 'tops',
                seasons: ['spring', 'fall', 'winter'],
                icon: ['sweater'],
            },
            {
                name: 'Long Sleeves',
                region: 'torso',
                category: 'tops',
                seasons: ['spring', 'fall', 'winter'],
                icon: ['shirt'],
            },
            {
                name: 'Short Sleeves',
                region: 'torso',
                category: 'tops',
                seasons: ['spring', 'summer', 'fall', 'winter'],
                icon: ['tshirt'],
            },
            {
                name: 'Tank Top',
                region: 'torso',
                category: 'tops',
                seasons: ['spring', 'summer'],
                icon: ['tank-top'],
            },
        ],
    },
    computed: {},
    methods: {
        clothesBySeason: function (
            season = this.currentSeason,
            arr = this.clothing
        ) {
            return arr.filter((article) => {
                return article.seasons.includes(this.currentSeason);
            });
        },
        clothesByRegion: function (region, arr = this.clothesBySeason()) {
            return arr.filter((article) => {
                return article.region.includes(region);
            });
        },
        randomArray: function (arr) {
            const len = arr.length;
            const rand = Math.random();
            const index = Math.floor(rand * len);
            return arr[index];
        },
        getOutfit: function () {
            this.rollWasPressed = true;
            const torso = this.randomArray(this.clothesByRegion('torso'));
            this.selected.torso.text = torso.name;
            this.selected.torso.icon = torso.icon;
            if (torso.category === 'dress') {
                this.selected.legs.text = torso.name;
                this.selected.legs.icon = torso.icon;
            } else {
                const legs = this.randomArray(this.clothesByRegion('legs'));
                this.selected.legs.text = legs.name;
                this.selected.legs.icon = legs.icon;
            }
            const container = document.querySelector('.container');
            container.classList.remove('anim-wiggle');
            setTimeout(function () {
                container.classList.add('anim-wiggle');
            }, 1);
        },
        changeSeason: function (season) {
            this.currentSeason = season;
        },
    },
    mounted: function () {
        this.$nextTick(function () {
            const month = new Date().getMonth();
            let season = '';
            switch (month) {
                case 12:
                case 1:
                case 2:
                    season = 'winter';
                    break;
                case 3:
                case 4:
                case 5:
                    season = 'spring';
                    break;
                case 6:
                case 7:
                case 8:
                    season = 'summer';
                    break;
                case 9:
                case 10:
                case 11:
                    season = 'fall';
                    break;
            }
            this.currentSeason = season;
        });
    },
});
