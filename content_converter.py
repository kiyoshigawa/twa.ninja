import json
from markdownify import markdownify as md
from markdownify import MarkdownConverter
from string import ascii_letters
import os

# This will have the markdownify converter skip iframe elements,
# so I can keep my YouTube embeds
class IframeConverter(MarkdownConverter):
    def convert_iframe(self, el, text, convert_as_inline):
        return self.process_text(el)

with open("old_website_files/content.json", encoding="utf8") as j:
    content = json.load(j)
    for post in content:
        file_path = "website\\content\\blog\\" + post["id"] + ".md"
        working_path =os.path.abspath(os.curdir)

        file_content = '+++\n'
        file_content += 'title = "' + post["title"] + '"\n'
        file_content += 'date = "' + (post["date_publish"]).split('T')[0] + '"\n'
        file_content += 'slug = "' + post["id"] + '"\n'
        file_content += '\n[extra]\n'
        if post["image"]["filename"]:
            file_content += 'image = "' + post["image"]["filename"] + '"\n'
        else:
            file_content += 'image = ""\n'
        blurb_contents = md(post["body"], strip=['a', 'img', 'iframe'])
        allowed = set(ascii_letters + ' ' + '/')
        blurb_contents = ''.join(filter(allowed.__contains__, blurb_contents))[0:2000]

        file_content += 'blurb = "' + blurb_contents + '..."\n'
        file_content += '+++\n\n'

        body_contents = post["body"]
        body_contents = body_contents.replace('/entry/', '/blog/')
        body_contents = IframeConverter().convert(body_contents)
        if post["image_list"]:
            body_contents += '<div class="post-images">\n'
            for image in post["image_list"]:
                body_contents += '<div class="post-image-holder">\n'
                image_path = image["filename"]
                body_contents += '<a class="image_link" target="_blank" href="' + image_path + '">\n'
                body_contents += '<img class="post-image" src="'+ image_path + '" title="' + image["title"] + '" alt="' + image["title"] + '"></a>\n'
                body_contents += '</div>\n'
            body_contents += '</div>\n'
        if post["file_list"]:
            body_contents += '<div class="post-files">\n<h3>Download Files:</h3>\n'
            for file in post["file_list"]:
                body_contents += '<div class="post-file">\n'
                page_file_path = file["filename"]
                body_contents += '<a href="' + page_file_path + '" target="_blank">' + file["title"] + '</a>\n'
                body_contents += '</div>\n'
            body_contents += '</div>\n'
        file_content += body_contents

        print(os.path.join(working_path, file_path))
        with open(os.path.join(working_path, file_path), 'w+', encoding='utf8') as f:
            f.write(file_content)
