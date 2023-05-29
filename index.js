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
			<p>Tim Anderson (also known around the internet as <em>kiyoshigawa</em>) is a Utah-native maker / hacker, and this is his personal website. It's here as a place to show off some of the things that Tim has done. The <a href="/blog">Blog</a> has writeups for many of my projects over the years, as well as anything else I thought was interesting enough to put up on the internet. The <a href="/github">GitHub</a> page has links to some of my more interesting GitHub repos, so you don't need to wade through all the repos from the distant past to find the interesting things.</p>
			<p>Tim has been a member of the local utah Hackerspace / Makerspace scene since its inception in late summer of 2009 with HackSLC. HackSLC later became the Transistor, which currently still persists as <a href="https://801labs.org/">801 Labs</a>. I was also a founding member of <a href="https://makesaltlake.org">MakeSLC</a>, though I don't have much to do with them currently.</p>
		</div>
	`
};

const makeComputedGetterSetter = function (source_object_name, property_name) {
	return {
		get() {
			return this[source_object_name][property_name];
		},
		set(value) {
			const compositeObject = jsonClone(this[source_object_name]);
			compositeObject[property_name] = value;
			this.$emit(
				"update:" + source_object_name,
				compositeObject
			);
		},
	};
}

Vue.component('file-editor', {
	props: {
		file_object: {
			type: Object,
			required: true,
		},
	},
	computed: {
		filename: makeComputedGetterSetter('file_object', 'filename'),
		title: makeComputedGetterSetter('file_object', 'title'),
	},
	template: `
		<div
			class="file-editor"
		>
			<h4>File:</h4>
			<div class="editor-field">
				<label>
					<span>filename</span>
					<input
						
						type="text"
						v-model="filename"
					/>
				</label>
			</div>
			<div class="editor-field">
				<label>
					<span>alt text</span>
					<input
						type="text"
						v-model="title"
					/>
				</label>
			</div>
		</div>
	`
});

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
			mutablePost: Object.assign(
				jsonClone(this.post),
				{
					id: this.post.id || this.$route.params.id,
					image: this.post.image || {title: "", filename: ""},
					date_publish: this.post.date_publish || (new Date()).toJSON().split('T')[0],
					image_list: this.post.image_list || [],
					file_list: this.post.file_list || [],
				}
			),
		}
	},
	methods: {
		handleSubmit(submitEvent) {
			submitEvent.preventDefault();
			const mutablePostCopy = jsonClone(this.mutablePost);
			const mutablePostCopy2 = jsonClone(this.mutablePost);
			console.log('The form was submit!', mutablePostCopy2);
			this.$emit('post', mutablePostCopy);
		},
		addImage() {
			this.mutablePost.image_list.push({title: "", filename: ""});
		},
		addFile() {
			this.mutablePost.file_list.push({title: "", filename: ""});
		},
		saveToLocalStorage() {
			localStorage.setItem(this.mutablePost.id, JSON.stringify(this.mutablePost));
		},
		deleteFromLocalStorage() {
			localStorage.removeItem(this.mutablePost.id);
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
						<span>id</span>
						<input
							type="text"
							v-model="mutablePost.id"
						/>
					</label>
				</div>
				<div class="editor-field">
					<label>
						<span>Title</span>
						<input
							type="text"
							v-model="mutablePost.title"
						/>
					</label>
				</div>
				<file-editor
					:file_object="mutablePost.image"
					@update:file_object="mutablePost.image = $event"
				></file-editor>
				<div class="editor-field">
					<label>
						<span>Date Published</span>
						<input
							type="text"
							v-model="mutablePost.date_publish"
						/>
					</label>
				</div>
				<div class="editor-field">
					<label>
						<span>Body</span>
						<textarea
							type="text"
							v-model="mutablePost.body"
							cols="80"
							rows="10"
						/>
					</label>
				</div>
				<div class="editor-file-list">
					<h3>Images:</h3>
					<div
						v-for="(file, index) in mutablePost.image_list"
						:key="index"
					>
						<file-editor
							:file_object="file"
							@update:file_object="mutablePost.image_list.splice(index, 1, $event)"
						></file-editor>
						<div class="editor-field">
							<button 
								type="button"
								@click="mutablePost.image_list.splice(index, 1)"
							>X</button>
						</div>
					</div>
					
					<div class="editor-field">
						<button 
							type="button"
							@click="addImage"
						>Add Image</button>
					</div>
				</div>
				<div class="editor-file-list">
					<h3>Files:</h3>
					<div
						v-for="(file, index) in mutablePost.file_list"
						:key="index"
					>
						<file-editor
							:file_object="file"
							@update:file_object="mutablePost.file_list.splice(index, 1, $event)"
						></file-editor>
						<div class="editor-field">
							<button 
								type="button"
								@click="mutablePost.file_list.splice(index, 1)"
							>X</button>
						</div>
					</div>
					
					<div class="editor-field">
						<button 
							type="button"
							@click="addFile"
						>Add File</button>
					</div>
				</div>
				<div class="editor-field">
					<input type="submit" value="Preview Post"/>
					<input 
						type="button" 
						value="Save to Local Storage"
						@click="saveToLocalStorage"
					/>
					<input 
						type="button" 
						value="Delete From Local Storage"
						@click="deleteFromLocalStorage"
					/>
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
			return !!this.$route.query.e;
		},
		contentFromLocalStorage() {
			return JSON.parse(localStorage.getItem(this.id) || "null");
		},
		post() {
			const id = this.id;
			const is_content_loading = this.is_content_loading;
			const content_for_404_page = {
				title: "404 Page not found",
				body: "<p>We don't have that blog post. You're clearly trying to hack me. Please stop, I have nothing of value.</p>",
			}
			const content_from_local_storage = this.isEditorMode ? this.contentFromLocalStorage : null;
			const page_content = is_content_loading
				? {}
				: this.content.find(function (blog_post) {
				return blog_post.id === id;
			}) || content_for_404_page;
			return this.postPreview || content_from_local_storage || page_content;
		}
	},
	methods: {
		ingestPostPreview(postPreview) {
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
				<h1 
					style="color: red;"
					v-if="post===contentFromLocalStorage"
				>WARN: THIS PAGE NOT REAL!</h1>
				<h1>{{ post.title }}</h1>
				<p
					v-if="post.date_publish"
				>Date Published: {{ cleanUpTimestamp(post.date_publish) }}</p>
				<div 
					class="post-images"
					v-if="post.image && post.image.filename"
				><a 
					class="image-link"
					target="_blank"
					:href="post.image.filename"
				>
					<img 
						class="post-image"
						:src="post.image.filename"
						:title="post.image.title || post.title + ' cover photo'"
						:alt="post.image.title || post.title + ' cover photo'"
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
						v-for="(image, index) in post.image_list"
						:key="index"
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
						v-for="(file, index) in post.file_list"
						:key="index"
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
				<router-link
					class="blog-item-link"
					v-for="blog_post of sortedPosts"
					:key="blog_post.id"
					:to="'/blog/' + blog_post.id"
				>
					<strong class="blog-item-title">{{ blog_post.title }}</strong>
					<span class="blog-item-blurb-holder">
						<img 
							class="blog-item-image" 
							:src="blog_post.image.filename"
							:alt="blog_post.image.title || blog_post.title + ' cover photo'"
							:title="blog_post.image.title || blog_post.title + ' cover photo'"
						/>
						<span class="blog-item-blurb">
							<span class="blog-item-date">Date Published: {{ cleanUpTimestamp(blog_post.date_publish) }}</span>
							<br />
							<br />
							<span class="blog-blurb-text">{{ GenerateBlogBlurb(blog_post.body) }}</span>
						</span>
					</span>
				</router-link>
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
			<p>This is the GitHub page. I've put some links to a few of my more interesting GitHub projects, so you don't need to wade through every repo to find the good ones. If you want to look through everything, <a href="https://github.com/kiyoshigawa?tab=repositories">here</a>'s the link.</p>
			<h2>The oMIDItone</h2>
			<p><a href="https://github.com/kiyoshigawa/oMIDItone_Controller_V2">https://github.com/kiyoshigawa/oMIDItone_Controller_V2</a></p>
			<p>This is a project where I reverse engineered some analog Otamatone synths and added MIDI control to them. There's a couple <a href="https://twa.ninja/blog/omiditone_-_part_1">blog</a> <a href="https://twa.ninja/blog/omiditone_-_part_2">posts</a> about it as well.</p>
			<h2>Embedded Rust Scaffold Projects</h2>
			<p></p><a href="https://github.com/kiyoshigawa/bl602-scaffold">https://github.com/kiyoshigawa/bl602-scaffold</a><br>
			<a href="https://github.com/kiyoshigawa/esp32c3-scaffold">https://github.com/kiyoshigawa/esp32c3-scaffold</a></p>
			<p>These scaffold projects are intended to be used as jumping-off points for embedded hardware projects written in rust. The idea is that if you clone the repo and follow the readme instructions, you should be able to upload code to the MCU in question immediately. This lets you begin work on your actual project without needing to set up your toolchain every time.</p>
			<h2>Lighting Controller</h2>
			<p><a href="https://github.com/kiyoshigawa/lighting_controller">https://github.com/kiyoshigawa/lighting_controller</a></p>
			<p>The lighting controller has been in ongoing development for quite a while, and is used in many of my video game controller projects, and the oMIDItone. The latest incarnation of it has been rewritten in rust to be more generally dropped into my future projects. It's set up to allow for custom layered linear animations on LED strips to be added to just about any project with ease.</p>
			<h2>Fan Temperature Controller</h2>
			<p><a href="https://github.com/kiyoshigawa/esp32c3-fan-temperature-controller">https://github.com/kiyoshigawa/esp32c3-fan-temperature-controller</a></p>
			<p>This was a fun practical project that I threw together. I keep my video game consoles in a cabinet beneath my television, but they were getting too hot and overheating. This project uses a temperature sensor to measure the temperature inside the cabinet, and uses PWM control signals to set the speed to two computer fans to exhaust the hot air when things are getting too warm.</p>
			<h2>twa.ninja</h2>
			<p><a href="https://github.com/kiyoshigawa/twa.ninja">https://github.com/kiyoshigawa/twa.ninja</a></p>
			<p>This website is also up on GitHub if you're interested in seeing what's going on under the hood.</p>
		</div>
	`
};

