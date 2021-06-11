Vue.use(VueRouter);

const props_for_root_router_view = {
	content: {
		type: Array,
		required: true,
	},
	is_content_loading: {
		type: Boolean,
		required: true,
	},
};

const Home = {
	props: props_for_root_router_view,
	template: `
		<div class="body" id="body">
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
					<router-link
						:to="'/blog/' + blog_post.id"
					>{{ blog_post.title }}</router-link>
				</div>
			</div>
		</div>
	`
};

const BlogPost = {
	props: {
		...props_for_root_router_view, // 'Spread' Operator
		id: {
			type: String,
			required: true,
		},
	},
	computed: {
		post(){
			const id = this.id;
			const is_content_loading = this.is_content_loading;
			const result = is_content_loading
				? {}
				: this.content.find(function(blog_post){
					return blog_post.id === id;
				});
			return result;
		}
	},
	template: `
		<div 
			class="blog-post"
		>
			<div
				v-if="is_content_loading"
			>loading...</div>
			<div
				v-else
				class="blog-post-content"
			>
				<h1>{{ post.title }}</h1>
				<div
					v-html="post.body"
				></div>
			</div>
		</div>
	`
}

const Games = {
	props: props_for_root_router_view,
	template: `
		<div class="body" id="body">
			This is the Games page.
		</div>
	`
};

const Toons = {
	props: props_for_root_router_view,
	template: `
		<div class="body" id="body">
			This is the Toons page.
		</div>
	`
};

const Sbemails = {
	props: props_for_root_router_view,
	template: `
		<div class="body" id="body">
			This is the Sbemails page.
		</div>
	`
};

const Yodeling = {
	props: props_for_root_router_view,
	template: `
		<div class="body" id="body">
			This is the Yodeling page.
		</div>
	`
};

const Yodeling2 = {
	props: props_for_root_router_view,
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
	{ path: '/blog/:id', component: BlogPost, props: true },
];

const router = new VueRouter({
	routes: routes,
});

const DEFAULT_TITLE = 'This is a Title';

router.afterEach((to, from) => {
	Vue.nextTick(() => {
		document.title = to.meta.title || DEFAULT_TITLE;
	})
});

Vue.component('menu-item', {
	props: {
		data: {
			type: Object,
			required: true,
		},
	},
	template: `
		<span 
			class="menu-item"
		>
			<router-link
				:to="data.id"
			>{{ data.label }}</router-link>
		</span>
	`
});

let app = new Vue({
	router: router,
	el: '#app',
	data: {
		menu_list: [
			{id: '/home', label: 'Home'},
			{id: '/games', label: 'Games'},
			{id: '/toons', label: 'Toons'},
			{id: '/sbemails', label: 'sbemails'},
			{id: '/yodeling', label: 'Yodeling'},
			{id: '/yodeling2', label: 'Yodeling'},
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
				<menu-item
					v-for="item of menu_list"
					:key="item.id"
					:data="item"
				></menu-item>
			</div>
			<div class="body" id="body">
				<router-view
					:content="content"
					:is_content_loading="is_content_loading"
				></router-view>
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
