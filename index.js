Vue.use(VueRouter);

const jsonClone = function (data) {
	return JSON.parse(JSON.stringify(data));
};

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


const BlogPostEditor = {
	name: 'blog-post-editor',
	props: {
		post: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			mutablePost: jsonClone(this.post),
		}
	},
	methods: {
		handleSubmit(submitEvent) {
			submitEvent.preventDefault();
			const mutablePostCopy = jsonClone(this.mutablePost);
			console.log('The form was submit!', mutablePostCopy);
			this.$emit('post', mutablePostCopy);
		},
	},
	template: `
		<div
			class="blog-post-editor"
		>
			<form
				@submit="handleSubmit"
			>
				<div class="editor-field">
					<label>
						<span>Title</span>
						<input
							type="text"
							v-model="mutablePost.title"
						/>
					</label>
				</div>
				<div class="editor-field">
					<label>
						<span>Title</span>
						<textarea
							type="text"
							v-model="mutablePost.body"
							cols="80"
							rows="10"
						/>
					</label>
				</div>
				<div class="editor-field">
					<input type="submit" />
				</div>
			</form>
		</div>
	`
};

const BlogPost = {
	components: {
		BlogPostEditor: BlogPostEditor
	},
	props: props_for_root_router_view,
	data() {
		return {
			postPreview: null
		};
	},
	computed: {
		id() {
			return this.$route.params.id;
		},
		isEditorMode() {
			// !! turns truthy or falsey into exactly true or false
			return !!this.$route.query.editor_mode;
		},
		post() {
			const id = this.id;
			const is_content_loading = this.is_content_loading;
			const content_for_404_page = {
				title: "404 Page not found",
				body: "<p>We don't have that. You're clearly trying to hack me. Please stop, I have nothing of value.</p>",
			}
			const page_content = is_content_loading
				? {}
				: this.content.find(function(blog_post){
					return blog_post.id === id;
				}) || content_for_404_page;
			return this.postPreview || page_content;
		}
	},
	methods: {
		ingestPostPreview(postPreview) {
			console.log("ingestPostPreview: postPreview", postPreview);
			this.postPreview = postPreview;
		},
	},
	template: `
		<div 
			class="blog-post"
		>
			<div
				v-if="is_content_loading"
			>loading...</div>
			<div
				v-if="!is_content_loading"
				class="blog-post-content"
			>
				<h1>{{ post.title }}</h1>
				<div
					v-html="post.body"
				></div>
				<div 
					class="post-images"
					v-if="post.image_list && post.image_list.length"
				>
					<div 
						class="post-image"
						v-for="image of post.image_list"
						:key="image.filename"
					>
						<img 
							:src="image.filename"
							:title="image.title"
							:alt="image.title"
						/>
					</div>
				</div>
				<div 
					class="post-files"
					v-if="post.file_list && post.file_list.length"
				>
					<h3>File Downloads</h3>
					<div 
						class="post-file"
						v-for="file of post.file_list"
						:key="file.filename"
					>
						<a 
							:href="file.filename"
							target="_blank"
						>{{file.title}}</a>
					</div>
				</div>
			</div>
			<blog-post-editor
				v-if="!is_content_loading && isEditorMode"
				:post="post"
				@post="ingestPostPreview"
			></blog-post-editor>
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
	{ path: '', component: Home },
	{ path: '/', component: Home },
	{ path: '/home', component: Home },
	{ path: '/games', component: Games },
	{ path: '/toons', component: Toons },
	{ path: '/sbemails', component: Sbemails },
	{ path: '/yodeling', component: Yodeling },
	{ path: '/yodeling2', component: Yodeling2 },
	{ path: '/blog/:id', component: BlogPost },
];

const router = new VueRouter({
	mode: 'hash',
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
