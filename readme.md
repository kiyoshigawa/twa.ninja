# twa.ninja

This is a repo where I store the twa.ninja website code, as well as the relevant information for server setup that I use to host it.

On this branch specifically, I am converting the current javascript version of the site to use the Zola static site generator and md files for each blog post. To generate the site, all you need to do is run `zola build` in the `website` directory of this repo, and it will create the entire page in the `public` folder.

## Blog Post Instructions

To add a post to the blog, all you need to do is add a `*.md` file to the `website/content/blog` folder, and populate it with appropriate data. The blog posts have some required header information for proper page rendering, as shown here:

```markdown
+++
title = "Blog Title"
date = "2019-05-10"
slug = "blog_title"

[extra]
image = "/files/blog_title/image.png"
blurb = "This is a short summary of the blog post that will appear on index pages. If it is too long it will be automatically truncated."
+++

Below the header you just need to write markdown content for the blog post. You can also use html tags to do things like emebed YouTube videos, or post inline images and files for download. I am using specific html tags for the last two, which will be explained below.
```
You will note that the date format is just a string, formatted YYYY-MM-DD, and that the slug matches the title with spaces converted to underscores as my adopted naming convention. The slug is also used as the url path for the blog post, so changing it will break existing external links to blog posts.

The images and files used in the blog post are located in the `website/static/files/` directory. I have put them into subfolders that match the blog post slug. They can be referred to in posts under the path format `/files/<blog_slug>/<filename.ext>`. This file storage location is not a requirement of the zola engine, it is just a convention I have adopted to keep things somewhat organized.

My old blog (2 versions ago) had an automated process for adding images and files at the end of posts, which I manually converted for the javascript version into html. For this current version, I have kept the html formatting for adding images and files to the end of posts, but it must be manually added to the .md file for the blog post. The html tag formats for image and file attachments to blog posts are as follows: 

```html
<div class="post-images">
    <div class="post-image-holder">
        <a class="image_link" 
           target="_blank" 
           href="/files/{blog_slug}/{image_name.ext}">
            <img class="post-image" 
                 src="/files/{blog_slug}/{image_name.ext}" 
                 title="{Image Title Text}" 
                 alt="{Image Alt Text}">
        </a>
    </div>
    {multiple post-image-holder divs can be added here to show multiple images}
</div>
```
```html
<div class="post-files">
	<h3>Download Files:</h3>
	<div class="post-file">
		<a href="/files/{blog_slug}/{file_name.ext}" 
           target="_blank">
            {Download Link Text}
        </a>
	</div>
    {multiple post-file divs can be added here to show multiple files for download}
</div>
```
## Server Setup Instructions

Included in this repo in the `/server_config/tf` folder are some terraform config files that can be used to automatically set up the web server on my proxmox server using terraform. I've included a second readme in that folder specifically which explains what you will need to change in order to get that etup working.