const Contact = {
	mixins: [
		propsForRouterViewMixin
	],
	template: `
		<div class="body-content" id="body-content">
			<p>If you wish to contact tim, you can email tim@{this website's domain}.</p>
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
	{path: '/blog', component: Blog},
	{path: '/github', component: Github},
	{path: '/contact', component: Contact},
	{path: '/blog/:id', component: BlogPost},
	{path: '*', component: NotFound},
];

const router = new VueRouter({
	mode: 'history',
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
		link_object: {
			type: Object,
			required: true,
		},
	},
	template: `
		<router-link
			class="menu-link"
			:to="link_object.id"
		><span 
			class="menu-item"
		>{{ link_object.label }}</span>
		</router-link>
	`
});

let app = new Vue({
	router: router,
	el: '#app',
	data: {
		menu_list: [
			{id: '/about', label: 'About'},
			{id: '/blog', label: 'Blog'},
			{id: '/github', label: 'Github'},
			{id: '/contact', label: 'Contact'},
		],
		is_content_loading: true,
		content: [],
	},
	template: `
		<div class="app" id="app">
			<div class="header" id="header">
				<h1>
					<a 
						class="main-page-title-link"
						href="/about/"
					>twa.ninja</a>
				</h1>
				<h2>The Personal Website of Tim Anderson</h2>
			</div>
			<div class="menu" id="menu">
				<menu-item
					v-for="item of menu_list"
					:key="item.id"
					:link_object="item"
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

let content_url = '/content.json';

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
