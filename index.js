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
				This is the body content for the page. It's full of bodily goodness.
			</div>
			<div class="footer" id="footer">
				Feet go Here.
			</div>
		</div>
	`
})
