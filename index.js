Vue.use(VueRouter);
/*
How to load content from content.json:
<div
	v-if="is_content_loading"
>loading...</div>
<div
	v-else
	class="blog-list"
>
	<div
		class="blog-item"
		v-for="blog_post of content"
	:key="blog_post.id"
>
	<a
	:href="'index.html#' + blog_post.id"
>{{ blog_post.title }}</a>
</div>
</div>
*/

const Home = {
	template: `
		<div class="body" id="body">
			This is the Home page.
		</div>
	`
};

const Games = {
	template: `
		<div class="body" id="body">
			This is the Games page.
		</div>
	`
};

const Toons = {
	template: `
		<div class="body" id="body">
			This is the Toons page.
		</div>
	`
};

const Sbemails = {
	template: `
		<div class="body" id="body">
			This is the Sbemails page.
		</div>
	`
};

const Yodeling = {
	template: `
		<div class="body" id="body">
			This is the Yodeling page.
		</div>
	`
};

const Yodeling2 = {
	template: `
		<div class="body" id="body">
			This is the Yodeling2 page.
		</div>
	`
};

const routes = [
	{ path: '/home', component: Home },
	{ path: '/games', component: Games },
	{ path: '/toons', component: Toons },
	{ path: '/sbemails', component: Sbemails },
	{ path: '/yodeling', component: Yodeling },
	{ path: '/yodeling2', component: Yodeling2 },
];

const router = new VueRouter({
	routes: routes,
});

const DEFAULT_TITLE = 'This is a Title';

router.afterEach((to, from) => {
	Vue.nextTick(() => {
		document.title = to.meta.title || DEFAULT_TITLE;
	})
})

let app = new Vue({
	router: router,
	el: '#app',
	data: {
		menu_list: [
			{id: 'home', label: 'Home'},
			{id: 'games', label: 'Games'},
			{id: 'toons', label: 'Toons'},
			{id: 'sbemails', label: 'sbemails'},
			{id: 'yodeling', label: 'Yodeling'},
			{id: 'yodeling2', label: 'Yodeling'},
		],
		is_content_loading: true,
		content: [],
	},
	template: `
		<div class="app" id="app">
			<div class="header" id="header">
				<h1>This is the Title of the Page</h1>
			</div>
			<div class="menu" id="menu">
				<span 
					class="menu-item"
					v-for="item of menu_list"
					:key="item.id"
				>
					<router-link
						:to="item.id"
					>{{ item.label }}</router-link>
				</span>
			</div>
			<div class="body" id="body">
				<router-view></router-view>
			</div>
			<div class="footer" id="footer">
				Feet go Here.
			</div>
		</div>
	`
});

let content_url = './content.json';

let content_response_promise = fetch(content_url);

const handle_content_json = function (content) {
	//console.log('our content has loaded', content);
	app.content = content;
	app.is_content_loading = false;
};

const handle_content_response = function (response) {
	//console.log('The response from loading content.json', response);
	let json_promise = response.json();
	json_promise.then(handle_content_json);
};

content_response_promise.then(handle_content_response);
