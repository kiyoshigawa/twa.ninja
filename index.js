let app = new Vue({
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
					<a 
						:href="'index.html#' + item.id"
					>{{ item.label }}</a>
				</span>
			</div>
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
						<a 
							:href="'index.html#' + blog_post.id"
						>{{ blog_post.title }}</a>
					</div>
				</div>
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
