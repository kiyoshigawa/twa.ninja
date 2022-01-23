Vue.use(VueRouter);

const jsonClone = function (data) {
	return JSON.parse(JSON.stringify(data));
};

const cleanupTimestampMixin = {
	methods: {
		cleanUpTimestamp(timestamp) {
			return timestamp.split(' ')[0];
		},
	},
}

const propsForRouterViewMixin = {
	props: {
		content: {
			type: Array,
			required: true,
		},
		is_content_loading: {
			type: Boolean,
			required: true,
		},
	}
}

const About = {
	mixins: [
		propsForRouterViewMixin
	],
	template: `
		<div class="body-content" id="body-content">
			<h1>There are some who call me... 'Tim'</h1>
			<p>Tim Anderson (also known around the internet as <em>kiyoshigawa</em>) is a Utah-native maker / hacker, and this is his personal website. It's here as a place to show off some of the things that Tim has done. The <a href="/#/blog_list">Blog</a> has writeups for many of my projects over the years, as well as anything else I thought was interesting enough to put up on the internet. The <a href="/#/github">GitHub</a> page has links to some of my more interesting GitHub repos, so you don't need to wade through all the repos from the distant past to find the interesting things.</p>
			<p>Tim has been a member of the local utah Hackerspace / Makerspace scene since its inception in late summer fo 2009 with HackSLC. HackSLC later became the Transistor, which currently still persists as <a href="https://801labs.org/">801 Labs</a>. I was also a founding member of <a href="https://makesaltlake.org">MakeSLC</a>, though I don't have much to do with them currently. There's a <a href="I haven't done this yet">blog post</a> that covers the general history of the Utah hackerspaces as I remember it.</p>
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
	mixins: [
		cleanupTimestampMixin,
		propsForRouterViewMixin,
	],
	components: {
		BlogPostEditor: BlogPostEditor
	},
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
				body: "<p>We don't have that blog post. You're clearly trying to hack me. Please stop, I have nothing of value.</p>",
			}
			const page_content = is_content_loading
				? {}
				: this.content.find(function (blog_post) {
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
		<div class="body-content" id="body-content">
			<div
				v-if="is_content_loading"
			>loading...</div>
			<div
				v-if="!is_content_loading"
				class="blog-post-content"
			>
				<h1>{{ post.title }}</h1>
				<p
					v-if="post.date_publish"
				>Date Published: {{ cleanUpTimestamp(post.date_publish) }}</p>
				<div 
					class="post-images"
					v-if="post.image && post.image.file"
				><a 
					class="image-link"
					target="_blank"
					:href="post.image.file"
				>
					<img 
						class="post-image"
						:src="post.image.file"
						:title="post.title + 'cover photo'"
						:alt="post.title + 'cover photo'"
					/>
				</a>
				</div>
				<div
					v-html="post.body"
				>
				</div>
				<div 
					class="post-images"
					v-if="post.image_list && post.image_list.length"
				>
						<div 
							class="post-image-holder"
							v-for="image of post.image_list"
							:key="image.filename"
						>
							<a 
								class="image-link"
								target="_blank"
								:href="image.filename"
							>
								<img 
									class="post-image"
									:src="image.filename"
									:title="image.title"
									:alt="image.title"
								/>
							</a>
						</div>
				</div>
				<div 
					class="post-files"
					v-if="post.file_list && post.file_list.length"
				>
					<h3>Download Files:</h3>
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

const Blog = {
	mixins: [
		cleanupTimestampMixin,
		propsForRouterViewMixin,
	],
	computed: {
		sortedPosts() {
			return this.getSortedBlogPosts(this.content);
		},
	},
	methods: {
		GenerateBlogBlurb(data) {
			return data = data.replace(/<(.|\n)*?>/g, '');
		},
		getSortedBlogPosts(content) {
			return content.sort((a, b) => {
				return b.date_publish.localeCompare(a.date_publish);
			});
		},
	},
	template: `
		<div class="body-content" id="body-content">
			<div
				v-if="is_content_loading"
			>loading...</div>
			<div
				v-else
				class="blog-list"
			>
				<div
					class="blog-item"
					v-for="blog_post of sortedPosts"
					:key="blog_post.id"
				>
					<div class="blog-item-holder">
						<router-link
							class = "blog-item-link"
							:to="'/blog/' + blog_post.id"
						>
							<h2 class="blog-item-title">{{ blog_post.title }}</h2>
							<span class="blog-item-blurb-holder">
								<img class="blog-item-image" :src="blog_post.image.file" />
								<div class="blog-item-blurb">
									<p class="blog-item-date">Date Published: {{ cleanUpTimestamp(blog_post.date_publish) }}</p>
									<p class="blog-blurb-text">{{ GenerateBlogBlurb(blog_post.body) }}</p>
								</div>
							</span>
						</router-link>
					</div>
				</div>
			</div>
		</div>
	`
};

const Github = {
	mixins: [
		propsForRouterViewMixin
	],
	template: `
		<div class="body-content" id="body-content">
			This is the Github page.
		</div>
	`
};

const Contact = {
	mixins: [
		propsForRouterViewMixin
	],
	template: `
		<div class="body-content" id="body-content">
			This is the Contact page.
		</div>
	`
};

const NotFound = {
	mixins: [
		propsForRouterViewMixin
	],
	template: `
		<div class="body-content" id="body-content">
			<h1>404 Page Not Found</h1>
			<p>We don't got it. Go look somewhere else.</p>
		</div>
	`
};

const routes = [
	{path: '', component: About},
	{path: '/', component: About},
	{path: '/about', component: About},
	{path: '/blog_list', component: Blog},
	{path: '/github', component: Github},
	{path: '/contact', component: Contact},
	{path: '/blog/:id', component: BlogPost},
	{path: '*', component: NotFound},
];

const router = new VueRouter({
	mode: 'hash',
	routes: routes,
});

const DEFAULT_TITLE = 'twa.ninja - The Personal Website of Tim Anderson';

router.afterEach((to, from) => {
	window.scrollTo(0,0);
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
		<router-link
			class="menu-link"
			:to="data.id"
		><span 
			class="menu-item"
		>{{ data.label }}</span>
		</router-link>
	`
});

let app = new Vue({
	router: router,
	el: '#app',
	data: {
		menu_list: [
			{id: '/about', label: 'About'},
			{id: '/blog_list', label: 'Blog'},
			{id: '/github', label: 'Github'},
			{id: '/contact', label: 'Contact'},
		],
		is_content_loading: true,
		content: [],
	},
	template: `
		<div class="app" id="app">
			<div class="header" id="header">
				<h1>twa.ninja</h1>
				<h2>The Personal Website of Tim Anderson</h2>
			</div>
			<div class="menu" id="menu">
				<menu-item
					v-for="item of menu_list"
					:key="item.id"
					:data="item"
				></menu-item>
			</div>
			<div class="content" id="content">
					<router-view
						:content="content"
						:is_content_loading="is_content_loading"
					></router-view>
			</div>
			<div class="footer" id="footer">
				<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
					<img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/80x15.png" /></a>
					<br />Unless noted otherwise, the content of this website is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
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
