//alert('Test1');

var cursor = 0; //глобальный курсор на текущую страницу

Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		images: [],
		pages: [[],[],[],[],[]]
	},
	actions: {
		//подгружает страницу
		navigateTo({commit, state}, page) {
			//если не загружались
			if (state.pages[page] == undefined || state.pages[page].length < 1) {
				$.ajax({
					url: 'https://api.unsplash.com/photos/random/?client_id=5c4e040970e52c8ad18a8e505277b82a320893b62e26b3e41c5d9d0deca819bb&count=10&w=1000&h=1500&orientation=portrait',
					success: function(res) {
						commit('LOAD_PHOTOS', {res, page});
					}
				})
			}
			//если загружались
			else {
				commit('SET_PHOTOS', page);
			}
		},
		//обновляет страницы
		updatePhotos({commit, dispatch}){
			commit('UPDATE_PHOTOS');
			dispatch('navigateTo', 0);
		},
		//удаляет фото
		removePhoto({commit},  index) {
			commit('REMOVE_PHOTO',  index);
		}
	},
	mutations: {
		LOAD_PHOTOS(state, {res, page}) {
			state.images = res; //установка отображения
			Vue.set(state.pages, page, res); //установка значения в массив страниц
		},
		SET_PHOTOS(state, page) {
			state.images = state.pages[page];
		},
		UPDATE_PHOTOS(state) {
			state.pages = [[],[],[],[],[]];
			state.images = [];

		},
		REMOVE_PHOTO(state, index) {
			Vue.delete(state.pages[cursor], index); //0!!!!!!
		}
	},
	getters: {
		images(state) {
			return state.images;
		}
	}
});

var app = new Vue({
	el: '#app',
	store,
	computed: {
		images() {
			return this.$store.getters.images;
		}
	},
	methods: {
		pageNavigator(page) {
			cursor = page;
			console.log("page is " + page);
			this.$store.dispatch('navigateTo', page);
		},
		updatePhotos() {
			this.$store.dispatch('updatePhotos');
		},
		removePhoto(index) {
			console.dir(index);
			this.$store.dispatch('removePhoto', index);
		}
	}
})

$(document).ready(function(){
	app.pageNavigator(0); //сперва грузим первую страницу
})